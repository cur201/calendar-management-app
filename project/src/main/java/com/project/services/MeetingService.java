package com.project.services;

import com.project.dto.MeetingDto;
import com.project.entities.GroupUser;
import com.project.entities.Meeting;
import com.project.mappers.MeetingMapper;
import com.project.repositories.GroupUserRepository;
import com.project.repositories.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MeetingService {
    private final MeetingRepository meetingRepository;
    private final MeetingMapper meetingMapper;
    private final GroupUserRepository groupUserRepository;

    public List<Meeting> findMeetingByOwnerUserId(Long userId) {
        return meetingRepository.findMeetingByOwnerUserId(userId);
    }

    public List<Meeting> findMeetingByGroupId(Long groupId) {
        return meetingRepository.findMeetingByGroupId(groupId);
    }

    public Meeting addMeeting(MeetingDto meetingDto) {
        Meeting newMeeting = meetingMapper.toMeeting(meetingDto);
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

    public Meeting updateMeeting(MeetingDto meetingDto) {
        Optional<Meeting> existingMeetingOptional = meetingRepository.findById(meetingDto.getId());
        if (existingMeetingOptional.isPresent()) {
            Meeting existingMeeting = existingMeetingOptional.get();
            Meeting updatedMeeting = meetingMapper.toMeeting(meetingDto);
            updatedMeeting.setId(existingMeeting.getId());
            return meetingRepository.save(updatedMeeting);
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
}
