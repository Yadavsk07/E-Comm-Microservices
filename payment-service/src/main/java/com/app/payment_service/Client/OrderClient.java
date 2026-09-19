package com.app.payment_service.Client;

import com.app.payment_service.Config.FeignConfig;
import com.app.payment_service.Dto.OrderResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "order-service",
        configuration = FeignConfig.class
)
public interface OrderClient {

    @GetMapping("/api/orders/internal/{orderId}")
    OrderResponse getOrder(
            @PathVariable String orderId
    );

    @PutMapping("/api/orders/internal/payment-order")
    void updatePaymentOrderId(
            @RequestParam String orderId,
            @RequestParam String paymentOrderId
    );

    @PutMapping("/api/orders/internal/payment-success")
    void paymentSuccess(
            @RequestParam String paymentOrderId,
            @RequestParam String paymentId
    );
}