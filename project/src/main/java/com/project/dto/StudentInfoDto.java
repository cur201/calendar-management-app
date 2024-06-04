package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class StudentInfoDto {
    private String studentEmail;
    private String studentName;
    private Long classId;
    private String courseId;
    private String courseName;
    private String studentId;
    private String projectName;
}
