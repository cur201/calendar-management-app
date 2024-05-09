package com.project.mappers;

import com.project.dto.MeetingPlanDto;
import com.project.dto.UpdateMeetingPlanDto;
import com.project.entities.MeetingPlan;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MeetingPlanMapper {
    MeetingPlanDto toMeetingPlanDto(MeetingPlan meetingPlan);
    MeetingPlan toMeetingPlan(MeetingPlanDto meetingPlanDto);

    UpdateMeetingPlanDto toUpdateMeetingPlanDto(MeetingPlan meetingPlan);
    MeetingPlan toMeetingPlan(UpdateMeetingPlanDto meetingPlanDto);
}
