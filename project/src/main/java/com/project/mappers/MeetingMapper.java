package com.project.mappers;

import com.project.dto.MeetingDto;
import com.project.entities.Meeting;
import org.mapstruct.Mapper;
import org.springframework.context.annotation.ComponentScan;

@Mapper(componentModel = "spring")
@ComponentScan
public interface MeetingMapper {
    MeetingDto toMeetingDto(Meeting meeting);
    Meeting toMeeting(MeetingDto meetingDto);
}
