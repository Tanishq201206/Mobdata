package com.mobdata.mobdata.Entities;



import jakarta.persistence.*;

@Entity
@Table(name = "device_registry")
public class DeviceRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String imei;

    private String uuid;
    private String model;
    private String os;

    private  String location;

    @Column(unique = true)
    private String token;

    @Column(nullable = false)
    private boolean blocked = false;


    private boolean verified = false;
    private boolean dataSendingEnabled = false;

    @OneToOne
    private User user;

    // Constructors
    public DeviceRegistry() {}

    // Getters and Setters

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getImei() { return imei; }

    public void setImei(String imei) { this.imei = imei; }

    public String getUuid() { return uuid; }

    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getModel() { return model; }

    public void setModel(String model) { this.model = model; }

    public String getOs() { return os; }

    public void setOs(String os) { this.os = os; }

    public String getToken() { return token; }

    public void setToken(String token) { this.token = token; }

    public boolean isVerified() { return verified; }

    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean isDataSendingEnabled() { return dataSendingEnabled; }

    public void setDataSendingEnabled(boolean dataSendingEnabled) { this.dataSendingEnabled = dataSendingEnabled; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }
}
