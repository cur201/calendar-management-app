package com.project.repositories;

import com.project.entities.MeetingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MeetingPlansRepository extends JpaRepository<MeetingPlan, Long> {
    List<MeetingPlan> findByOwnerUserId(Long ownerUserId);
    Optional<MeetingPlan> findById(Long id);

    @Query("SELECT mp FROM MeetingPlan mp JOIN GroupTbl gt ON mp.id = gt.meetingPlanId JOIN GroupUser gu ON gt.id = gu.groupId WHERE gu.userId = :userId")
    List<MeetingPlan> findMeetingPlansByUserId(Long userId);
}
