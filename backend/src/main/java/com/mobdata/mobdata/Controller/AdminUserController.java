package com.mobdata.mobdata.Controller;


import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Entities.DeviceRegistry;
import com.mobdata.mobdata.Repositories.UserRepository;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin/manage")
public class AdminUserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private DeviceRepository deviceRepo;

    // ✅ 1. Get all users
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<User> usersPage = userRepo.findAll(pageable);

        // Optional: Clear password for each user
        usersPage.forEach(user -> user.setPassword(null));

        return ResponseEntity.ok(usersPage);
    }

    // ✅ 2. Get all devices
    @GetMapping("/devices")
    public ResponseEntity<Page<DeviceRegistry>> getAllDevices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<DeviceRegistry> devicesPage = deviceRepo.findAll(pageable);
        return ResponseEntity.ok(devicesPage);
    }

    // ✅ 3. Get devices of a specific user
    @GetMapping("/devices/user/{username}")
    public ResponseEntity<List<DeviceRegistry>> getDevicesByUsername(@PathVariable String username) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<DeviceRegistry> devices = deviceRepo.findByUser_Username(username);
        return ResponseEntity.ok(devices);
    }


    // ✅ Disable a user
    @PostMapping("/users/disable/{userId}")
    public ResponseEntity<?> disableUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        user.setEnabled(false);
        userRepo.save(user);

        return ResponseEntity.ok("User disabled successfully");
    }

    // ✅ Enable a user
    @PostMapping("/users/enable/{userId}")
    public ResponseEntity<?> enableUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        user.setEnabled(true);
        userRepo.save(user);

        return ResponseEntity.ok("User enabled successfully");
    }



}

