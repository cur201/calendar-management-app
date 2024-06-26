package com.project.controller;

import com.project.dto.MeetingDto;
import com.project.entities.Meeting;
import com.project.entities.MeetingPlan;
import com.project.services.GroupService;
import com.project.services.MeetingPlanService;
import com.project.services.MeetingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {
    private final MeetingService meetingService;
    private final MeetingPlanService meetingPlanService;
    private final GroupService groupService;

    public StudentController(MeetingService meetingService, MeetingPlanService meetingPlanService, GroupService groupService) {
        this.meetingService = meetingService;
        this.meetingPlanService = meetingPlanService;
        this.groupService = groupService;
    }


    @PostMapping("/add-meeting-student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Meeting> addMeeting(@RequestBody MeetingDto meetingDto) {
        Meeting newMeeting = meetingService.addMeeting(meetingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newMeeting);
    }

    @PostMapping("/update-meeting-student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Meeting> updateMeeting(@RequestBody MeetingDto meetingDto) {
        Meeting updatedMeeting = meetingService.updateMeeting(meetingDto);
        if (updatedMeeting != null) {
            return ResponseEntity.ok(updatedMeeting);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get-meeting-by-group-id-student/{groupId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Meeting>> getMeetingsByGroupId(@PathVariable("groupId") Long groupId) {
        List<Meeting> meetings = meetingService.findMeetingByGroupId(groupId);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/get-meeting-by-student-id/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Meeting>> getMeetingsByStudentId(@PathVariable("studentId") Long studentId) {
        List<Meeting> meetings = meetingService.findMeetingByUserId(studentId);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/get-meeting-plan-by-student-id/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<MeetingPlan>> getMeetingPlanByStudentId(@PathVariable("studentId") Long studentId) {
        List<MeetingPlan> meetingPlans = meetingPlanService.findMeetingPlanByUserId(studentId);
        return ResponseEntity.ok(meetingPlans);
    }
}
