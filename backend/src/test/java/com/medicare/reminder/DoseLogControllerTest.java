package com.medicare.reminder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicare.reminder.dto.DoseLogRequest;
import com.medicare.reminder.dto.UpdateDoseStatusRequest;
import com.medicare.reminder.entity.DoseLog;
import com.medicare.reminder.entity.DoseStatus;
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
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DoseLogControllerTest {

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
    private Reminder reminder1;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        doseLogRepository.deleteAll();
        reminderRepository.deleteAll();
        userRepository.deleteAll();

        user1 = new User("dose_user1", "dose1@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user1 = userRepository.save(user1);
        token1 = jwtTokenProvider.generateTokenFromUser(user1.getId(), user1.getUsername(), user1.getEmail());

        user2 = new User("dose_user2", "dose2@medicare.demo", passwordEncoder.encode("Password@123"), Role.ROLE_USER);
        user2 = userRepository.save(user2);
        token2 = jwtTokenProvider.generateTokenFromUser(user2.getId(), user2.getUsername(), user2.getEmail());

        reminder1 = new Reminder();
        reminder1.setUser(user1);
        reminder1.setCustomMedicineName("Augmentin 625 Duo");
        reminder1.setDosage("1 tablet");
        reminder1.setUnit("tablet");
        reminder1.setFrequency("TWICE_DAILY");
        reminder1.setTimeOfDay("09:00, 21:00");
        reminder1.setStartDate(LocalDate.now());
        reminder1.setActive(true);
        reminder1 = reminderRepository.save(reminder1);
    }

    @Test
    void testLogDoseSuccess() throws Exception {
        DoseLogRequest request = new DoseLogRequest();
        request.setReminderId(reminder1.getId());
        request.setScheduledTime(LocalDateTime.now().minusHours(1));
        request.setStatus(DoseStatus.TAKEN);
        request.setNotes("Taken after breakfast");

        mockMvc.perform(post("/api/dose-logs")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.medicineName", is("Augmentin 625 Duo")))
                .andExpect(jsonPath("$.data.status", is("TAKEN")));
    }

    @Test
    void testUserCannotLogDoseForOthersReminder() throws Exception {
        DoseLogRequest request = new DoseLogRequest();
        request.setReminderId(reminder1.getId());
        request.setScheduledTime(LocalDateTime.now());
        request.setStatus(DoseStatus.TAKEN);

        mockMvc.perform(post("/api/dose-logs")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    void testUpdateDoseStatus() throws Exception {
        DoseLog log = new DoseLog(
                reminder1,
                user1,
                LocalDateTime.now().minusHours(2),
                null,
                DoseStatus.MISSED,
                "Forgot morning alarm"
        );
        log = doseLogRepository.save(log);

        UpdateDoseStatusRequest updateRequest = new UpdateDoseStatusRequest();
        updateRequest.setStatus(DoseStatus.TAKEN);
        updateRequest.setNotes("Took late with lunch");

        mockMvc.perform(patch("/api/dose-logs/" + log.getId())
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("TAKEN")))
                .andExpect(jsonPath("$.data.notes", is("Took late with lunch")));
    }
}
