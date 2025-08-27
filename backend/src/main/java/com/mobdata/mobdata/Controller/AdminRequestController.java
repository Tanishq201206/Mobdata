package com.mobdata.mobdata.Controller;


import com.mobdata.mobdata.Entities.DeviceDataRequest;
import com.mobdata.mobdata.Entities.DeviceDataRequestArchive;
import com.mobdata.mobdata.Repositories.DeviceDataRequestArchiveRepository;
import com.mobdata.mobdata.Repositories.DeviceDataRequestRepository;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/data-requests")
public class AdminRequestController {

    @Autowired
    private DeviceDataRequestRepository requestRepo;

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private DeviceDataRequestArchiveRepository archiveRepo;


    @GetMapping("/pending")
    public ResponseEntity<List<DeviceDataRequest>> getPendingRequests() {
        return ResponseEntity.ok(requestRepo.findByApprovedFalse());
    }


    // give list of all data request which are approved
    @GetMapping("/all")
    public ResponseEntity<List<DeviceDataRequestArchive>> getAllRequests() {
        return ResponseEntity.ok(archiveRepo.findAll());
    }


    @PostMapping("/approve/{requestId}")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId) {
        Optional<DeviceDataRequest> reqOpt = requestRepo.findById(requestId);

        if (reqOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found");

        DeviceDataRequest req = reqOpt.get();
        req.setApproved(true);
        req.setApprovedAt(LocalDateTime.now());
        if (req.getDevice() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No device linked to this request");
        }


        // Optional: auto-enable data sending after approval
        var device = req.getDevice();
        device.setDataSendingEnabled(true);

        requestRepo.save(req);
        deviceRepo.save(device);

        return ResponseEntity.ok("Request approved. Data sending enabled.");
    }
}
