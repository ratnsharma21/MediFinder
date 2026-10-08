package com.medicare.medicine.dto;

import java.math.BigDecimal;

public class RetailerOfferDto {
    private Long id;
    private Long retailerId;
    private String retailerName;
    private String retailerLogoUrl;
    private BigDecimal retailerRating;
    private BigDecimal sellingPrice;
    private BigDecimal discountPercent;
    private String productUrl;
    private boolean inStock;
    private Integer deliveryEstimateDays;

    public RetailerOfferDto() {}

    public RetailerOfferDto(Long id, Long retailerId, String retailerName, String retailerLogoUrl, BigDecimal retailerRating, BigDecimal sellingPrice, BigDecimal discountPercent, String productUrl, boolean inStock, Integer deliveryEstimateDays) {
        this.id = id;
        this.retailerId = retailerId;
        this.retailerName = retailerName;
        this.retailerLogoUrl = retailerLogoUrl;
        this.retailerRating = retailerRating;
        this.sellingPrice = sellingPrice;
        this.discountPercent = discountPercent;
        this.productUrl = productUrl;
        this.inStock = inStock;
        this.deliveryEstimateDays = deliveryEstimateDays;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRetailerId() {
        return retailerId;
    }

    public void setRetailerId(Long retailerId) {
        this.retailerId = retailerId;
    }

    public String getRetailerName() {
        return retailerName;
    }

    public void setRetailerName(String retailerName) {
        this.retailerName = retailerName;
    }

    public String getRetailerLogoUrl() {
        return retailerLogoUrl;
    }

    public void setRetailerLogoUrl(String retailerLogoUrl) {
        this.retailerLogoUrl = retailerLogoUrl;
    }

    public BigDecimal getRetailerRating() {
        return retailerRating;
    }

    public void setRetailerRating(BigDecimal retailerRating) {
        this.retailerRating = retailerRating;
    }

    public BigDecimal getSellingPrice() {
        return sellingPrice;
    }

    public void setSellingPrice(BigDecimal sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }

    public String getProductUrl() {
        return productUrl;
    }

    public void setProductUrl(String productUrl) {
        this.productUrl = productUrl;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public Integer getDeliveryEstimateDays() {
        return deliveryEstimateDays;
    }

    public void setDeliveryEstimateDays(Integer deliveryEstimateDays) {
        this.deliveryEstimateDays = deliveryEstimateDays;
    }
}
