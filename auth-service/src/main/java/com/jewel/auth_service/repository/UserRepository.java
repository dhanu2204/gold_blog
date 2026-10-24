package com.jewel.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jewel.auth_service.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByPhonenumber(String phonenumber);
}
