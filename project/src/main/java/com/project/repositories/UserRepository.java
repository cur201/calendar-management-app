package com.project.repositories;
import com.project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN GroupUser gu ON u.id = gu.userId " +
            "JOIN GroupTbl gt ON gu.groupId = gt.id " +
            "WHERE gt.meetingPlanId = :meetingPlanId")
    List<User> findUsersByMeetingPlanId(Long meetingPlanId);

    boolean existsByUsername(String username);

    List<User> findByRole(String role);

    @Query("SELECT u FROM User u WHERE u.id = :id AND u.role = :role")
    User findByIdAndRole(@Param("id") Long id, @Param("role") String role);
}
