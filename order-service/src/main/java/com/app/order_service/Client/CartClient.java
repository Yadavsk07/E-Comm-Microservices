
package com.app.order_service.Client;

import com.app.order_service.Config.FeignConfig;
import com.app.order_service.Dto.CartItemResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(
        name = "cart-service",
        configuration = FeignConfig.class
)
public interface CartClient {

    @GetMapping("/api/cart/internal/{userId}")
    List<CartItemResponse> getCart(
            @PathVariable Long userId
    );

    @DeleteMapping("/api/cart/internal/{userId}")
    void clearCart(
            @PathVariable Long userId
    );
}