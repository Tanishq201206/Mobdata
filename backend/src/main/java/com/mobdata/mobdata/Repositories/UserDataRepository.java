package com.mobdata.mobdata.Repositories;

import com.mobdata.mobdata.Entities.User;
import com.mobdata.mobdata.Entities.UserData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDataRepository extends JpaRepository<UserData, Long> {
    List<UserData> findByUser(User user);

}