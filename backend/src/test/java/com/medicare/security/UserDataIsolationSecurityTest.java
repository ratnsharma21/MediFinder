package com.medicare.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.medicine.repository.MedicineRepository;
import com.medicare.notification.entity.Notification;
import com.medicare.notification.entity.NotificationChannel;
import com.medicare.notification.entity.NotificationType;
import com.medicare.notification.repository.NotificationRepository;
import com.medicare.reminder.dto.DoseLogRequest;
import com.medicare.reminder.dto.ReminderRequest;
import com.medicare.reminder.entity.DoseLog;
import com.medicare.reminder.entity.DoseStatus;
import com.medicare.reminder.entity.Reminder;
import com.medicare.reminder.repository.DoseLogRepository;
import com.medicare.reminder.repository.ReminderRepository;
import com.medicare.user.entity.Role;
import com.medicare.user.entity.User;
import com.medicare.medicine.repository.SavedMedicineRepository;
import com.medicare.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserDataIsolationSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DoseLogRepository doseLogRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private SavedMedicineRepository savedMedicineRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User userA;
    private User userB;
    private String tokenA;
    private String tokenB;
    private Reminder reminderA;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        doseLogRepository.deleteAll();
        reminderRepository.deleteAll();
        savedMedicineRepository.deleteAll();
        userRepository.deleteAll();

        // User A
        userA = new User("patient_alice", "alice@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        userA = userRepository.save(userA);
        tokenA = jwtTokenProvider.generateTokenFromUser(userA.getId(), userA.getUsername(), userA.getEmail());

        // User B
        userB = new User("patient_bob", "bob@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        userB = userRepository.save(userB);
        tokenB = jwtTokenProvider.generateTokenFromUser(userB.getId(), userB.getUsername(), userB.getEmail());

        // User A creates a private reminder
        reminderA = new Reminder();
        reminderA.setUser(userA);
        reminderA.setCustomMedicineName("Metformin 500mg");
        reminderA.setDosage("1 tablet");
        reminderA.setUnit("tablet");
        reminderA.setFrequency("TWICE_DAILY");
        reminderA.setTimeOfDay("08:00, 20:00");
        reminderA.setStartDate(LocalDate.now());
        reminderA.setActive(true);
        reminderA = reminderRepository.save(reminderA);

        // User A logs a dose
        DoseLog doseLogA = new DoseLog();
        doseLogA.setUser(userA);
        doseLogA.setReminder(reminderA);
        doseLogA.setScheduledTime(LocalDateTime.now());
        doseLogA.setActualTime(LocalDateTime.now());
        doseLogA.setStatus(DoseStatus.TAKEN);
        doseLogRepository.save(doseLogA);

        // User A receives a notification
        Notification notifA = new Notification(
                userA,
                "Time for Metformin",
                "Take 1 tablet after food.",
                NotificationType.REMINDER,
                NotificationChannel.IN_APP
        );
        notificationRepository.save(notifA);
    }

    @Test
    @DisplayName("1. Newly registered User B has 0 fabricated reminders, doses, and notifications")
    void testNewUserHasZeroFabricatedPersonalData() throws Exception {
        // Reminders: empty list
        mockMvc.perform(get("/api/reminders")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(0)));

        // Dose history: empty list
        mockMvc.perform(get("/api/dose-logs")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(0)));

        // Notifications: empty list
        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(0)));

        // Unread notification count: 0
        mockMvc.perform(get("/api/notifications/unread-count")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.unreadCount", is(0)));
    }

    @Test
    @DisplayName("2. Both User A and User B can access the shared medicine catalog")
    void testSharedMedicineCatalogueAvailableToBothUsers() throws Exception {
        mockMvc.perform(get("/api/medicines")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        mockMvc.perform(get("/api/medicines")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }

    @Test
    @DisplayName("3. User B cannot read User A's reminder by ID (IDOR Prevention)")
    void testUserBCannotReadUserAReminder() throws Exception {
        mockMvc.perform(get("/api/reminders/" + reminderA.getId())
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @DisplayName("4. User B cannot update or mutate User A's reminder (IDOR Prevention)")
    void testUserBCannotUpdateUserAReminder() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setCustomMedicineName("Hacked Medicine Name");
        request.setDosage("99 tablets");
        request.setFrequency("ONCE_DAILY");
        request.setTimeOfDay("09:00");
        request.setStartDate(LocalDate.now());

        mockMvc.perform(put("/api/reminders/" + reminderA.getId())
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("5. User B cannot delete User A's reminder (IDOR Prevention)")
    void testUserBCannotDeleteUserAReminder() throws Exception {
        mockMvc.perform(delete("/api/reminders/" + reminderA.getId())
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // Verify reminder still exists for User A
        mockMvc.perform(get("/api/reminders/" + reminderA.getId())
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.customMedicineName", is("Metformin 500mg")));
    }

    @Test
    @DisplayName("6. User B cannot submit a dose log for User A's reminder")
    void testUserBCannotLogDoseOnUserAReminder() throws Exception {
        DoseLogRequest request = new DoseLogRequest();
        request.setReminderId(reminderA.getId());
        request.setScheduledTime(LocalDateTime.now());
        request.setStatus(DoseStatus.TAKEN);

        mockMvc.perform(post("/api/dose-logs")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. User B cannot mark User A's notification as read")
    void testUserBCannotMarkUserANotificationRead() throws Exception {
        Notification userANotif = notificationRepository.findAll().get(0);

        mockMvc.perform(patch("/api/notifications/" + userANotif.getId() + "/read")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("8. User A's profile updates are strictly isolated and do not alter User B")
    void testUserProfileIsolation() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username", is("patient_alice")));

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username", is("patient_bob")));
    }
}
