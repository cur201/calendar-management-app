package com.project.repositories;

import com.project.entities.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupUserRepository extends JpaRepository<GroupUser, Long> {

    List<GroupUser> findGroupUserByGroupId(Long groupId);

    List<GroupUser> findByUserId(Long userId);

    @Transactional
    void deleteByUserIdAndGroupId(Long userId, Long groupId);
}
