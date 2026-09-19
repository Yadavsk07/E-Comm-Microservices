
package com.app.order_service.Service;

import com.app.order_service.Client.CartClient;
import com.app.order_service.Client.ProductClient;
import com.app.order_service.Dto.CartItemResponse;
import com.app.order_service.Dto.OrderItemDto;
import com.app.order_service.Dto.OrderResponse;
import com.app.order_service.Model.Order;
import com.app.order_service.Model.OrderItem;
import com.app.order_service.Model.OrderStatus;
import com.app.order_service.Repository.OrderRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartClient cartClient;
    private final ProductClient productClient;

    public OrderService(
            OrderRepository orderRepository,
            CartClient cartClient,
            ProductClient productClient) {

        this.orderRepository = orderRepository;
        this.cartClient = cartClient;
        this.productClient = productClient;
    }

    public OrderResponse createOrder(Long userId) {

        List<CartItemResponse> cartItems =
                cartClient.getCart(userId);

        if (cartItems == null || cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }

        List<OrderItem> orderItems =
                new ArrayList<>();

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        List<CartItemResponse> processedItems =
                new ArrayList<>();

        try {

            for (CartItemResponse cartItem : cartItems) {

                var product =
                        productClient.getProductById(
                                cartItem.getProductId()
                        );

                if (product == null ||
                        !Boolean.TRUE.equals(
                                product.getActive())) {

                    throw new RuntimeException(
                            "Product not available: "
                                    + cartItem.getProductId()
                    );
                }

                if (product.getStockQuantity()
                        < cartItem.getQuantity()) {

                    throw new RuntimeException(
                            "Insufficient stock for product: "
                                    + product.getName()
                    );
                }

                productClient.decreaseStock(
                        product.getId(),
                        cartItem.getQuantity()
                );

                processedItems.add(cartItem);

                BigDecimal subtotal =
                        product.getPrice()
                                .multiply(
                                        BigDecimal.valueOf(
                                                cartItem.getQuantity()
                                        )
                                );

                OrderItem orderItem =
                        new OrderItem();

                orderItem.setProductId(
                        product.getId()
                );

                orderItem.setProductName(
                        product.getName()
                );

                orderItem.setProductImage(
                        product.getImageUrl()
                );

                orderItem.setPrice(
                        product.getPrice()
                );

                orderItem.setQuantity(
                        cartItem.getQuantity()
                );

                orderItem.setSubtotal(
                        subtotal
                );

                orderItems.add(orderItem);

                totalAmount =
                        totalAmount.add(subtotal);
            }

            Order order =
                    new Order();

            order.setUserId(userId);

            order.setTotalAmount(
                    totalAmount
            );

            order.setItems(
                    orderItems
            );

            order.setStatus(
                    OrderStatus.PAYMENT_PENDING
            );

            Order savedOrder =
                    orderRepository.save(order);

            cartClient.clearCart(userId);

            return mapToResponse(savedOrder);

        } catch (Exception exception) {

            // Compensation:
            // restore stock for products already processed

            for (CartItemResponse item :
                    processedItems) {

                try {

                    productClient.increaseStock(
                            item.getProductId(),
                            item.getQuantity()
                    );

                } catch (Exception ignored) {

                    System.err.println(
                            "Failed to restore stock for product "
                                    + item.getProductId()
                    );
                }
            }

            throw exception;
        }
    }

    public List<OrderResponse> getUserOrders(
            Long userId) {

        return orderRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrder(
            String orderId,
            Long userId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        if (!order.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You cannot access this order"
            );
        }

        return mapToResponse(order);
    }

    public Order updatePaymentStatus(
            String paymentOrderId,
            String paymentId) {

        Order order =
                orderRepository
                        .findByPaymentOrderId(
                                paymentOrderId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"
                                ));

        order.setPaymentId(paymentId);

        order.setStatus(
                OrderStatus.CONFIRMED
        );

        return orderRepository.save(order);
    }

    private OrderResponse mapToResponse(
            Order order) {

        List<OrderItemDto> items =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemDto(
                                        item.getProductId(),
                                        item.getProductName(),
                                        item.getProductImage(),
                                        item.getPrice(),
                                        item.getQuantity(),
                                        item.getSubtotal()
                                )
                        )
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentOrderId(),
                order.getPaymentId(),
                items,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public Optional<OrderResponse> getOrderInternal(String orderId) {

        return orderRepository.findById(orderId)
                .map(this::mapToResponse);
    }

    public void updatePaymentOrderId(
            String orderId,
            String paymentOrderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        order.setPaymentOrderId(paymentOrderId);

        orderRepository.save(order);
    }
}