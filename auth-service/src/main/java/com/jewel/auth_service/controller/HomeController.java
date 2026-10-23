package com.jewel.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class HomeController {
    
    @GetMapping("/home")
    public ResponseEntity<String> gethome()
    {
        return ResponseEntity.ok("Welcome to Mysuru's best jewelry store");
    }
}
