package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Dto.DeviceRegisterDTO;
import com.mobdata.mobdata.Entities.DeviceRegistry;
import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import com.mobdata.mobdata.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/device")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/register")
    public ResponseEntity<?> registerDevice(@RequestBody DeviceRegisterDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }
        if (deviceRepo.findByToken(username + "_" + dto.getImei()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Device already registered");
        }
        if (!deviceRepo.findByUser_Username(username).isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already registered a device");
        }
        DeviceRegistry device = new DeviceRegistry();
        device.setUuid(dto.getUuid());
        device.setModel(dto.getModel());
        device.setOs(dto.getOs());
        device.setLocation(dto.getLocation());
        device.setUser(user);
        String token = username + "_" + UUID.randomUUID();
        device.setToken(token);
        device.setVerified(false); // admin will verify it
        device.setDataSendingEnabled(false); // admin enables sending
        deviceRepo.save(device);
        return ResponseEntity.ok(Map.of(
                "message", "Device registered. Awaiting admin verification.",
                "deviceToken", token
        ));

    }

    @GetMapping("/check")
    public ResponseEntity<?> checkDevice(@RequestParam String uuid) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid user"));
        }

        // Check if the user already has a registered device
        DeviceRegistry existingDevice = deviceRepo.findByUser_Username(username).stream().findFirst().orElse(null);

        if (existingDevice == null) {
            return ResponseEntity.ok(Map.of("message", "Device not registered"));
        }

        if(!existingDevice.isVerified()){
            return ResponseEntity.ok(Map.of("message", "Device not verified wait for admin to verify"));
        }



        // If registered UUID is different from current device UUID
        if (!existingDevice.getUuid().equals(uuid)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "message", "You have already registered a different device. Please use that or contact admin."
            ));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Device already registered",
                "verified", existingDevice.isVerified(),
                "dataSendingEnabled", existingDevice.isDataSendingEnabled()
        ));
    }


    @GetMapping("/attributes/{username}")
    public ResponseEntity<?> getDeviceByUsername(@PathVariable String username) {
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        DeviceRegistry device = deviceRepo.findByUser_Username(username).stream().findFirst().orElse(null);
        if (device == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Device not found"));
        }

        return ResponseEntity.ok(Map.of(
                "deviceId", device.getId(),
                "token", device.getToken()
        ));
    }



}
