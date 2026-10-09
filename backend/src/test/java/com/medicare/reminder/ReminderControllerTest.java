package com.medicare.reminder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.reminder.dto.ReminderRequest;
import com.medicare.reminder.entity.Reminder;
import com.medicare.reminder.repository.DoseLogRepository;
import com.medicare.reminder.repository.ReminderRepository;
import com.medicare.security.JwtTokenProvider;
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

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ReminderControllerTest {

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

    private User user1;
    private User user2;
    private String token1;
    private String token2;
    private Reminder reminderUser1;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        doseLogRepository.deleteAll();
        reminderRepository.deleteAll();
        userRepository.deleteAll();

        user1 = new User("user_one", "user1@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user1 = userRepository.save(user1);
        token1 = jwtTokenProvider.generateTokenFromUser(user1.getId(), user1.getUsername(), user1.getEmail());

        user2 = new User("user_two", "user2@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user2 = userRepository.save(user2);
        token2 = jwtTokenProvider.generateTokenFromUser(user2.getId(), user2.getUsername(), user2.getEmail());

        reminderUser1 = new Reminder();
        reminderUser1.setUser(user1);
        reminderUser1.setCustomMedicineName("Dolo 650 Tablet");
        reminderUser1.setDosage("1 tablet");
        reminderUser1.setUnit("tablet");
        reminderUser1.setFrequency("TWICE_DAILY");
        reminderUser1.setTimeOfDay("08:00, 20:00");
        reminderUser1.setStartDate(LocalDate.now());
        reminderUser1.setActive(true);
        reminderUser1 = reminderRepository.save(reminderUser1);
    }

    @Test
    void testCreateReminder() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setCustomMedicineName("Pan 40 Tablet");
        request.setDosage("1 tablet");
        request.setUnit("tablet");
        request.setFrequency("ONCE_DAILY");
        request.setTimeOfDay("07:30");
        request.setStartDate(LocalDate.now());

        mockMvc.perform(post("/api/reminders")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.customMedicineName", is("Pan 40 Tablet")))
                .andExpect(jsonPath("$.data.frequency", is("ONCE_DAILY")));
    }

    @Test
    void testRejectsInvalidScheduleTimes() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setCustomMedicineName("Pan 40 Tablet");
        request.setDosage("1 tablet");
        request.setFrequency("ONCE_DAILY");
        request.setTimeOfDay("25:90");
        request.setStartDate(LocalDate.now());

        mockMvc.perform(post("/api/reminders")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("valid time")));
    }

    @Test
    void testRejectsEndDateBeforeStartDate() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setCustomMedicineName("Pan 40 Tablet");
        request.setDosage("1 tablet");
        request.setFrequency("ONCE_DAILY");
        request.setTimeOfDay("07:30");
        request.setStartDate(LocalDate.now());
        request.setEndDate(LocalDate.now().minusDays(1));

        mockMvc.perform(post("/api/reminders")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("End date")));
    }

    @Test
    void testRejectsUnknownMedicineReference() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setMedicineId(Long.MAX_VALUE);
        request.setCustomMedicineName("Pan 40 Tablet");
        request.setDosage("1 tablet");
        request.setFrequency("ONCE_DAILY");
        request.setTimeOfDay("07:30");
        request.setStartDate(LocalDate.now());

        mockMvc.perform(post("/api/reminders")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetUserReminders() throws Exception {
        mockMvc.perform(get("/api/reminders")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].customMedicineName", is("Dolo 650 Tablet")));
    }

    @Test
    void testGetReminderByIdReturnsOwnedReminder() throws Exception {
        mockMvc.perform(get("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", is(reminderUser1.getId().intValue())));
    }

    @Test
    void testUserCannotAccessOtherUserReminder() throws Exception {
        // User 2 attempts to fetch User 1's reminder by ID -> Forbidden
        mockMvc.perform(get("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void testUserCannotUpdateOrDeleteAnotherUsersReminder() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setActive(false);

        mockMvc.perform(patch("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteReminder() throws Exception {
        mockMvc.perform(delete("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        mockMvc.perform(get("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isNotFound());
    }

    @Test
    void testPatchCanToggleReminderWithoutChangingItsSchedule() throws Exception {
        ReminderRequest request = new ReminderRequest();
        request.setActive(false);

        mockMvc.perform(patch("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active", is(false)))
                .andExpect(jsonPath("$.data.timeOfDay", is("08:00, 20:00")));
    }

    @Test
    void testPatchDoesNotResetOmittedActiveState() throws Exception {
        reminderUser1.setActive(false);
        reminderRepository.save(reminderUser1);

        ReminderRequest request = new ReminderRequest();
        request.setInstructions("Updated instructions");

        mockMvc.perform(patch("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active", is(false)))
                .andExpect(jsonPath("$.data.instructions", is("Updated instructions")));
    }

    @Test
    void testFullUpdateCanClearOptionalEndDate() throws Exception {
        reminderUser1.setEndDate(LocalDate.now().plusDays(2));
        reminderRepository.save(reminderUser1);

        ReminderRequest request = new ReminderRequest();
        request.setCustomMedicineName("Dolo 650 Tablet");
        request.setDosage("1 tablet");
        request.setFrequency("TWICE_DAILY");
        request.setTimeOfDay("08:00, 20:00");
        request.setStartDate(LocalDate.now());
        request.setEndDate(null);

        mockMvc.perform(put("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.endDate").value(nullValue()));
    }

    @Test
    void testPatchStartDatePreservesExistingEndDate() throws Exception {
        LocalDate existingEndDate = LocalDate.now().plusDays(10);
        reminderUser1.setEndDate(existingEndDate);
        reminderRepository.save(reminderUser1);

        LocalDate newStartDate = LocalDate.now().plusDays(1);
        ReminderRequest request = new ReminderRequest();
        request.setStartDate(newStartDate);

        mockMvc.perform(patch("/api/reminders/" + reminderUser1.getId())
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.startDate", is(newStartDate.toString())))
                .andExpect(jsonPath("$.data.endDate", is(existingEndDate.toString())));
    }
}
