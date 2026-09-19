package com.app.payment_service.Controller;

import com.app.payment_service.Dto.CreatePaymentRequest;
import com.app.payment_service.Dto.PaymentOrderResponse;
import com.app.payment_service.Dto.PaymentVerificationRequest;
import com.app.payment_service.Service.RazorpayService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(
            RazorpayService razorpayService) {

        this.razorpayService =
                razorpayService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(
            @Valid @RequestBody CreatePaymentRequest request,
            Authentication authentication)
            throws Exception {

        Long userId =
                (Long)
                        ((UsernamePasswordAuthenticationToken)
                                authentication)
                                .getDetails();

        PaymentOrderResponse response =
                razorpayService.createPaymentOrder(
                        request.getOrderId(),
                        userId,
                        "INR"
                );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @Valid @RequestBody
            PaymentVerificationRequest request,
            Authentication authentication)
            throws Exception {

        Long userId =
                (Long)
                        ((org.springframework.security
                                .authentication
                                .UsernamePasswordAuthenticationToken)
                                authentication)
                                .getDetails();

        razorpayService.verifyPayment(
                userId,
                request
        );

        return ResponseEntity.ok(
                "Payment verified successfully"
        );
    }
}
