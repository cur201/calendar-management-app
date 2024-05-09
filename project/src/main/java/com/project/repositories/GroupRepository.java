package com.project.repositories;

import com.project.entities.GroupTbl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<GroupTbl, Long> {

    @Query("SELECT g FROM GroupTbl g WHERE g.meetingPlanId IN (SELECT mp.id FROM MeetingPlan mp WHERE mp.ownerUserId = :userId)")
    List<GroupTbl> findGroupsByMeetingPlanId_OwnerUserId(Long userId);

    List<GroupTbl> findGroupByMeetingPlanId(Long meetingPlanId);
}
