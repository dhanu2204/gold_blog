package com.jewel.auth_service.service;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

    @Value(value = "${secretToken}") 
    private String secretToken;
    private int expirationTime = 1000 * 60 * 60 * 24;

    private Key getSignKey() {
        byte[] keyBytes = secretToken.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String phonenumber) {
        return Jwts.builder().setSubject(phonenumber).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    public String verifyToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody().getSubject();
    }

}
