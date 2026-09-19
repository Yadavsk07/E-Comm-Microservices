package com.app.product_service.Dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    Long id;

    @NotBlank(message = "Product name is required")
    String name;

    String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true)
    BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock cannot be negative")
    Integer stockQuantity;

    @NotBlank(message = "Category is required")
    String category;

    String imageUrl;

    Boolean active;

}


