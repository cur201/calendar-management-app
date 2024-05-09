package com.project.mappers;

import com.project.dto.GroupUserDto;
import com.project.entities.GroupUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupUserMapper {
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "groupId", target = "groupId")
    GroupUserDto toGroupUserDto(GroupUser groupUser);
    GroupUser toGroupUser(GroupUserDto groupUserDto);
}
