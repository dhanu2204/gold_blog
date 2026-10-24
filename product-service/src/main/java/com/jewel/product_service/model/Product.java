package com.jewel.product_service.model;

import java.sql.Date;
import java.time.LocalDateTime;

import javax.print.attribute.standard.DateTimeAtCreation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String imageUrl;
    private Double weightInGrams;
    private Integer karat;
    private Double makingChargePercentage;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String model3dUrl;

    @Column (name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist 
    protected void onCreate()
    {
        if(this.createdAt == null)
        {
            this.createdAt = LocalDateTime.now();
        }
    }
}
