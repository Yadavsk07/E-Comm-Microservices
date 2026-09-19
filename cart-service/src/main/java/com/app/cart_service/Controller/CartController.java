package com.app.cart_service.Controller;

import com.app.cart_service.Dto.CartItemRequest;
import com.app.cart_service.Dto.CartItemResponse;
import com.app.cart_service.Service.CartService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {

        Long userId =
                (Long) ((org.springframework.security.authentication
                        .UsernamePasswordAuthenticationToken)
                        authentication)
                        .getDetails();

        return ResponseEntity.ok(
                cartService.addToCart(
                        userId,
                        request
                )
        );
    }


    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(
            Authentication authentication) {

        System.out.println("Inside Get Cart");

        Long userId =
                (Long) ((org.springframework.security.authentication
                        .UsernamePasswordAuthenticationToken)
                        authentication)
                        .getDetails();

        System.out.println(userId);

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }


    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(
            Authentication authentication,
            @PathVariable Long productId) {

        Long userId =
                (Long) ((org.springframework.security.authentication
                        .UsernamePasswordAuthenticationToken)
                        authentication)
                        .getDetails();

        cartService.removeFromCart(
                userId,
                productId
        );

        return ResponseEntity.noContent().build();
    }


    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            Authentication authentication) {

        Long userId =
                (Long) ((org.springframework.security.authentication
                        .UsernamePasswordAuthenticationToken)
                        authentication)
                        .getDetails();

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/internal/{userId}")
    public ResponseEntity<List<CartItemResponse>> getCartInternal(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cartService.getCart(userId)
        );
    }

    @DeleteMapping("/internal/{userId}")
    public ResponseEntity<Void> clearCartInternal(
            @PathVariable Long userId) {

        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }
}