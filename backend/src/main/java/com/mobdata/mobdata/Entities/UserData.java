package com.mobdata.mobdata.Entities;



import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_data")
public class UserData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String jsonPayload;

    private LocalDateTime receivedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private DeviceRegistry device;


    public UserData() {}


    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getJsonPayload() { return jsonPayload; }

    public void setJsonPayload(String jsonPayload) { this.jsonPayload = jsonPayload; }

    public LocalDateTime getReceivedAt() { return receivedAt; }

    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public DeviceRegistry getDevice() { return device; }

    public void setDevice(DeviceRegistry device) { this.device = device; }
}
