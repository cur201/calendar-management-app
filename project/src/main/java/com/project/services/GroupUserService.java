package com.project.services;

import com.project.dto.GroupUserDto;
import com.project.entities.GroupUser;
import com.project.mappers.GroupUserMapper;
import com.project.repositories.GroupUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GroupUserService {
    private final GroupUserRepository groupUserRepository;
    private final GroupUserMapper groupUserMapper;

    public List<GroupUser> getGroupUserByGroupId(Long groupId) {
        return groupUserRepository.findGroupUserByGroupId(groupId);
    }

    public GroupUserDto addGroupUser(GroupUserDto groupUserDto)
    {
        GroupUser newGroupUser = groupUserMapper.toGroupUser(groupUserDto);
        GroupUser savedGroupUser = groupUserRepository.save(newGroupUser);

        return groupUserMapper.toGroupUserDto(newGroupUser);
    }

    public boolean deleteGroupUser(Long userId, Long groupId) {
        try {
            groupUserRepository.deleteByUserIdAndGroupId(userId, groupId);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }
}
