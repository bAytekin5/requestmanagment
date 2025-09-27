package com.reqman.backend.controller.auth;

import com.reqman.backend.dto.AuthDtos;
import com.reqman.backend.security.JwtTokenService;
import com.reqman.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService tokenService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthDtos.AuthResponse> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        userService.createUser(request.email(), request.password(), request.fullName(),
                java.util.Set.of("ROLE_USER"));

        var authResponse = authenticate(new AuthDtos.LoginRequest(request.email(), request.password()));
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        var authResponse = authenticate(request);
        return ResponseEntity.ok(authResponse);
    }

    private AuthDtos.AuthResponse authenticate(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        String accessToken = tokenService.generateAccessToken(principal);
        String refreshToken = tokenService.generateRefreshToken(principal);
        var user = userService.getByEmail(principal.getUsername());
        var profile = new AuthDtos.UserProfile(user.getId(), user.getEmail(), user.getFullName(),
                user.getRoles().stream().map(role -> role.getName()).collect(java.util.stream.Collectors.toSet()));
        return new AuthDtos.AuthResponse(accessToken, refreshToken, "Bearer", 60 * 30, profile);
    }
}

