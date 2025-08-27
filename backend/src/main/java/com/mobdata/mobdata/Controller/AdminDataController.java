package com.mobdata.mobdata.Controller;

import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Entities.UserData;
import com.mobdata.mobdata.Repositories.UserDataRepository;
import com.mobdata.mobdata.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/data")
public class AdminDataController {

    @Autowired
    private UserDataRepository dataRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ 1. Get all submitted data
    @GetMapping("/all")
    public ResponseEntity<List<UserData>> getAllData() {
        return ResponseEntity.ok(dataRepo.findAll());
    }

    // ✅ 2. Get data submitted by a specific user
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getDataByUsername(@PathVariable String username) {
        Optional<User> userOpt = userRepo.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        List<UserData> userData = dataRepo.findByUser(userOpt.get());
        return ResponseEntity.ok(userData);
    }
}
