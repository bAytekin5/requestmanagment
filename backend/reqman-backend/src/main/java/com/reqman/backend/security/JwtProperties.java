package com.reqman.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String issuer,
        String secret,
        long accessTokenExpireMinutes,
        long refreshTokenExpireDays
) {
}

