package com.app.order_service.Client;

import com.app.order_service.Config.FeignConfig;
import com.app.order_service.Dto.ProductResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "product-service",
        configuration = FeignConfig.class
)
public interface ProductClient {

    @GetMapping("/api/products/{id}")
    ProductResponse getProductById(
            @PathVariable Long id
    );

    @PutMapping("/api/products/internal/{id}/decrease-stock")
    void decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity
    );

    @PutMapping("/api/products/internal/{id}/increase-stock")
    void increaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity
    );
}