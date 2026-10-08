package com.medicare.auth.service;

import com.medicare.auth.dto.AuthResponse;
import com.medicare.auth.dto.LoginRequest;
import com.medicare.auth.dto.RegisterRequest;
import com.medicare.common.exception.BadRequestException;
import com.medicare.security.JwtTokenProvider;
import com.medicare.security.UserPrincipal;
import com.medicare.user.dto.UserDto;
import com.medicare.user.entity.Role;
import com.medicare.user.entity.User;
import com.medicare.user.entity.UserProfile;
import com.medicare.user.entity.UserSettings;
import com.medicare.user.repository.UserRepository;
import com.medicare.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    public AuthService(UserRepository userRepository,
                       UserService userService,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String cleanUsername = request.getUsername().trim();
        String cleanEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(cleanUsername)) {
            throw new BadRequestException("Username '" + cleanUsername + "' is already taken");
        }

        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("Email '" + cleanEmail + "' is already registered");
        }

        User user = new User(
                cleanUsername,
                cleanEmail,
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_USER
        );

        UserProfile profile = new UserProfile(user);
        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName().trim());
        }
        if (request.getPhoneNumber() != null) {
            profile.setPhoneNumber(request.getPhoneNumber().trim());
        }
        user.setProfile(profile);

        UserSettings settings = new UserSettings(user);
        user.setSettings(settings);

        User savedUser = userRepository.save(user);
        logger.info("Successfully registered new user: {}", savedUser.getUsername());

        String jwt = tokenProvider.generateTokenFromUser(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
        UserDto userDto = userService.mapToUserDto(savedUser);

        return new AuthResponse(jwt, jwtExpirationMs, userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getEmailOrUsername().trim();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDto userDto = userService.mapToUserDto(user);
        logger.info("User logged in successfully: {}", user.getUsername());

        return new AuthResponse(jwt, jwtExpirationMs, userDto);
    }
}
