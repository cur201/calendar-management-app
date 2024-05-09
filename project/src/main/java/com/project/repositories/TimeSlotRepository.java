package com.project.repositories;

import com.project.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByMeetingPlanId(Long meetingPlanId);
}
