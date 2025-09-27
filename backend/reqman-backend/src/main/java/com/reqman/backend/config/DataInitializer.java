package com.reqman.backend.config;

import com.reqman.backend.domain.entity.Role;
import com.reqman.backend.domain.entity.User;
import com.reqman.backend.repository.RoleRepository;
import com.reqman.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> createAdminIfNeeded();
    }

    @Transactional
    public void createAdminIfNeeded() {
        Role adminRole = ensureRole("ROLE_ADMIN");
        Role userRole = ensureRole("ROLE_USER");

        userRepository.findByEmail("admin@reqman.com")
                .ifPresentOrElse(
                        user -> log.info("Default admin already exists: {}", user.getEmail()),
                        () -> createDefaultAdmin(adminRole, userRole)
                );
    }

    private void createDefaultAdmin(Role adminRole, Role userRole) {
        User admin = new User();
        admin.setEmail("admin@reqman.com");
        admin.setFullName("Default Admin");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        admin.setEnabled(true);
        admin.getRoles().add(adminRole);
        admin.getRoles().add(userRole);
        userRepository.save(admin);
        log.info("Created default admin user with email admin@reqman.com and password Admin123!");
    }

    private Role ensureRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}

