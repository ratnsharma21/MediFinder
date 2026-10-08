package com.medicare.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long testExpiration = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationMs", testExpiration);
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = tokenProvider.generateTokenFromUser(100L, "testuser", "test@medicare.demo");
        assertNotNull(token);
        assertFalse(token.isEmpty());

        boolean isValid = tokenProvider.validateToken(token);
        assertTrue(isValid);

        Long userId = tokenProvider.getUserIdFromToken(token);
        assertEquals(100L, userId);

        String username = tokenProvider.getUsernameFromToken(token);
        assertEquals("testuser", username);
    }

    @Test
    void testInvalidToken() {
        boolean isValid = tokenProvider.validateToken("invalid.token.structure");
        assertFalse(isValid);
    }

    @Test
    void testExpiredToken() {
        // Create token provider with 0ms expiration
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(shortLivedProvider, "jwtSecret", testSecret);
        ReflectionTestUtils.setField(shortLivedProvider, "jwtExpirationMs", -1000L); // Already expired

        String expiredToken = shortLivedProvider.generateTokenFromUser(100L, "expiredUser", "exp@medicare.demo");
        assertNotNull(expiredToken);

        boolean isValid = shortLivedProvider.validateToken(expiredToken);
        assertFalse(isValid);
    }
}
