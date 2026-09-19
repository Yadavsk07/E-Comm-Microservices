
package com.app.order_service.Dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {

    private String id;

    private Long userId;

    private Long productId;

    private String productName;

    private String productImage;

    private BigDecimal price;

    private Integer quantity;

    private BigDecimal subtotal;
}