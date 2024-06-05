package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class StudentMeetingPlanDto {
    private Long studentId;
    private String studentName;
    private Long meetingPlanId;
    private String meetingPlanName;
    private Long groupId;
    private String courseName;
}
