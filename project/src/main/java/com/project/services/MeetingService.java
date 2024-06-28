package com.project.services;

import com.project.dto.MeetingDto;
import com.project.entities.GroupUser;
import com.project.entities.Meeting;
import com.project.exceptions.AppException;
import com.project.mappers.MeetingMapper;
import com.project.repositories.GroupUserRepository;
import com.project.repositories.MeetingRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
// import org.slf4j.LoggerFactory;
// import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
// import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// import org.slf4j.Logger;

@RequiredArgsConstructor
@Service
public class MeetingService {
    private final MeetingRepository meetingRepository;
    private final MeetingMapper meetingMapper;
    private final GroupUserRepository groupUserRepository;

    public List<Meeting> findMeetingByOwnerUserId(Long userId) {
        return meetingRepository.findMeetingByOwnerUserIdAndVisible(userId, 1);
    }

    public List<Meeting> findMeetingByGroupId(Long groupId) {
        return meetingRepository.findMeetingByGroupIdAndVisible(groupId, 1);
    }

    public Long getOwnerUserIdByGroupId(Long groupId) {
        return meetingRepository.findOwnerUserIdByMeetingGroupId(groupId);
    }

    public Meeting addMeeting(MeetingDto meetingDto, Long teacherId) {
        Meeting newMeeting = meetingMapper.toMeeting(meetingDto);
        String meetingState = newMeeting.getState();
        if ("Accepted".equals(meetingState)) {
            boolean isConflict = this.isConflictMeeting(meetingDto.getStartTime(), meetingDto.getEndTime(), meetingDto.getMeetingDate(), teacherId, meetingDto.getGroupId(), meetingDto.getId());
            if (isConflict) {
                throw new AppException("Conflict meeting with userID " + teacherId, HttpStatus.BAD_REQUEST);
            } else {
                return meetingRepository.save(newMeeting);
            }
        }
        return meetingRepository.save(newMeeting);
    }

    public List<Meeting> findMeetingByUserId(Long userId) {
        List<GroupUser> groupUsers = groupUserRepository.findByUserId(userId);

        List<Long> groupIds = new ArrayList<>();
        for (GroupUser groupUser : groupUsers) {
            groupIds.add(groupUser.getGroupId());
        }

        return meetingRepository.findMeetingByGroupIdIn(groupIds);
    }

    public List<Meeting> findMeetingByUserIdAndTeacherId(Long userId, Long teacherId) {
        return meetingRepository.findMeetingsByUserIdAndOwnerUserId(userId, teacherId);
    }

    public Meeting updateMeeting(MeetingDto meetingDto, Long teacherId) {
        Optional<Meeting> existingMeetingOptional = meetingRepository.findById(meetingDto.getId());
        if (existingMeetingOptional.isPresent()) {
            Meeting existingMeeting = existingMeetingOptional.get();
            Meeting updatedMeeting = meetingMapper.toMeeting(meetingDto);
            String meetingState = updatedMeeting.getState();
            System.out.println("Meeting State: " + meetingState);
            updatedMeeting.setId(existingMeeting.getId());
            if ("Accepted".equals(meetingState)) {
                boolean isConflict = this.isConflictMeeting(meetingDto.getStartTime(), meetingDto.getEndTime(), meetingDto.getMeetingDate(), teacherId, meetingDto.getGroupId(), meetingDto.getId());
                System.out.println("isConflict: " + isConflict);
                if (isConflict) {
                    throw new AppException("Conflict meeting with userID " + teacherId, HttpStatus.BAD_REQUEST);
                } else {
                    return meetingRepository.save(updatedMeeting);
                }
            } else {
                return meetingRepository.save(updatedMeeting);
            }
        }
        return null;
    }

    public boolean deleteMeeting(Long meetingId) {
        Optional<Meeting> existingMeetingOptional = meetingRepository.findById(meetingId);
        if (existingMeetingOptional.isPresent()) {
            Meeting existingMeeting = existingMeetingOptional.get();
            existingMeeting.setVisible(0L);
            meetingRepository.save(existingMeeting);
            return true;
        }
        return false;
    }

    public boolean isConflictMeeting(LocalTime startTime, LocalTime endTime, LocalDate meetingDate, Long teacherId, Long groupId, Long meetingId) {
        List<Meeting> isConflictMeetingWithTeacher = meetingRepository.findConflictMeetingByOwnerUserId(teacherId, startTime, endTime, meetingDate, meetingId);
        if (!isConflictMeetingWithTeacher.isEmpty()) return true;

        List<GroupUser> groupUsers = groupUserRepository.findGroupUserByGroupId(groupId);
        for (GroupUser groupUser : groupUsers) {
            System.out.println("Student Id: " + groupUser.getUserId());
            System.out.println("Start time: " + startTime);
            System.out.println("End time: " + endTime);
            List<Meeting> isConflictMeetingWithStudent = meetingRepository.findConflictMeetingByStudentId(groupUser.getUserId(), startTime, endTime, meetingDate, meetingId);
            System.out.println("Conflict meeting with student: " + isConflictMeetingWithStudent);
            if (!isConflictMeetingWithStudent.isEmpty()) return true;
        }

        return false;
    }
}
