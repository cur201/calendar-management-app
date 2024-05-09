package com.project.repositories;

import com.project.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query("SELECT m FROM Meeting m " +
            "JOIN GroupTbl g ON m.groupId = g.id " +
            "JOIN MeetingPlan mp ON g.meetingPlanId = mp.id " +
            "WHERE mp.ownerUserId = ?1")
    List<Meeting> findMeetingByOwnerUserId(Long userId);

    List<Meeting> findMeetingByGroupId(Long groupId);

    List<Meeting> findMeetingByGroupIdIn(List<Long> groupIds);
}
