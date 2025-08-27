package com.mobdata.mobdata.Entities;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "device_data_request")
public class DeviceDataRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean approved = false;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private DeviceRegistry device;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Constructors
    public DeviceDataRequest() {}

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public boolean isApproved() { return approved; }

    public void setApproved(boolean approved) { this.approved = approved; }

    public LocalDateTime getRequestedAt() { return requestedAt; }

    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }

    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public DeviceRegistry getDevice() { return device; }

    public void setDevice(DeviceRegistry device) { this.device = device; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }
}
