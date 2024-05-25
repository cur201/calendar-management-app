package com.project.repositories;

import com.project.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByMeetingPlanId(Long meetingPlanId);

    @Query("SELECT ts FROM TimeSlot ts WHERE ts.timeSlotDate = :date AND " +
            "((:startTime BETWEEN ts.startTime AND ts.endTime) OR " +
            "(:endTime BETWEEN ts.startTime AND ts.endTime) OR " +
            "(ts.startTime BETWEEN :startTime AND :endTime) OR " +
            "(ts.endTime BETWEEN :startTime AND :endTime))")
    List<TimeSlot> findConflictingTimeSlots(@Param("date") LocalDate date,
                                            @Param("startTime") LocalTime startTime,
                                            @Param("endTime") LocalTime endTime);
}
