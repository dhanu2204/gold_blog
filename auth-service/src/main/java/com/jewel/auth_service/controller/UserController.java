package com.jewel.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jewel.auth_service.model.LoginRequest;
import com.jewel.auth_service.model.Users;
import com.jewel.auth_service.service.UserService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/user/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest.getPhonenumber(), loginRequest.getPassword());
    }

}
