package com.mobdata.mobdata.Repositories;




import com.mobdata.mobdata.Entities.DeviceRegistry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DeviceRepository extends JpaRepository<DeviceRegistry, Long> {
    DeviceRegistry findByToken(String token);
    List<DeviceRegistry> findByVerifiedFalse();
    List<DeviceRegistry> findByUserId(Long userId);
    List<DeviceRegistry> findByUser_Username(String username);
    Page<DeviceRegistry> findAll(Pageable pageable);
    DeviceRegistry findByUuidAndUser_Username(String uuid, String username);
    boolean existsByUser_UsernameAndVerified(String username, boolean verified);



}