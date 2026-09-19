
package com.app.payment_service.Dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class PaymentVerificationRequest {

    @NotBlank
    private String razorpayOrderId;

    @NotBlank
    private String razorpayPaymentId;

    @NotBlank
    private String razorpaySignature;
}
