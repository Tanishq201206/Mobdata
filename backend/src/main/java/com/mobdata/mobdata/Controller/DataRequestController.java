package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Entities.DeviceDataRequest;
import com.mobdata.mobdata.Entities.DeviceRegistry;
import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Repositories.DeviceDataRequestRepository;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import com.mobdata.mobdata.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/data")
public class DataRequestController {

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private DeviceDataRequestRepository requestRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping("/request-permission/{deviceId}")
    public ResponseEntity<?> requestPermission(@PathVariable Long deviceId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");

        User user = userOpt.get();
        Optional<DeviceRegistry> deviceOpt = deviceRepo.findById(deviceId);

        if (deviceOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");

        DeviceRegistry device = deviceOpt.get();

        if (!device.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Device not owned by you");
        }
        if(device.isBlocked() || !device.isVerified())
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("disabled and unverified device can't request");
        }

        if (requestRepo.findByDevice_Id(deviceId).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Request already submitted");
        }


        DeviceDataRequest request = new DeviceDataRequest();
        request.setUser(user);
        request.setDevice(device);
        request.setRequestedAt(LocalDateTime.now());
        request.setApproved(false);

        requestRepo.save(request);
        return ResponseEntity.ok("Request submitted. Await admin approval.");
    }
}
