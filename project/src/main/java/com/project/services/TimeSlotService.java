package com.project.services;

import com.project.entities.TimeSlot;
import com.project.repositories.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;

    public List<TimeSlot> findTimeSlotByMeetingPlanId(Long meetingPlanId)
    {
        return timeSlotRepository.findByMeetingPlanIdAndVisible(meetingPlanId, 1);
    }
}
