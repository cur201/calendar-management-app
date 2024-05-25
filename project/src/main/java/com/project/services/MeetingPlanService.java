package com.project.services;

import com.project.dto.MeetingPlanDto;
import com.project.dto.UpdateMeetingPlanDto;
import com.project.entities.MeetingPlan;
import com.project.entities.TimeSlot;
import com.project.mappers.MeetingPlanMapper;
import com.project.repositories.MeetingPlansRepository;
import com.project.repositories.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class MeetingPlanService {
    private final MeetingPlansRepository meetingPlansRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final MeetingPlanMapper meetingPlanMapper;

    public List<MeetingPlan> findMeetingPlanByOwnerUserId(Long userId)
    {
        return meetingPlansRepository.findByOwnerUserId(userId);
    }

    public List<MeetingPlan> findMeetingPlanByUserId(Long userId)
    {
        return meetingPlansRepository.findMeetingPlansByUserId(userId);
    }

    public MeetingPlanDto addMeetingPlan(MeetingPlanDto meetingPlanDto)
    {
        MeetingPlan newPlan = meetingPlanMapper.toMeetingPlan(meetingPlanDto);
        MeetingPlan savedMeetingPlan = meetingPlansRepository.save(newPlan);

        List<DayOfWeek> weekdays = meetingPlanDto.getWeekdays();
        List<LocalTime> startTimes = meetingPlanDto.getStartTimes();
        List<LocalTime> endTimes = meetingPlanDto.getEndTimes();
        List<Integer> repetitionCounts = meetingPlanDto.getRepetitionCount();

        LocalDate currentDate = LocalDate.now();

        List<TimeSlot> timeSlots = new ArrayList<>();

        for (int i = 0; i < weekdays.size(); i++) {
            DayOfWeek weekday = weekdays.get(i);
            LocalTime startTime = startTimes.get(i);
            LocalTime endTime = endTimes.get(i);
            Integer repetitionCount = repetitionCounts.get(i);

            for (int j = 0; j < repetitionCount; j++) {
                LocalDate nextDate = currentDate.plusWeeks(j).with(weekday);

                List<TimeSlot> conflictingSlots = timeSlotRepository.findConflictingTimeSlots(nextDate, startTime, endTime);
                if (!conflictingSlots.isEmpty()) {
                    String conflictMessage = "Time slot has been conflict in " + nextDate + " from " + startTime + " to " + endTime;
                    throw new RuntimeException(conflictMessage);
                }

                TimeSlot timeSlot = new TimeSlot();
                timeSlot.setMeetingPlanId(savedMeetingPlan.getId());
                timeSlot.setStartTime(startTime);
                timeSlot.setEndTime(endTime);
                timeSlot.setTimeSlotDate(nextDate);
                timeSlot.setVisible(1L);

                timeSlots.add(timeSlot);
            }
        }

        timeSlotRepository.saveAll(timeSlots);

        return meetingPlanMapper.toMeetingPlanDto(newPlan);
    }

    public UpdateMeetingPlanDto updateMeetingPlan(UpdateMeetingPlanDto meetingPlanDto)
    {
        MeetingPlan updatePlan = meetingPlanMapper.toMeetingPlan(meetingPlanDto);

        Long updatePlanId = updatePlan.getId();

        Optional<MeetingPlan> optionalMeetingPlan = meetingPlansRepository.findById(updatePlanId);
        if (!optionalMeetingPlan.isPresent()) {
            throw new IllegalArgumentException("Meeting plan with ID " + updatePlanId + " does not exist");
        }
        MeetingPlan savedMeetingPlan = meetingPlansRepository.save(updatePlan);

        return meetingPlanMapper.toUpdateMeetingPlanDto(updatePlan);
    }

    public MeetingPlan deleteMeetingPlan(Long id){
        Optional<MeetingPlan> optionalMeetingPlan = meetingPlansRepository.findById(id);
        if (!optionalMeetingPlan.isPresent()) {
            throw new IllegalArgumentException("Meeting plan with ID " + id + " does not exist");
        }

        MeetingPlan existingMeetingPlan = optionalMeetingPlan.get();
        existingMeetingPlan.setVisible(0L);
        return meetingPlansRepository.save(existingMeetingPlan);
    }
}
