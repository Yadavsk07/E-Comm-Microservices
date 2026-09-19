package com.app.product_service.Service;


import com.app.product_service.Dto.ProductRequest;
import com.app.product_service.Dto.ProductResponse;
import com.app.product_service.Model.Product;
import com.app.product_service.Repository.ProductRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @CacheEvict(value = {"products", "productSearch"}, allEntries = true)
    public ProductResponse createProduct(ProductRequest productRequest) {

        Product product = new Product();
        updateProductFromRequest(product , productRequest);
        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    private ProductResponse mapToProductResponse(Product savedProduct) {
        ProductResponse response = new ProductResponse();

        response.setId(savedProduct.getId());
        response.setName(savedProduct.getName());
        response.setDescription(savedProduct.getDescription());
        response.setCategory(savedProduct.getCategory());
        response.setActive(savedProduct.getActive());
        response.setImageUrl(savedProduct.getImageUrl());
        response.setPrice(savedProduct.getPrice());
        response.setStockQuantity(savedProduct.getStockQuantity());

        return response;
    }

    private void updateProductFromRequest(Product product, ProductRequest productRequest)
    {

        product.setId(productRequest.getId());
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(productRequest.getCategory());
        product.setImageUrl(productRequest.getImageUrl());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity());

    }

    @CacheEvict(value = {"products", "productSearch"}, allEntries = true)
    public Optional<ProductResponse> updateProduct(Long id, ProductRequest productRequest)
    {

        return productRepository.findById(id)
                .map(existingProduct ->
                {
                    updateProductFromRequest(existingProduct , productRequest);
                    Product savedProduct = productRepository.save(existingProduct);
                    return mapToProductResponse(savedProduct);
                });
    }


    @Cacheable(value = "products", key = "'all'")
    public List<ProductResponse> fetchAllProducts()
    {
        System.out.println("Fetching products from MongoDB...");

        return productRepository.findByActiveTrue().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "product", key = "#id")
    public Optional<ProductResponse> fetchProductById(Long id)
    {
        System.out.println("Fetching products from MongoDB...");

        return productRepository.findById(id)
                .map(this::mapToProductResponse);

    }

    public List<ProductResponse> fetchAllProductsForAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {"products", "productSearch"}, allEntries = true)
    public boolean deleteProduct(Long id) {

        return productRepository.findById(id)
                .map(product -> {product.setActive(false);
                    productRepository.save(product);
                     return true;
                }).orElse(false);

    }

    @Cacheable(value = "productSearch", key = "#keyword.toLowerCase()")
    public List<ProductResponse> searchProduct(String keyword) {

        System.out.println("Searching products from MongoDB...");

        return productRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "productSearch", key = "#category.toLowerCase()")
    public List<ProductResponse> getProductByCategory(String category) {

        System.out.println("Searching products by category from MongoDB...");

        return productRepository
                .findByCategoryIgnoreCaseAndActiveTrue(category)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public void decreaseStock(
            Long productId,
            Integer quantity) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        if (!Boolean.TRUE.equals(product.getActive())) {

            throw new RuntimeException(
                    "Product is inactive"
            );
        }

        if (product.getStockQuantity() < quantity) {

            throw new RuntimeException(
                    "Insufficient stock"
            );
        }

        product.setStockQuantity(
                product.getStockQuantity() - quantity
        );

        productRepository.save(product);
    }

    public void increaseStock(
            Long productId,
            Integer quantity) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        product.setStockQuantity(
                product.getStockQuantity() + quantity
        );

        productRepository.save(product);
    }
}
