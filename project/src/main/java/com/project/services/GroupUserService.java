package com.project.services;

import com.project.dto.GroupUserDto;
import com.project.entities.GroupTbl;
import com.project.entities.GroupUser;
import com.project.mappers.GroupUserMapper;
import com.project.repositories.GroupRepository;
import com.project.repositories.GroupUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class GroupUserService {
    private final GroupUserRepository groupUserRepository;
    private final GroupRepository groupRepository;
    private final GroupUserMapper groupUserMapper;

    public List<GroupUser> getGroupUserByGroupId(Long groupId) {
        return groupUserRepository.findGroupUserByGroupId(groupId);
    }

    public List<GroupUser> getGroupUsersByMeetingPlanId(Long meetingPlanId) {
        List<GroupTbl> groups = groupRepository.findGroupByMeetingPlanId(meetingPlanId);
        for(GroupTbl g: groups)
        {
            System.out.println(g);
        }
        return groups.stream()
                .flatMap(group -> groupUserRepository.findGroupUserByGroupId(group.getId()).stream())
                .collect(Collectors.toList());
    }

    public boolean isUserInAnyGroup(Long userId) {
        List<GroupUser> groupUsers = groupUserRepository.findByUserId(userId);
        return !groupUsers.isEmpty();
    }

    public void saveGroupUser(GroupUser groupUser) {
        groupUserRepository.save(groupUser);
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
