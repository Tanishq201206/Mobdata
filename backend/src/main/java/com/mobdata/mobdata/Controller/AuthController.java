package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Dto.AuthRequestDTO;
import com.mobdata.mobdata.Dto.ForgotPasswordDTO;
import com.mobdata.mobdata.Dto.OtpRequestDTO;
import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Enum.Role;
import com.mobdata.mobdata.Repositories.UserRepository;
import com.mobdata.mobdata.Service.EmailOtpService;
import com.mobdata.mobdata.Utility.JwtUtil;
import com.mobdata.mobdata.Utility.TOTPUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;


    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailOtpService emailOtpService;




    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequestDTO dto) {
        if (userRepo.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }



        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setAddress(dto.getAddress());
        user.setCity(dto.getCity());
        user.setState(dto.getState());
        user.setFirstLogin(false);
        user.setPincode(dto.getPincode());
        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setRole(Role.ROLE_USER);

        userRepo.save(user);



        return ResponseEntity.ok("User registered successfully");
    }



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO dto,HttpServletResponse response,
                                   @RequestParam(defaultValue = "web") String client) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
            );

            User user = userRepo.findByUsername(dto.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            if (user.getRole() == Role.ROLE_USER && "web".equalsIgnoreCase(client)) {
                return ResponseEntity.status(403).body("Users can't login on web");
            }
            if (!user.isEmailVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Please verify your email to continue.");
            }
            if (!user.isMfaEnabled()) {
                return ResponseEntity.ok(Map.of(
                        "message", "MFA not set up. Please complete setup at /auth/setup-mfa"
                ));
            }

            if (!user.isEnabled()) {
                return ResponseEntity.ok(Map.of(
                        "message", "you have been disabled"
                ));
            }
            // MFA is enabled, ask for OTP
            return ResponseEntity.ok(Map.of(
                    "message", "MFA enabled. Please verify OTP using /auth/verify-otp"
            ));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }



    @PostMapping("/setup-mfa")
    public ResponseEntity<?> setupMfa(@RequestBody AuthRequestDTO dto) {
        User user = userRepo.findByUsername(dto.getUsername()).orElse(null);

        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        if (user.getSecret() != null && user.isMfaEnabled()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("MFA is already enabled");
        }

        String secret = TOTPUtil.generateSecretKey();
        String uri = TOTPUtil.getTOTPURI(dto.getUsername(), secret, "MobDataApp");

        String base64Qr;
        try {
            byte[] qrBytes = TOTPUtil.generateQRCode(uri);
            base64Qr = Base64.getEncoder().encodeToString(qrBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate QR code");
        }

        user.setSecret(secret);
        user.setMfaEnabled(true);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "MFA setup required. Scan the QR or use the secret key.",
                "secret", secret,
                "qrImageBase64", base64Qr,
                "otpUri", uri  // optional: for Google Authenticator app
        ));
    }



    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequestDTO dto,
                                       HttpServletResponse response,
                                       @RequestParam(defaultValue = "web") String client) {

        User user = userRepo.findByUsername(dto.getUsername()).orElse(null);


        if (user.getRole() == Role.ROLE_USER && "web".equalsIgnoreCase(client)) {
           return ResponseEntity.status(403).body("Users can't login on web");
        }

        if (user == null || !user.isMfaEnabled()) {
            return ResponseEntity.status(400).body("MFA not set up");
        }

        boolean isCodeValid = TOTPUtil.verifyCode(user.getSecret(), Integer.parseInt(dto.getOtp()));

        if (!isCodeValid) {
            return ResponseEntity.status(401).body("Invalid OTP");
        }

        String token = jwtUtil.generateToken(dto.getUsername(), user.getRole());

        if (client.equalsIgnoreCase("web")) {
            // ✅ Set JWT in HttpOnly cookie
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true); // Only over HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(15 * 60); //15 min

            response.addCookie(cookie);
            return ResponseEntity.ok("OTP verified, token set in cookie");
        } else {

            if (!user.isFirstLogin()) {
                return ResponseEntity.ok(Map.of(
                        "message", "First login. Please change your password."

                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "token", token
                ));
            }


        }
    }



    @PostMapping("/set-new-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDTO dto) {
        User user = userRepo.findByUsername(dto.getUsername()).orElse(null);

        if (user == null || user.getSecret() == null || !user.isMfaEnabled()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("MFA not configured for this user");
        }


        boolean isOtpValid = TOTPUtil.verifyCode(user.getSecret(), Integer.parseInt(dto.getOtp()));
        if (!isOtpValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP");
        }


        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setFirstLogin(true);
        userRepo.save(user);

        return ResponseEntity.ok("Password has been reset successfully.");
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        String token = null;
        String username = null;

        // 1. Try to get from Cookie (admin)
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if ("jwt".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        // 2. If not found in cookie, try Header (user)
        if (token == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // 3. If token found, extract username and validate
        if (token != null) {
            try {
                username = jwtUtil.extractUsername(token); // Validate and extract
                return ResponseEntity.ok(Map.of("authenticated", true, "username", username));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
    }



    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // for HTTPS only
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out");
    }


    @PostMapping("/send-email-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        emailOtpService.sendOtp(email);
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = emailOtpService.verifyOtp(email, otp);
        if (isValid) {
            emailOtpService.removeOtp(email);
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
        }
    }



}
