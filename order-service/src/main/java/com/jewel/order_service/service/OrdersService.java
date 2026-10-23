package com.jewel.order_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jewel.order_service.model.Orders;
import com.jewel.order_service.repository.OrdersRepository;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    public List<Orders> getUserOrders(String userEmail) 
    {
        return ordersRepository.findByUserEmail(userEmail);   
    }

    public List<Orders> placeOrders(List<Orders> cartItems)
    {
        for(Orders item : cartItems)
        {
            item.setOrderDate(LocalDateTime.now());
        }
        return ordersRepository.saveAll(cartItems);
    }

}
