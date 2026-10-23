package com.jewel.price_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jewel.price_service.service.PriceService;

@RestController
@RequestMapping("api/prices")
@CrossOrigin(origins="*")
public class PriceController {
    
    @Autowired
    private PriceService priceService;

    @GetMapping("/liveprice")
    public ResponseEntity<?> getLivePrices()
    {
        return ResponseEntity.ok(priceService.getLivePrices());
    } 
}
