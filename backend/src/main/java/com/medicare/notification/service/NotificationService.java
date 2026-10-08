package com.medicare.notification.service;

import com.medicare.common.exception.ForbiddenException;
import com.medicare.common.exception.ResourceNotFoundException;
import com.medicare.notification.dto.NotificationDto;
import com.medicare.notification.entity.Notification;
import com.medicare.notification.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You do not have permission to modify this notification");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    public NotificationDto mapToDto(Notification n) {
        return new NotificationDto(
                n.getId(),
                n.getTitle(),
                n.getMessage(),
                n.getType(),
                n.getChannel(),
                n.isRead(),
                n.getScheduledFor(),
                n.getSentAt(),
                n.getCreatedAt()
        );
    }
}
