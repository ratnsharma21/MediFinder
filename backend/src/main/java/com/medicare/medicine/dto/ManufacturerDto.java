package com.medicare.medicine.dto;

public class ManufacturerDto {
    private Long id;
    private String name;
    private String country;
    private String website;
    private String contactEmail;
    private boolean verified;

    public ManufacturerDto() {}

    public ManufacturerDto(Long id, String name, String country, String website, String contactEmail, boolean verified) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.website = website;
        this.contactEmail = contactEmail;
        this.verified = verified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}
