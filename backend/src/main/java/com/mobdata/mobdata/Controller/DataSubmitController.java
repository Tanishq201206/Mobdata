package com.mobdata.mobdata.Controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobdata.mobdata.Dto.UserDataDTO;
import com.mobdata.mobdata.Entities.*;
import com.mobdata.mobdata.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/data")
public class DataSubmitController {

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private DeviceDataRequestArchiveRepository archiveRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserDataRepository dataRepo;

    @Autowired
    private DeviceDataRequestRepository requestRepo;

    @PostMapping("/submit")
    public ResponseEntity<?> submitData(@RequestBody UserDataDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        DeviceRegistry device = deviceRepo.findByToken(dto.getToken());
        if (device == null || !device.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid device or not your device");
        }
        if (!device.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Device not verified");
        }
        if (!device.isDataSendingEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Data sending not approved");
        }
        // Parse and save data
        UserData data = new UserData();
        data.setUser(user);
        data.setDevice(device);
        try {
            String payload = new ObjectMapper().writeValueAsString(dto.getJsonPayload());
            data.setJsonPayload(payload);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payload format");
        }
        data.setReceivedAt(LocalDateTime.now());
        dataRepo.save(data);
        Optional<DeviceDataRequest> requestOpt = requestRepo.findByDevice_Id(device.getId());
        if (requestOpt.isPresent()) {
            DeviceDataRequest req = requestOpt.get();
            DeviceDataRequestArchive archive = new DeviceDataRequestArchive();
            archive.setOriginalRequestId(req.getId());
            archive.setRequestedAt(req.getRequestedAt());
            archive.setApproved(req.isApproved());
            archive.setApprovedAt(req.getApprovedAt());
            archive.setArchivedAt(LocalDateTime.now());
            archive.setDeviceId(device.getId());
            archive.setDeviceUUID(device.getUuid());
            archive.setDeviceModel(device.getModel());
            if (req.getUser() != null) {
                archive.setUserId(req.getUser().getId());
                archive.setUsername(req.getUser().getUsername());
            }
            archiveRepo.save(archive);
            requestRepo.delete(req);
        }
        // Disable data sending after one-time use
        device.setDataSendingEnabled(false);
        deviceRepo.save(device);
        return ResponseEntity.ok("Data received and request archived.");
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<?> getMySubmittedData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user");
        }

        User user = userOpt.get();
        List<UserData> submittedData = dataRepo.findByUser(user);

        return ResponseEntity.ok(submittedData);
    }

}
