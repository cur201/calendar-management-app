package com.project.services;

import com.project.dto.GroupDto;
import com.project.entities.GroupTbl;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.GroupMapper;
import com.project.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;

    public List<GroupTbl> getGroupByOwnerUserId(Long userId) {
        return groupRepository.findGroupsByMeetingPlanId_OwnerUserId(userId);
    }

    public List<GroupTbl> getGroupByMeetingPlanId(Long meetingPlanId){
        return groupRepository.findGroupByMeetingPlanIdAndVisible(meetingPlanId, 1);
    }

    public GroupDto addGroup(GroupDto groupDto)
    {
        GroupTbl newGroupTbl = groupMapper.toGroup(groupDto);
        System.out.println(groupDto);
        System.out.println(newGroupTbl);
        GroupTbl savedGroupTbl = groupRepository.save(newGroupTbl);

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
        GroupTbl savedGroupTbl = groupRepository.save(updateGroupTbl);

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
}
