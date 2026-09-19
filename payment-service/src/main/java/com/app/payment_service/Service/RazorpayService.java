package com.app.payment_service.Service;

import com.app.payment_service.Client.OrderClient;
import com.app.payment_service.Dto.OrderResponse;
import com.app.payment_service.Dto.PaymentOrderResponse;
import com.app.payment_service.Dto.PaymentVerificationRequest;
import com.app.payment_service.Model.Payment;
import com.app.payment_service.Model.PaymentStatus;
import com.app.payment_service.Repository.PaymentRepository;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    private final PaymentRepository paymentRepository;

    private final OrderClient orderClient;

    public RazorpayService(
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret,
            PaymentRepository paymentRepository,
            OrderClient orderClient) throws Exception {

        this.razorpayClient =
                new RazorpayClient(
                        keyId,
                        keySecret
                );

        this.paymentRepository =
                paymentRepository;

        this.orderClient =
                orderClient;
    }

    public PaymentOrderResponse createPaymentOrder(
            String orderId,
            Long userId,
            String currency)
            throws Exception {

        Optional<Payment> existingPayment =
                paymentRepository.findByOrderId(orderId);

        if (existingPayment.isPresent()) {
            Payment existing = existingPayment.get();

            if (existing.getStatus() == PaymentStatus.CREATED) {
                throw new RuntimeException(
                        "Payment order already created for this order"
                );
            }

            if (existing.getStatus() == PaymentStatus.SUCCESS) {
                throw new RuntimeException(
                        "Order has already been paid"
                );
            }
        }

        // 1. Get the order from Order Service
        OrderResponse order = orderClient.getOrder(orderId);
        System.out.println(order);

        if (order == null) {
            throw new RuntimeException("Order not found");
        }

        // 2. Verify that the order belongs to the logged-in user
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException(
                    "Order does not belong to authenticated user"
            );
        }

        // 3. Validate order status
        if (!"PAYMENT_PENDING".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Order is not available for payment"
            );
        }

        // 4. Get authoritative amount from Order Service
        BigDecimal amount = order.getTotalAmount();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Invalid order total amount"
            );
        }

        // 5. Convert rupees to paise
        int amountInPaise = amount
                .multiply(BigDecimal.valueOf(100))
                .intValueExact();

        // 6. Create Razorpay order
        JSONObject options = new JSONObject();

        options.put("amount", amountInPaise);
        options.put("currency", currency);
        options.put("receipt", orderId);

        com.razorpay.Order razorpayOrder =
                razorpayClient.orders.create(options);

        String razorpayOrderId =
                razorpayOrder.get("id");

        orderClient.updatePaymentOrderId(
                orderId,
                razorpayOrderId
        );

        // 7. Save payment record
        Payment payment = new Payment();

        payment.setUserId(userId);
        payment.setOrderId(orderId);
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setStatus(PaymentStatus.CREATED);

        paymentRepository.save(payment);

        // 8. Return Razorpay order details
        return new PaymentOrderResponse(
                razorpayOrderId,
                orderId,
                currency,
                amountInPaise,
                razorpayOrder.get("status")
        );
    }

    public void verifyPayment(
            Long userId,
            PaymentVerificationRequest request)
            throws Exception {

        System.out.println("Inside Payment Verify");

        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(
                                request.getRazorpayOrderId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment order not found"
                                ));

        if (!payment.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "Payment does not belong to user"
            );
        }

        if (paymentRepository
                .existsByRazorpayPaymentId(
                        request.getRazorpayPaymentId()
                )) {

            throw new RuntimeException(
                    "Payment already processed"
            );
        }

        String payload =
                request.getRazorpayOrderId()
                        + "|"
                        + request.getRazorpayPaymentId();

        boolean valid =
                Utils.verifySignature(
                        payload,
                        request.getRazorpaySignature(),
                        getKeySecret()
                );

        if (!valid) {

            payment.setStatus(
                    PaymentStatus.FAILED
            );

            paymentRepository.save(payment);

            throw new RuntimeException(
                    "Invalid Razorpay signature"
            );
        }

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setRazorpaySignature(
                request.getRazorpaySignature()
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        paymentRepository.save(payment);

        orderClient.paymentSuccess(
                payment.getRazorpayOrderId(),
                payment.getRazorpayPaymentId()
        );
    }

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private String getKeySecret() {
        return keySecret;
    }
}