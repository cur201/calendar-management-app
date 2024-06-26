package com.project.mappers;

import org.mapstruct.Mapper;

import com.project.dto.StudentProjectDetailDto;
import com.project.entities.StudentProjectDetail;

@Mapper(componentModel = "spring")
public interface StudentProjectDetailMapper {
    StudentProjectDetail toStudentProjectDetail(StudentProjectDetailDto studentProjectDetailDto);
    StudentProjectDetailDto toStudentProjectDetailDto(StudentProjectDetail studentProjectDetail);
}
