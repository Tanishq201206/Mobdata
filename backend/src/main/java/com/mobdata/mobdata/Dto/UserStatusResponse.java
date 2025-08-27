package com.mobdata.mobdata.Dto;

public class UserStatusResponse {
    private String email;
    private boolean emailVerified;
    private boolean deviceApproved;
    private boolean dataSendingEnabled;
    private boolean dataRequestStatus;
    private boolean deiceBlocked;


    public boolean isDeiceBlocked() {
        return deiceBlocked;
    }

    public void setDeiceBlocked(boolean deiceBlocked) {
        this.deiceBlocked = deiceBlocked;
    }

    public boolean isDataRequestStatus() {
        return dataRequestStatus;
    }

    public void setDataRequestStatus(boolean dataRequestStatus) {
        this.dataRequestStatus = dataRequestStatus;
    }

    public boolean isDataSendingEnabled() {
        return dataSendingEnabled;
    }

    public void setDataSendingEnabled(boolean dataSendingEnabled) {
        this.dataSendingEnabled = dataSendingEnabled;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isDeviceApproved() {
        return deviceApproved;
    }

    public void setDeviceApproved(boolean deviceApproved) {
        this.deviceApproved = deviceApproved;
    }


}
