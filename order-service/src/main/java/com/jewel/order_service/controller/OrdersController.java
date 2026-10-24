package com.jewel.order_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jewel.order_service.model.Orders;
import com.jewel.order_service.service.OrdersService;

@RestController 
@CrossOrigin (origins="*")
@RequestMapping ("/api/orders")
public class OrdersController {
    
    @Autowired 
    private OrdersService ordersService;

    @GetMapping("/history/{phone}")
    public ResponseEntity<?> getUserOrders(@PathVariable("phone") String phone)
    {
        List<Orders> existingorders =  ordersService.getUserOrders(phone);
        if(existingorders.size() >= 1)
        {
            return ResponseEntity.ok(existingorders);
        }
        return ResponseEntity.ok("You have not placed any orders");
    }


    @PostMapping ("/checkout")
    public ResponseEntity<List<Orders>> placeOrders(@RequestBody  List<Orders> cartitems)
    {
        List<Orders> savedOrders = ordersService.placeOrders(cartitems);
        return ResponseEntity.ok(savedOrders);
    }
}
