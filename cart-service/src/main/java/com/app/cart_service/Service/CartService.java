package com.app.cart_service.Service;

import com.app.cart_service.Client.ProductClient;
import com.app.cart_service.Dto.CartItemRequest;
import com.app.cart_service.Dto.CartItemResponse;
import com.app.cart_service.Dto.ProductResponse;
import com.app.cart_service.Model.CartItem;
import com.app.cart_service.Repository.CartItemRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductClient productClient;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductClient productClient) {

        this.cartItemRepository = cartItemRepository;
        this.productClient = productClient;
    }

    @CacheEvict(
            value = "cart",
            key = "#p0"
    )
    public CartItemResponse addToCart(
            Long userId,
            CartItemRequest request) {

        ProductResponse product =
                productClient.getProductById(request.getProductId());

        if (product == null || !Boolean.TRUE.equals(product.getActive())) {
            throw new RuntimeException("Product not found or inactive");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient product stock");
        }

        CartItem item =
                cartItemRepository
                        .findByUserIdAndProductId(
                                userId,
                                request.getProductId());

        if (item == null)
            item = new CartItem();


        item.setUserId(userId);
        item.setProductId(product.getId());
        item.setQuantity(
                item.getQuantity() == null
                        ? request.getQuantity()
                        : item.getQuantity() + request.getQuantity()
        );

        item.setPrice(product.getPrice());

        CartItem saved =
                cartItemRepository.save(item);

        return mapToResponse(saved, product);
    }


    @Cacheable(
            value = "cart",
            key = "#p0"
    )
    public List<CartItemResponse> getCart(Long userId) {

        System.out.println("Fetching Cart Items from Mongodb");
        List<CartItem> items =
                cartItemRepository.findByUserId(userId);

        return items.stream()
                .map(item -> {

                    ProductResponse product =
                            productClient.getProductById(
                                    item.getProductId());

                    return mapToResponse(item, product);
                })
                .toList();
    }


    @CacheEvict(
            value = "cart",
            key = "#p0"
    )
    public void removeFromCart(
            Long userId,
            Long productId) {

        cartItemRepository
                .deleteByUserIdAndProductId(
                        userId,
                        productId);
    }


    @CacheEvict(
            value = "cart",
            key = "#p0"
    )
    public void clearCart(Long userId) {

        cartItemRepository.deleteByUserId(userId);
    }


    private CartItemResponse mapToResponse(
            CartItem item,
            ProductResponse product) {

        CartItemResponse response =
                new CartItemResponse();

        response.setId(item.getId());
        response.setUserId(item.getUserId());
        response.setProductId(item.getProductId());
        response.setQuantity(item.getQuantity());

        response.setPrice(product.getPrice());
        response.setProductName(product.getName());
        response.setProductImage(product.getImageUrl());

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()));

        response.setSubtotal(subtotal);

        return response;
    }
}