package com.project.repositories;

import com.project.entities.MeetingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MeetingPlansRepository extends JpaRepository<MeetingPlan, Long> {
    List<MeetingPlan> findByOwnerUserIdAndVisible(Long ownerUserId, int visible);
    Optional<MeetingPlan> findById(Long id);

    @Query("SELECT mp FROM MeetingPlan mp JOIN GroupTbl gt ON mp.id = gt.meetingPlanId JOIN GroupUser gu ON gt.id = gu.groupId WHERE gu.userId = :userId")
    List<MeetingPlan> findMeetingPlansByUserId(Long userId);

    @Query("SELECT mp FROM MeetingPlan mp WHERE " +
        "(mp.name LIKE CONCAT('%',:query, '%') OR mp.location LIKE CONCAT('%', :query, '%')) " +
        "AND mp.ownerUserId = :ownerUserId " +
        "AND mp.visible = 1")
    List<MeetingPlan> searchMeetingPlansTeacher(@Param("query") String query, @Param("ownerUserId") Long ownerUserId);

}
