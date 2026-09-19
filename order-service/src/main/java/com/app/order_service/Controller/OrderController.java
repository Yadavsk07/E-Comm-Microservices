
package com.app.order_service.Controller;

import com.app.order_service.Dto.OrderResponse;
import com.app.order_service.Service.OrderService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService) {

        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            Authentication authentication) {

        Long userId =
                (Long)
                        ((org.springframework.security
                                .authentication
                                .UsernamePasswordAuthenticationToken)
                                authentication)
                                .getDetails();

        return ResponseEntity.ok(
                orderService.createOrder(userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            Authentication authentication) {

        Long userId =
                (Long)
                        ((org.springframework.security
                                .authentication
                                .UsernamePasswordAuthenticationToken)
                                authentication)
                                .getDetails();

        return ResponseEntity.ok(
                orderService.getUserOrders(userId)
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable String orderId,
            Authentication authentication) {

        Long userId =
                (Long)
                        ((org.springframework.security
                                .authentication
                                .UsernamePasswordAuthenticationToken)
                                authentication)
                                .getDetails();

        return ResponseEntity.ok(
                orderService.getOrder(
                        orderId,
                        userId
                )
        );
    }

    @PutMapping("/internal/payment-success")
    public ResponseEntity<Void> paymentSuccess(
            @RequestParam String paymentOrderId,
            @RequestParam String paymentId) {

        orderService.updatePaymentStatus(
                paymentOrderId,
                paymentId
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/internal/{orderId}")
    public ResponseEntity<OrderResponse> getOrderInternal(
            @PathVariable String orderId) {

        return orderService.getOrderInternal(orderId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/internal/payment-order")
    public ResponseEntity<Void> updatePaymentOrderId(
            @RequestParam String orderId,
            @RequestParam String paymentOrderId) {

        orderService.updatePaymentOrderId(
                orderId,
                paymentOrderId
        );

        return ResponseEntity.ok().build();
    }
}