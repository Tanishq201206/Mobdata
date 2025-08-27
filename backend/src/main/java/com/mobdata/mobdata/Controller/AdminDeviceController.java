package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Entities.DeviceRegistry;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/devices")
public class AdminDeviceController {

    @Autowired
    private DeviceRepository deviceRepo;


    @GetMapping("/pending")
    public ResponseEntity<List<DeviceRegistry>> getPendingDevices() {
        return ResponseEntity.ok(deviceRepo.findByVerifiedFalse());
    }


    @PostMapping("/approve/{deviceId}")
    public ResponseEntity<?> approveDevice(@PathVariable Long deviceId,
                                           @RequestParam(defaultValue = "true") boolean enableData) {
        Optional<DeviceRegistry> optDevice = deviceRepo.findById(deviceId);

        if (optDevice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
        }

        DeviceRegistry device = optDevice.get();
        device.setVerified(enableData);
        device.setDataSendingEnabled(false);

        deviceRepo.save(device);
        return ResponseEntity.ok("Device approved = " + enableData);
    }





    @PostMapping("/block/{id}")
    public ResponseEntity<String> blockDevice(@PathVariable Long id) {
        Optional<DeviceRegistry> deviceOptional = deviceRepo.findById(id);
        if (deviceOptional.isPresent()) {
            DeviceRegistry device = deviceOptional.get();
            device.setBlocked(true);
            deviceRepo.save(device);
            return ResponseEntity.ok("Device blocked successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
    }

    @PostMapping("/unblock/{id}")
    public ResponseEntity<String> unblockDevice(@PathVariable Long id) {
        Optional<DeviceRegistry> deviceOptional = deviceRepo.findById(id);
        if (deviceOptional.isPresent()) {
            DeviceRegistry device = deviceOptional.get();
            device.setBlocked(false);
            deviceRepo.save(device);
            return ResponseEntity.ok("Device unblocked successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Device not found");
    }

}
