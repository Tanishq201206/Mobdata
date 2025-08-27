package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Dto.UserStatusResponse;
import com.mobdata.mobdata.Entities.DeviceRegistry;
import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Repositories.DeviceDataRequestRepository;
import com.mobdata.mobdata.Repositories.DeviceRepository;
import com.mobdata.mobdata.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.mobdata.mobdata.Entities.DeviceDataRequest;


import java.util.Optional;

@RestController
@RequestMapping("/app/user")
public class AppUserStatusController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceDataRequestRepository dataRequestRepository;

    @GetMapping("/status/{username}")
    public ResponseEntity<?> getUserStatus(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        User user = userOpt.get();

        DeviceRegistry device = deviceRepository.findByUser_Username(username)
                .stream()
                .findFirst()
                .orElse(null);

        if (device == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Device not found");
        }

        boolean deviceApproved = device.isVerified();
        boolean deviceBlocked = device.isBlocked();
        boolean dataSendingEnabled = device.isDataSendingEnabled();

        boolean dataRequestStatus = dataRequestRepository
                .findByDevice_Id(device.getId())
                .map(DeviceDataRequest::isApproved)
                .orElse(false);

        UserStatusResponse response = new UserStatusResponse();
        response.setEmail(user.getEmail());
        response.setEmailVerified(Boolean.TRUE.equals(user.isEmailVerified()));
        response.setDeviceApproved(deviceApproved);
        response.setDataSendingEnabled(dataSendingEnabled);
        response.setDataRequestStatus(dataRequestStatus);
        response.setDeiceBlocked(deviceBlocked);

        return ResponseEntity.ok(response);
    }
}
