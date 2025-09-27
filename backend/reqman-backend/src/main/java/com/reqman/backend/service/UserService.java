package com.reqman.backend.service;

import com.reqman.backend.domain.entity.Role;
import com.reqman.backend.domain.entity.User;
import com.reqman.backend.dto.RequestDtos;
import com.reqman.backend.repository.RoleRepository;
import com.reqman.backend.repository.UserRepository;
import com.reqman.backend.service.exception.ResourceAlreadyExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(String email, String rawPassword, String fullName, Set<String> roleNames) {
        if (userRepository.existsByEmail(email)) {
            throw new ResourceAlreadyExistsException("Email already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName);
        if (roleNames != null && !roleNames.isEmpty()) {
            user.getRoles().addAll(roleNames.stream()
                    .map(this::getRoleByName)
                    .collect(Collectors.toSet()));
        } else {
            user.getRoles().add(getRoleByName("ROLE_USER"));
        }

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public java.util.List<RequestDtos.UserSummary> getAdmins() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream().anyMatch(role -> "ROLE_ADMIN".equals(role.getName())))
                .map(user -> new RequestDtos.UserSummary(user.getId(), user.getFullName(), user.getEmail()))
                .toList();
    }

    private Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Role not found: " + name));
    }
}

