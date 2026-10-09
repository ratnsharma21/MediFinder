package com.medicare.notification;

import com.medicare.notification.entity.Notification;
import com.medicare.notification.entity.NotificationChannel;
import com.medicare.notification.entity.NotificationType;
import com.medicare.notification.repository.NotificationRepository;
import com.medicare.security.JwtTokenProvider;
import com.medicare.user.entity.Role;
import com.medicare.user.entity.User;
import com.medicare.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.medicare.reminder.repository.DoseLogRepository doseLogRepository;

    @Autowired
    private com.medicare.reminder.repository.ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User user1;
    private User user2;
    private String token1;
    private String token2;
    private Notification notification1;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        doseLogRepository.deleteAll();
        reminderRepository.deleteAll();
        userRepository.deleteAll();

        user1 = new User("notif_user1", "notif1@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user1 = userRepository.save(user1);
        token1 = jwtTokenProvider.generateTokenFromUser(user1.getId(), user1.getUsername(), user1.getEmail());

        user2 = new User("notif_user2", "notif2@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user2 = userRepository.save(user2);
        token2 = jwtTokenProvider.generateTokenFromUser(user2.getId(), user2.getUsername(), user2.getEmail());

        notification1 = new Notification(
                user1,
                "Time for Dolo 650",
                "Please take 1 tablet with water.",
                NotificationType.REMINDER,
                NotificationChannel.IN_APP
        );
        notification1 = notificationRepository.save(notification1);
    }

    @Test
    void testGetUserNotifications() throws Exception {
        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title", is("Time for Dolo 650")));
    }

    @Test
    void testGetUnreadCount() throws Exception {
        mockMvc.perform(get("/api/notifications/unread-count")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.unreadCount", is(1)));
    }

    @Test
    void testMarkAsRead() throws Exception {
        mockMvc.perform(patch("/api/notifications/" + notification1.getId() + "/read")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.read", is(true)));
    }

    @Test
    void testOtherUserCannotMarkNotificationAsRead() throws Exception {
        mockMvc.perform(patch("/api/notifications/" + notification1.getId() + "/read")
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
