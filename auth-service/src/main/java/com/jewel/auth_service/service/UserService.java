package com.jewel.auth_service.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jewel.auth_service.model.Users;
import com.jewel.auth_service.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtService jwtService;

    public ResponseEntity<?> registerUser(Users user) {
        Optional<Users> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        Users savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    public ResponseEntity<?> loginUser(String email, String password) {
        Optional<Users> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Email or Password");
        }
        Users user = existingUser.get();
        if (!encoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid Email or Password");
        }
        String token = jwtService.generateToken(email);
        return ResponseEntity.ok(token);
    }

}
