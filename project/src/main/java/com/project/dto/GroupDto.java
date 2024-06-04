package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.ComponentScan;

import java.sql.Time;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ComponentScan
public class GroupDto {
    private Long id;
    private Long meetingPlanId;
    private Long leaderId;
    private Time approveTime;
    private Long visible;
    private Long classId;
    private String courseId;
    private String courseName;
    private String projectName;
}
