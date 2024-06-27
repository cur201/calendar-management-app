package com.project.services;

import com.project.dto.GroupDto;
import com.project.entities.GroupTbl;
import com.project.entities.GroupUser;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.GroupMapper;
import com.project.repositories.GroupRepository;
import com.project.repositories.GroupUserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;
    private final GroupUserRepository groupUserRepository;

    public List<GroupTbl> getGroupByOwnerUserId(Long userId) {
        return groupRepository.findGroupsByMeetingPlanId_OwnerUserId(userId);
    }

    public List<GroupTbl> getGroupByMeetingPlanId(Long meetingPlanId){
        return groupRepository.findGroupByMeetingPlanIdAndVisible(meetingPlanId, 1);
    }

    public List<GroupTbl> getGroupsByUserId(Long userId) {
    List<GroupUser> groupUsers = groupUserRepository.findByUserId(userId);
    
    List<Long> groupIds = groupUsers.stream()
                                        .map(GroupUser::getGroupId)
                                        .collect(Collectors.toList());

    return groupRepository.findByIdIn(groupIds);
    }

    public GroupDto addGroup(GroupDto groupDto)
    {
        GroupTbl newGroupTbl = groupMapper.toGroup(groupDto);
        System.out.println(groupDto);
        System.out.println(newGroupTbl);
        groupRepository.save(newGroupTbl);

        return groupMapper.toGroupDto(newGroupTbl);
    }

    public GroupDto updateGroup(GroupDto groupDto)
    {
        GroupTbl updateGroupTbl = groupMapper.toGroup(groupDto);

        Long updateGroupId = updateGroupTbl.getId();

        Optional<GroupTbl> optionalGroup = groupRepository.findById(updateGroupId);
        if (!optionalGroup.isPresent()) {
            throw new IllegalArgumentException("Meeting plan with ID " + updateGroupId + " does not exist");
        }
        groupRepository.save(updateGroupTbl);

        return groupMapper.toGroupDto(updateGroupTbl);
    }

    public GroupTbl deleteGroup(Long id){
        Optional<GroupTbl> optionalGroup = groupRepository.findById(id);
        if (!optionalGroup.isPresent()) {
            throw new IllegalArgumentException("Meeting plan with ID " + id + " does not exist");
        }

        GroupTbl existingGroupTbl = optionalGroup.get();
        existingGroupTbl.setVisible(0L);
        return groupRepository.save(existingGroupTbl);
    }

    public GroupTbl getGroupByGroupId(Long groupId) {
        return groupRepository.findById(groupId)
                        .orElseThrow(() -> new UserNotFoundException("Group not found with id " + groupId));
    }

    public GroupTbl getGroupByLeaderIdAndMeetingPlanIdAnhLeaderDetailId(Long leaderId, Long meetingPlanId, Long leaderDetailId) throws Exception {
        return groupRepository.findByLeaderIdAndMeetingPlanIdAndLeaderDetailId(leaderId, meetingPlanId, leaderDetailId)
                        .orElseThrow(() -> new Exception("Group not found with Leader detail id " + leaderDetailId));
    }
}
