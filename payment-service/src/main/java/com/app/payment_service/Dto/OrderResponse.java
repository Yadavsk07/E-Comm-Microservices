
package com.app.payment_service.Dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderResponse {

    private String id;

    private Long userId;

    private BigDecimal totalAmount;

    private String status;
}