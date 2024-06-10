package com.project.mappers;

import com.project.dto.GroupDto;
import com.project.entities.GroupTbl;
import org.mapstruct.Mapper;
// import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupMapper {

    GroupDto toGroupDto(GroupTbl groupTbl);

    GroupTbl toGroup(GroupDto groupDto);
}
