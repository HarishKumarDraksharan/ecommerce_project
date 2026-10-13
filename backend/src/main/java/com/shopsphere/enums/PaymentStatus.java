package com.shopsphere.enums;

/** Payment status lifecycle */
public enum PaymentStatus {
    PENDING,
    INITIATED,
    AUTHORIZED,
    CAPTURED,
    SUCCESS,
    FAILED,
    REFUNDED,
    PARTIALLY_REFUNDED
}
