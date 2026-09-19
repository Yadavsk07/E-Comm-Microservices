package com.app.payment_service.Dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePaymentRequest {

    @NotBlank
    private String orderId;
}