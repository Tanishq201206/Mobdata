package com.mobdata.mobdata.Repositories;



import com.mobdata.mobdata.Entities.DeviceDataRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceDataRequestRepository extends JpaRepository<DeviceDataRequest, Long> {
   Optional<DeviceDataRequest> findByDevice_Id(Long deviceId);
    Optional<DeviceDataRequest> findByDevice_IdAndApprovedFalse(Long deviceId);
    List<DeviceDataRequest> findByApprovedFalse();
    List<DeviceDataRequest> findByApprovedTrue();


}