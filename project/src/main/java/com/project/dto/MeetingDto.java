package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MeetingDto {
    private Long id;
    private Long groupId;
    private LocalTime startTime;
    private LocalTime endTime;
    private String state;
    private String report;
    private Long visible;
    private LocalDate meetingDate;
}
