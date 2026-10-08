package com.medicare.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.reminder.repository.DoseLogRepository;
import com.medicare.reminder.repository.ReminderRepository;
import com.medicare.security.JwtTokenProvider;
import com.medicare.user.dto.UpdateProfileRequest;
import com.medicare.user.dto.UpdateSettingsRequest;
import com.medicare.user.entity.Role;
import com.medicare.user.entity.User;
import com.medicare.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.medicare.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private DoseLogRepository doseLogRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User testUser;
    private String token;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        doseLogRepository.deleteAll();
        reminderRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("profile_user", "profile@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        testUser = userRepository.save(testUser);
        token = jwtTokenProvider.generateTokenFromUser(testUser.getId(), testUser.getUsername(), testUser.getEmail());
    }

    @Test
    void testGetCurrentUser() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("profile_user")))
                .andExpect(jsonPath("$.data.email", is("profile@medicare.demo")));
    }

    @Test
    void testUpdateProfile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Updated Name");
        request.setCity("Bengaluru");
        request.setBloodGroup("B+");

        mockMvc.perform(patch("/api/users/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Updated Name")))
                .andExpect(jsonPath("$.data.city", is("Bengaluru")))
                .andExpect(jsonPath("$.data.bloodGroup", is("B+")));
    }

    @Test
    void testUpdateSettings() throws Exception {
        UpdateSettingsRequest settingsRequest = new UpdateSettingsRequest();
        settingsRequest.setDarkMode(true);
        settingsRequest.setEmailNotificationsEnabled(false);
        settingsRequest.setReminderSound("chime");

        mockMvc.perform(patch("/api/users/me/settings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(settingsRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.darkMode", is(true)))
                .andExpect(jsonPath("$.data.emailNotificationsEnabled", is(false)))
                .andExpect(jsonPath("$.data.reminderSound", is("chime")));
    }

    @Test
    void testUnauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }
}
