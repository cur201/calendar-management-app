package com.project.repositories;

import com.project.entities.GroupTbl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GroupRepository extends JpaRepository<GroupTbl, Long> {

    @Query("SELECT g FROM GroupTbl g WHERE g.meetingPlanId IN (SELECT mp.id FROM MeetingPlan mp WHERE mp.ownerUserId = :userId) and g.visible = 1")
    List<GroupTbl> findGroupsByMeetingPlanId_OwnerUserId(Long userId);

    List<GroupTbl> findGroupByMeetingPlanIdAndVisible(Long meetingPlanId, int visible);

    List<GroupTbl> findByIdIn(List<Long> ids);

    Optional<GroupTbl> findByLeaderIdAndMeetingPlanIdAndLeaderDetailId(Long leaderId, Long meetingPlanId, Long leaderDetailId);
}
