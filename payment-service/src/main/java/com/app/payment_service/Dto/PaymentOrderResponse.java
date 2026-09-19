package com.app.payment_service.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderResponse {

    private String razorpayOrderId;

    private String orderId;

    private String currency;

    private Integer amount;

    private String status;
}