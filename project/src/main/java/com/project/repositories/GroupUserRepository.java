package com.project.repositories;

import com.project.entities.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {

    List<GroupUser> findGroupUserByGroupId(Long groupId);

    List<GroupUser> findByUserId(Long userId);

    @Query("SELECT gu FROM GroupUser gu JOIN GroupTbl g ON gu.groupId = g.id WHERE gu.groupId = :groupId AND gu.userId = :userId AND g.visible = 1")
    GroupUser findByUserIdAndGroupId(@Param("groupId")Long groupId, @Param("userId")Long userId);

    @Query("SELECT gu FROM GroupUser gu WHERE gu.userId IN (SELECT u.id FROM User u WHERE u.role = 'STUDENT')")
    List<GroupUser> findByStudentRole();

    @Transactional
    void deleteByUserIdAndGroupId(Long userId, Long groupId);

    @Query("SELECT gu FROM GroupUser gu JOIN GroupTbl g ON gu.groupId = g.id WHERE gu.userId = :userId AND g.meetingPlanId = :meetingPlanId AND g.classId = :classId and g.visible = 1")
    List<GroupUser> findByUserIdAndMeetingPlanIdAndClassId(@Param("userId") Long userId, @Param("meetingPlanId") Long meetingPlanId, @Param("classId") Long classId);
}
