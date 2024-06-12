package com.project.services;

import com.project.dto.MeetingPlanDto;
import com.project.dto.TimeSlotDto;
import com.project.dto.UpdateMeetingPlanDto;
import com.project.entities.MeetingPlan;
import com.project.entities.TimeSlot;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.MeetingPlanMapper;
import com.project.repositories.MeetingPlansRepository;
import com.project.repositories.TimeSlotRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
        return meetingPlansRepository.findByOwnerUserIdAndVisible(userId, 1);
    }

    public List<MeetingPlan> findMeetingPlanByUserId(Long userId)
    {
        return meetingPlansRepository.findMeetingPlansByUserId(userId);
    }

    public MeetingPlan getMeetingPlanByMeetingPlanId(Long meetingPlanId) {
        return meetingPlansRepository.findById(meetingPlanId)
                             .orElseThrow(() -> new UserNotFoundException("Meeting plan not found with id " + meetingPlanId));
    }   

    public List<MeetingPlan> searchMeeting(String query, Long ownerUserId) {
        return meetingPlansRepository.searchMeetingPlansTeacher(query, ownerUserId);
    }

    public MeetingPlanDto addMeetingPlan(MeetingPlanDto meetingPlanDto)
    {
        MeetingPlan newPlan = meetingPlanMapper.toMeetingPlan(meetingPlanDto);
        MeetingPlan savedMeetingPlan = meetingPlansRepository.save(newPlan);

        System.out.println("New meeting plan ID: " + savedMeetingPlan.getId());

        List<TimeSlotDto> timeSlotDTOs = meetingPlanDto.getTimeslot();

        System.out.println("timeSlotDtos: " + timeSlotDTOs);

        LocalDate currentDate = LocalDate.now();

        List<TimeSlot> timeSlots = new ArrayList<>();

        for(TimeSlotDto timeSDto: timeSlotDTOs){
            DayOfWeek weekday = timeSDto.getWeekday();
            LocalTime sTime = timeSDto.getStartTime();
            LocalTime eTime = timeSDto.getEndTime();
            Integer repetitionCount = timeSDto.getRepetitionCount();
            for(int i = 0; i < repetitionCount; i++) {
                LocalDate nextDate = currentDate.plusWeeks(i).with(weekday);
                List<TimeSlot> conflictingSlots = timeSlotRepository.findConflictingTimeSlots(nextDate, sTime, eTime, meetingPlanDto.getOwnerUserId());
                if (!conflictingSlots.isEmpty()) {
                    String conflictMessage = "Time slot has been conflict in " + nextDate + " from " + sTime + " to " + eTime;
                    meetingPlansRepository.delete(savedMeetingPlan);
                    throw new ResponseStatusException(HttpStatus.CONFLICT, conflictMessage);
                }
                TimeSlot timeSlot = new TimeSlot();
                timeSlot.setMeetingPlanId(savedMeetingPlan.getId());
                timeSlot.setStartTime(sTime);
                timeSlot.setEndTime(eTime);
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
        meetingPlansRepository.save(updatePlan);

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
