package com.app.order_service.Dto;

import com.app.order_service.Model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

     private String id;

     private Long userId;

     private BigDecimal totalAmount;

     private OrderStatus status;

     private String paymentOrderId;

     private String paymentId;

     private List<OrderItemDto> items;

     private LocalDateTime createdAt;

     private LocalDateTime updatedAt;
}
