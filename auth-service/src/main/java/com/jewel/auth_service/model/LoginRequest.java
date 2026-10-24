package com.jewel.auth_service.model;

import lombok.Data;

@Data
public class LoginRequest {

    private String phonenumber;
    private String password;
}
