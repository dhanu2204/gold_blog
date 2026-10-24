package com.jewel.product_service.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.jewel.product_service.model.Product;
import com.jewel.product_service.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    public Product getProductId(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(existing -> {
            if (updatedProduct.getName() != null)
                existing.setName(updatedProduct.getName());
            if (updatedProduct.getCategory() != null)
                existing.setCategory(updatedProduct.getCategory());
            if (updatedProduct.getKarat() > 0)
                existing.setKarat(updatedProduct.getKarat());
            if (updatedProduct.getWeightInGrams() > 0)
                existing.setWeightInGrams(updatedProduct.getWeightInGrams());
            if (updatedProduct.getImageUrl() != null)
                existing.setImageUrl(updatedProduct.getImageUrl());
            if (updatedProduct.getDescription() != null)
                existing.setDescription(updatedProduct.getDescription());
            if (updatedProduct.getMakingChargePercentage() > 0)
                existing.setMakingChargePercentage(updatedProduct.getMakingChargePercentage());
            return productRepository.save(existing);
        }).orElse(null);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

}
