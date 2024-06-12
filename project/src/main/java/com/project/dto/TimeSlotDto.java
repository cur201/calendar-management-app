package com.project.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class TimeSlotDto {
    private Long id;
    private DayOfWeek weekday;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer repetitionCount;
}
