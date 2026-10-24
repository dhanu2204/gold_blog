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
        Optional<Users> existingUser = userRepository.findByPhonenumber(user.getPhonenumber());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Phone number already registered");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }
        Users savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    public ResponseEntity<?> loginUser(String phonenumber, String password) {
        Optional<Users> existingUser = userRepository.findByPhonenumber(phonenumber);
        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Phone Number or Password");
        }
        Users user = existingUser.get();
        if (!encoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid Phone Number or Password");
        }
        String token = jwtService.generateToken(phonenumber);
        return ResponseEntity.ok(java.util.Map.of(
                "token", token,
                "role", user.getRole() != null ? user.getRole() : "ROLE_USER"));
    }

}
