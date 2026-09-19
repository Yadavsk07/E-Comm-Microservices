package com.app.product_service.Repository;

import com.app.product_service.Model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, Long>
{

    List<Product> findByActiveTrue();


    List<Product> findByIdIn(List<Long> ids);

    List<Product> findByCategoryIgnoreCaseAndActiveTrue(String Category);

    List<Product> findByNameContainingIgnoreCase(String Category);

    @Query("{ 'active': true, 'stockQuantity': { $gt: 0 }, 'name': { $regex: ?0, $options: 'i' } }")
    List<Product> searchProducts(String keyword);


}


