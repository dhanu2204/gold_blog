package com.jewel.order_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jewel.order_service.model.Orders;

@Repository 
public interface OrdersRepository extends JpaRepository<Orders, Long>{

    List<Orders> findByUserEmail(String userEmail);

}
