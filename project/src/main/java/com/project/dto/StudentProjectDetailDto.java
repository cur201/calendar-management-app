package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class StudentProjectDetailDto {

    private Long id;
    private Long userId;
    private String studentCode;
    private Long classId;
    private String courseId;
    private String courseName;
    private String projectName;
    private Long instructorId;
    private Long visible;
}
