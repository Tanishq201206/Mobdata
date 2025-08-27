package com.mobdata.mobdata.Service;

import com.mobdata.mobdata.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.mobdata.mobdata.Entities.User;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailOtpService {
    @Autowired
    private UserRepository userRepo;

    private final JavaMailSender mailSender;
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    public EmailOtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateOtp() {
        int otp = new Random().nextInt(900000) + 100000;
        return String.valueOf(otp);
    }

    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStorage.put(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Verification OTP");
        message.setText("Your OTP for email verification is: " + otp);
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        boolean isValid = storedOtp != null && storedOtp.equals(otp);
        if (isValid) {
            // Set emailVerified to true in DB
            userRepo.findByEmail(email).ifPresent(user -> {
                user.setEmailVerified(true);
                userRepo.save(user);
            });

        }
        return isValid;
    }



    public void removeOtp(String email) {
        otpStorage.remove(email);
    }
}
