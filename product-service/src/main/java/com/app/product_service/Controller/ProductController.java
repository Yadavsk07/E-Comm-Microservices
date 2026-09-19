package com.app.product_service.Controller;

import com.app.product_service.Dto.ProductRequest;
import com.app.product_service.Dto.ProductResponse;
import com.app.product_service.Service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest productRequest)
    {
        return new ResponseEntity<ProductResponse>(productService.createProduct(productRequest),
                HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest productRequest)
    {
        return productService.updateProduct(id , productRequest)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts()
    {
        System.out.println("Inside get all Product Controller");
        return ResponseEntity.ok(productService.fetchAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<ProductResponse>> getProductById(@PathVariable Long id)
    {
        System.out.println("Inside Product by Id Controller");
        return ResponseEntity.ok(productService.fetchProductById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id)
    {
         boolean deleted = productService.deleteProduct(id);

         return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();

    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProduct(@RequestParam String keyword)
    {
        return ResponseEntity.ok(productService.searchProduct(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getByCategory(
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                productService.getProductByCategory(category)
        );
    }

    @PutMapping("/internal/{id}/decrease-stock")
    public ResponseEntity<Void> decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.decreaseStock(id, quantity);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/internal/{id}/increase-stock")
    public ResponseEntity<Void> increaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.increaseStock(id, quantity);

        return ResponseEntity.ok().build();
    }
}
