package com.app.order_service.Repository;

import com.app.order_service.Model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
	List<Order> findByUserId(Long userId);

	Optional<Order> findByPaymentOrderId(String paymentOrderId);

	boolean existsByPaymentOrderId(String paymentOrderId);

}
