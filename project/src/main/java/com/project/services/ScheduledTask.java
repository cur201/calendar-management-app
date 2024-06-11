package com.project.services;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.project.entities.Meeting;
import com.project.repositories.MeetingRepository;

@Component
public class ScheduledTask {
    private static final Logger logger = LoggerFactory.getLogger(MeetingService.class);

    @Autowired
    private MeetingRepository meetingRepository;

    @Scheduled(fixedRate = 60000) //check 1 min
    public void updateMeetingStatus() {

        LocalDateTime now = LocalDateTime.now();
        List<Meeting> waitingForApproveMeetings = meetingRepository.findMeetingByState("Wait for approve");
        List<Meeting> acceptedMeetings = meetingRepository.findMeetingByState("Accepted");

        for (Meeting meeting : waitingForApproveMeetings) {
            LocalDateTime meetingStartDateTime = LocalDateTime.of(meeting.getMeetingDate(), meeting.getStartTime());
            if (meetingStartDateTime.isBefore(now)) {
                meeting.setState("Canceled");
                meetingRepository.save(meeting);
                logger.info("Meeting ID {} status updated to Canceled", meeting.getId());
            }
        }

        for (Meeting meeting : acceptedMeetings) {
            LocalDateTime meetingStartDateTime = LocalDateTime.of(meeting.getMeetingDate(), meeting.getStartTime());
            if (meetingStartDateTime.isBefore(now)) {
                meeting.setState("Finished");
                meetingRepository.save(meeting);
                logger.info("Meeting ID {} status updated to Finished", meeting.getId());
            }
        }
    }
}
