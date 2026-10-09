package com.medicare.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {

    @NotBlank(message = "Google ID token or email is required")
    private String idToken;

    private String email;
    private String name;
    private String avatarUrl;

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String idToken, String email, String name, String avatarUrl) {
        this.idToken = idToken;
        this.email = email;
        this.name = name;
        this.avatarUrl = avatarUrl;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
