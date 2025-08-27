package com.mobdata.mobdata.Dto;

import java.util.Map;

public class UserDataDTO {
    private String token;        // Device token
    private Map<String, Object> jsonPayload; // The data

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Map<String, Object> getJsonPayload() {
        return jsonPayload;
    }

    public void setJsonPayload(Map<String, Object> jsonPayload) {
        this.jsonPayload = jsonPayload;
    }
}
