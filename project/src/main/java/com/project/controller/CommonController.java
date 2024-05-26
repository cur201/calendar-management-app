package com.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.entities.GroupTbl;
import com.project.entities.MeetingPlan;
import com.project.entities.User;
import com.project.exceptions.UserNotFoundException;
import com.project.services.GroupService;
import com.project.services.MeetingPlanService;
import com.project.services.UserService;

@RestController
@RequestMapping("/common")
public class CommonController {
    private final MeetingPlanService meetingPlanService;
    private final UserService userService;
    private final GroupService groupService;

    public CommonController(MeetingPlanService meetingPlanService, UserService userService, GroupService groupService)
    {
        this.meetingPlanService = meetingPlanService;
        this.userService = userService;
        this.groupService = groupService;
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
}
