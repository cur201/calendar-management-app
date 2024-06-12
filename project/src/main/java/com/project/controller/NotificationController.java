package com.project.controller;

import com.project.entities.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendNotification")
    public void sendNotification(Notification notification) {
        messagingTemplate.convertAndSendToUser(notification.getTo(), "/queue/notifications", notification);
    }

    @PostMapping("/notifications")
    public void sendNotificationViaHttp(@RequestBody Notification notification) {
        messagingTemplate.convertAndSendToUser(notification.getTo(), "/queue/notifications", notification);
    }
}
