package com.jewel.product_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jewel.product_service.model.Product;

public interface ProductRepository extends JpaRepository<Product,Long>{
    List<Product> findAllByOrderByCreatedAtDesc();

    List<Product> findByCategoryOrderByCreatedAtDesc(String Category);
}
