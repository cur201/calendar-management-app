package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MeetingPlanDto {
    private Long id;
    private String name;
    private String duration;
    private String location;
    private String description;
    private Long ownerUserId;
    private Long visible;
    private List<TimeSlotDto> timeslot;
}
