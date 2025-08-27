package com.mobdata.mobdata.Repositories;

import com.mobdata.mobdata.Entities.DeviceDataRequest;
import com.mobdata.mobdata.Entities.DeviceDataRequestArchive;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceDataRequestArchiveRepository extends JpaRepository<DeviceDataRequestArchive, Long> {

}
