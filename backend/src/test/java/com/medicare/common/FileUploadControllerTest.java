package com.medicare.common;

import com.medicare.security.JwtTokenProvider;
import com.medicare.user.entity.Role;
import com.medicare.user.entity.User;
import com.medicare.user.entity.UserProfile;
import com.medicare.user.repository.UserProfileRepository;
import com.medicare.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FileUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    private User testUser;
    private String authToken;

    @BeforeEach
    void setUp() {
        userProfileRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("s3_patient", "s3_patient@medifinder.test", "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", Role.ROLE_USER);
        UserProfile profile = new UserProfile(testUser);
        profile.setFullName("S3 Test Patient");
        testUser.setProfile(profile);

        testUser = userRepository.save(testUser);
        authToken = tokenProvider.generateTokenFromUser(testUser.getId(), testUser.getUsername(), testUser.getEmail());
    }

    @Test
    void testPublicImageUploadSuccess() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "patient_avatar.png",
                "image/png",
                "dummy image content bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/upload/image").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.url", notNullValue()));
    }

    @Test
    void testUserAvatarUploadUpdatesProfile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "profile_photo.jpg",
                "image/jpeg",
                "avatar jpg binary test content".getBytes()
        );

        mockMvc.perform(multipart("/api/users/me/avatar")
                        .file(file)
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.avatarUrl", notNullValue()));
    }
}
