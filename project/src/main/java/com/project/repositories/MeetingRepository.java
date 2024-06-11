package com.project.repositories;

import com.project.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    @Query("SELECT m FROM Meeting m " +
            "JOIN GroupTbl g ON m.groupId = g.id " +
            "JOIN MeetingPlan mp ON g.meetingPlanId = mp.id " +
            "WHERE mp.ownerUserId = ?1 AND m.visible = 1")
    List<Meeting> findMeetingByOwnerUserIdAndVisible(Long userId, int visible);

    List<Meeting> findMeetingByGroupIdAndVisible(Long groupId, int visible);

    List<Meeting> findMeetingByGroupIdIn(List<Long> groupIds);

    List<Meeting> findMeetingByState(String state);
}
