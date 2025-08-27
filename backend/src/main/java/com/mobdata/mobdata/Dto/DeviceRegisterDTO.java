package com.mobdata.mobdata.Dto;

public class DeviceRegisterDTO {
    private String imei;
    private String uuid;
    private String model;
    private String os;
    private  String location;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImei() { return imei; }
    public void setImei(String imei) { this.imei = imei; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
}
