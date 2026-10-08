package com.medicare.pharmacy.dto;

public class PharmacySearchFilter {
    private String query;
    private String city;
    private String postalCode;
    private Boolean is24Hours;
    private Double latitude;
    private Double longitude;
    private Double radiusInKm = 10.0;
    private int page = 0;
    private int size = 10;

    public PharmacySearchFilter() {}

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Boolean getIs24Hours() {
        return is24Hours;
    }

    public void setIs24Hours(Boolean is24Hours) {
        this.is24Hours = is24Hours;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getRadiusInKm() {
        return radiusInKm;
    }

    public void setRadiusInKm(Double radiusInKm) {
        this.radiusInKm = radiusInKm != null ? radiusInKm : 10.0;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = Math.max(0, page);
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = (size <= 0) ? 10 : Math.min(size, 100);
    }
}
