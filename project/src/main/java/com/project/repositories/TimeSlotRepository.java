package com.project.repositories;

import com.project.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByMeetingPlanIdAndVisible(Long meetingPlanId, int visible);

    @Query("SELECT ts FROM TimeSlot ts " + 
            "JOIN MeetingPlan mp ON ts.meetingPlanId = mp.id " + 
            "JOIN User u On u.id = mp.ownerUserId " +
            "WHERE ts.timeSlotDate = :date AND " +
            "u.id = :userId AND " +
            "((:startTime BETWEEN ts.startTime AND ts.endTime) OR " +
            "(:endTime BETWEEN ts.startTime AND ts.endTime) OR " +
            "(ts.startTime BETWEEN :startTime AND :endTime) OR " +
            "(ts.endTime BETWEEN :startTime AND :endTime)) ")
    List<TimeSlot> findConflictingTimeSlots(@Param("date") LocalDate date,
                                            @Param("startTime") LocalTime startTime,
                                            @Param("endTime") LocalTime endTime,
                                            @Param("userId") Long userId);
}
