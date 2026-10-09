package com.medicare.user.service;

import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.user.dto.*;
import com.medicare.user.entity.User;
import com.medicare.user.entity.UserProfile;
import com.medicare.user.entity.UserSettings;
import com.medicare.user.repository.UserProfileRepository;
import com.medicare.user.repository.UserRepository;
import com.medicare.user.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSettingsRepository userSettingsRepository;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       UserSettingsRepository userSettingsRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userSettingsRepository = userSettingsRepository;
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToUserDto(user);
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    UserProfile newProfile = new UserProfile(user);
                    return userProfileRepository.save(newProfile);
                });
        return mapToUserProfileDto(profile);
    }

    @Transactional
    public UserProfileDto updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> new UserProfile(user));

        if (request.getFullName() != null) profile.setFullName(request.getFullName().trim());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber().trim());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl().trim());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getBloodGroup() != null) profile.setBloodGroup(request.getBloodGroup());
        if (request.getEmergencyContact() != null) profile.setEmergencyContact(request.getEmergencyContact().trim());
        if (request.getAddress() != null) profile.setAddress(request.getAddress().trim());
        if (request.getCity() != null) profile.setCity(request.getCity().trim());
        if (request.getState() != null) profile.setState(request.getState().trim());
        if (request.getPostalCode() != null) profile.setPostalCode(request.getPostalCode().trim());

        UserProfile updatedProfile = userProfileRepository.save(profile);
        return mapToUserProfileDto(updatedProfile);
    }

    @Transactional(readOnly = true)
    public UserSettingsDto getUserSettings(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    UserSettings newSettings = new UserSettings(user);
                    return userSettingsRepository.save(newSettings);
                });
        return mapToUserSettingsDto(settings);
    }

    @Transactional
    public UserSettingsDto updateUserSettings(Long userId, UpdateSettingsRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> new UserSettings(user));

        if (request.getEmailNotificationsEnabled() != null) {
            settings.setEmailNotificationsEnabled(request.getEmailNotificationsEnabled());
        }
        if (request.getSmsNotificationsEnabled() != null) {
            settings.setSmsNotificationsEnabled(request.getSmsNotificationsEnabled());
        }
        if (request.getBrowserNotificationsEnabled() != null) {
            settings.setBrowserNotificationsEnabled(request.getBrowserNotificationsEnabled());
        }
        if (request.getInAppNotificationsEnabled() != null) {
            settings.setInAppNotificationsEnabled(request.getInAppNotificationsEnabled());
        }
        if (request.getDarkMode() != null) {
            settings.setDarkMode(request.getDarkMode());
        }
        if (request.getReminderSound() != null) {
            settings.setReminderSound(request.getReminderSound().trim());
        }

        UserSettings updatedSettings = userSettingsRepository.save(settings);
        return mapToUserSettingsDto(updatedSettings);
    }

    public UserDto mapToUserDto(User user) {
        UserProfileDto profileDto = user.getProfile() != null ? mapToUserProfileDto(user.getProfile()) : null;
        UserSettingsDto settingsDto = user.getSettings() != null ? mapToUserSettingsDto(user.getSettings()) : null;

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                profileDto,
                settingsDto,
                user.getCreatedAt()
        );
    }

    public UserProfileDto mapToUserProfileDto(UserProfile profile) {
        if (profile == null) return null;
        return new UserProfileDto(
                profile.getId(),
                profile.getFullName(),
                profile.getPhoneNumber(),
                profile.getAvatarUrl(),
                profile.getDateOfBirth(),
                profile.getGender(),
                profile.getBloodGroup(),
                profile.getEmergencyContact(),
                profile.getAddress(),
                profile.getCity(),
                profile.getState(),
                profile.getPostalCode()
        );
    }

    public UserSettingsDto mapToUserSettingsDto(UserSettings settings) {
        if (settings == null) return null;
        return new UserSettingsDto(
                settings.getId(),
                settings.isEmailNotificationsEnabled(),
                settings.isSmsNotificationsEnabled(),
                settings.isBrowserNotificationsEnabled(),
                settings.isInAppNotificationsEnabled(),
                settings.isDarkMode(),
                settings.getReminderSound()
        );
    }
}
