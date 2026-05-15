package com.sigmotos.usersservice.repository;

import com.sigmotos.usersservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}