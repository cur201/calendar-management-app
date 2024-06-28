package com.project.repositories;

import com.project.entities.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
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

    @Query("SELECT mp.ownerUserId FROM Meeting m " +
        "JOIN GroupTbl g ON m.groupId = g.id " +
        "JOIN MeetingPlan mp ON g.meetingPlanId = mp.id " +
        "JOIN User u ON mp.ownerUserId = u.id " +
        "WHERE m.groupId = :groupId AND m.visible = 1 AND g.visible = 1 AND mp.visible = 1 AND u.visible = 1")
    Long findOwnerUserIdByMeetingGroupId(@Param("groupId") Long groupId);

    @Query("SELECT m FROM Meeting m " +
        "JOIN GroupUser gu ON gu.groupId = m.groupId " +
        "JOIN GroupTbl g ON g.id = m.groupId " +
        "JOIN MeetingPlan mp ON mp.id = g.meetingPlanId " +
        "WHERE gu.userId = :userId AND mp.ownerUserId = :ownerUserId AND m.visible = 1")
    List<Meeting> findMeetingsByUserIdAndOwnerUserId(@Param("userId") Long userId, @Param("ownerUserId") Long ownerUserId);

    @Query("SELECT m from MeetingPlan mp " + 
        "JOIN GroupTbl g ON g.meetingPlanId = mp.id " +
        "JOIN User u ON  mp.ownerUserId = u.id " +
        "JOIN Meeting m ON m.groupId = g.id " +
        "WHERE u.id = :userId AND m.startTime < :timeEnd AND m.endTime > :timeStart AND m.meetingDate = :meetingDate AND m.state = 'Accepted' AND m.id != :meetingId")
    List<Meeting> findConflictMeetingByOwnerUserId(@Param("userId") Long userId, @Param("timeStart") LocalTime timeStart, @Param("timeEnd") LocalTime timeEnd, @Param("meetingDate") LocalDate meetingDate, @Param("meetingId") Long meetingId);

    @Query("SELECT m from User u " + 
        "JOIN GroupUser gu ON gu.userId = u.id " +
        "JOIN GroupTbl g ON  g.id = gu.groupId " +
        "JOIN Meeting m ON m.groupId = g.id " +
        "WHERE u.id = :userId AND m.startTime < :timeEnd AND m.endTime > :timeStart AND m.meetingDate = :meetingDate AND m.state = 'Accepted' AND m.id != :meetingId")
    List<Meeting> findConflictMeetingByStudentId(@Param("userId") Long userId, @Param("timeStart") LocalTime timeStart, @Param("timeEnd") LocalTime timeEnd, @Param("meetingDate") LocalDate meetingDate, @Param("meetingId") Long meetingId);
}
