package com.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.entities.GroupTbl;
import com.project.entities.GroupUser;
import com.project.entities.MeetingPlan;
import com.project.entities.TimeSlot;
import com.project.entities.User;
import com.project.exceptions.UserNotFoundException;
import com.project.services.GroupService;
import com.project.services.GroupUserService;
import com.project.services.MeetingPlanService;
import com.project.services.TimeSlotService;
import com.project.services.UserService;

@RestController
@RequestMapping("/common")
public class CommonController {
    private final MeetingPlanService meetingPlanService;
    private final UserService userService;
    private final GroupService groupService;
    private final TimeSlotService timeSlotService;
    private final GroupUserService groupUserService;

    public CommonController(MeetingPlanService meetingPlanService, UserService userService, GroupService groupService, TimeSlotService timeSlotService, GroupUserService groupUserService)
    {
        this.meetingPlanService = meetingPlanService;
        this.userService = userService;
        this.groupService = groupService;
        this.timeSlotService = timeSlotService;
        this.groupUserService = groupUserService;
    }

    @GetMapping("/get-user/{id}")
    @PreAuthorize("hasAuthority('TEACHER') and hasAuthority('STUDENT')")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            User user = userService.getUserByUserId(id);
            return ResponseEntity.ok(user);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @GetMapping("/get-meeting-plan/{id}")
    @PreAuthorize("hasAuthority('TEACHER') and hasAuthority('STUDENT')")
    public ResponseEntity<?> getMeetingPlan(@PathVariable Long id) {
        try {
            MeetingPlan meetingPlan = meetingPlanService.getMeetingPlanByMeetingPlanId(id);
            return ResponseEntity.ok(meetingPlan);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @GetMapping("/get-group/{id}")
    @PreAuthorize("hasAuthority('TEACHER') and hasAuthority('STUDENT')")
    public ResponseEntity<?> getGroup(@PathVariable Long id) {
        try {
            GroupTbl groupTbl = groupService.getGroupByGroupId(id);
            return ResponseEntity.ok(groupTbl);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }



    @GetMapping("/get-timeslot-by-meetingplan-id")
    @PreAuthorize("hasAuthority('TEACHER') and hasAuthority('STUDENT')")
    public ResponseEntity<List<TimeSlot>> getTimeSlotByMeetingPlanId(@RequestParam Long meetingPlanId){
        List<TimeSlot> timeSlotList = timeSlotService.findTimeSlotByMeetingPlanId(meetingPlanId);
        return ResponseEntity.ok(timeSlotList);
    }

    @GetMapping("/get-group-user-in-group/{groupId}")
    @PreAuthorize("hasAuthority('TEACHER') and hasAuthority('STUDENT')")
    public ResponseEntity<List<GroupUser>> getGroupUsersByGroupId(@PathVariable Long groupId) {
        List<GroupUser> groupUsers = groupUserService.getGroupUserByGroupId(groupId);
        return ResponseEntity.ok(groupUsers);
    }
}
