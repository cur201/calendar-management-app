package com.project.controller;

import com.project.dto.*;
import com.project.entities.*;
import com.project.mappers.GroupMapper;
import com.project.mappers.MeetingMapper;
import com.project.mappers.MeetingPlanMapper;
import com.project.mappers.UserDtoUserDetailsMapper;
import com.project.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherController {

    private final MeetingPlanService meetingPlanService;
    private final MeetingPlanMapper meetingPlanMapper;
    private final GroupService groupService;
    private final GroupMapper groupMapper;
    private final GroupUserService groupUserService;
    private final MeetingService meetingService;
    private final UserService userService;
    private final UserDtoUserDetailsMapper userDtoUserDetailsMapper;

    @Autowired
    public TeacherController(MeetingPlanService meetingPlanService, MeetingPlanMapper meetingPlanMapper,
                             GroupService groupService, GroupMapper groupMapper, GroupUserService groupUserService,
                             MeetingService meetingService, UserService userService, UserDtoUserDetailsMapper userDtoUserDetailsMapper) {
        this.meetingPlanService = meetingPlanService;
        this.meetingPlanMapper = meetingPlanMapper;
        this.groupService = groupService;
        this.groupMapper = groupMapper;
        this.groupUserService = groupUserService;
        this.meetingService = meetingService;
        this.userService = userService;
        this.userDtoUserDetailsMapper = userDtoUserDetailsMapper;
    }


    //TODO::Handle duplicate timestamp

    ///-----------------------------------------------Meeting Plan API------------------------------------///
    @GetMapping("/get-plans")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<MeetingPlan>> getMeetingPlans()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Print authen: " + authentication);
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long userId = userDto.getId();
            System.out.println("Teacher ID: " + userId);
            List<MeetingPlan> meetingPlans = meetingPlanService.findMeetingPlanByOwnerUserId(userId);
            return new ResponseEntity<>(meetingPlans, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/add-meeting-plan")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> addMeetingPlan(@RequestBody MeetingPlanDto meetingPlanDto){

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
                Long userId = userDto.getId();
                meetingPlanDto.setOwnerUserId(userId);
                MeetingPlanDto newMeetingPlan = meetingPlanService.addMeetingPlan(meetingPlanDto);
                MeetingPlan meetingPlan = meetingPlanMapper.toMeetingPlan(newMeetingPlan);
                return ResponseEntity.created(URI.create("/meeting-plans/" + meetingPlan.getId())).body(newMeetingPlan);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

        } catch (Exception e) {
            String errorMessage = "Failed to create meeting plan: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @PostMapping("/update-meeting-plan")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> updateMeetingPlan(@RequestBody UpdateMeetingPlanDto updateMeetingPlanDto){
        try{
            UpdateMeetingPlanDto updateMeetingPlan = meetingPlanService.updateMeetingPlan(updateMeetingPlanDto);
            MeetingPlan meetingPlan = meetingPlanMapper.toMeetingPlan(updateMeetingPlan);
            return ResponseEntity.ok(meetingPlan);
        }catch (Exception e){
            String errorMessage = "Failed to update meeting plan: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @DeleteMapping("/delete-meeting-plan/{id}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> deleteMeetingPlan(@PathVariable Long id){
        try{
            MeetingPlan deleteMeetingPlan = meetingPlanService.deleteMeetingPlan(id);
            return ResponseEntity.ok(deleteMeetingPlan);
        }catch (Exception e){
            String errorMessage = "Failed to delete meeting plan: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }


    ///------------------------------------------Group API-----------------------------------------///

    //TODO::Fix to apply to only teacher acc
    @GetMapping("/get-group-by-owner-user-id/{id}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public List<GroupTbl> getGroupsByOwnerUserId(@PathVariable("id") Long userId) {
        return groupService.getGroupByOwnerUserId(userId);
    }

    @GetMapping("/get-group-by-meeting-plan-id/{id}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public List<GroupTbl> getGroupByMeetingPlanId(@PathVariable("id") Long meetingPlanId) {
        return groupService.getGroupByMeetingPlanId(meetingPlanId);
    }

    @PostMapping("/add-group")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> addGroup(@RequestBody GroupDto groupDto){

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                GroupDto newGroup = groupService.addGroup(groupDto);
                GroupTbl groupTbl = groupMapper.toGroup(newGroup);
                return ResponseEntity.created(URI.create("/meeting-plans/" + groupTbl.getId())).body(newGroup);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

        } catch (Exception e) {
            String errorMessage = "Failed to create meeting plan: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @PostMapping("/update-group")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> updateGroup(@RequestBody GroupDto updateGroupDto){
        try{
            GroupDto updateGroup = groupService.updateGroup(updateGroupDto);
            GroupTbl groupTbl = groupMapper.toGroup(updateGroup);
            return ResponseEntity.ok(groupTbl);
        }catch (Exception e){
            String errorMessage = "Failed to update group: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @DeleteMapping("/delete-group/{id}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id){
        try{
            GroupTbl deleteGroup = groupService.deleteGroup(id);
            return ResponseEntity.ok(deleteGroup);
        }catch (Exception e){
            String errorMessage = "Failed to delete group: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }


    ///-------------------------------------Group User API------------------------------------------///
    @GetMapping("/get-group-user/{groupId}")
    public ResponseEntity<List<GroupUser>> getGroupUsersByGroupId(@PathVariable Long groupId) {
        List<GroupUser> groupUsers = groupUserService.getGroupUserByGroupId(groupId);
        return ResponseEntity.ok(groupUsers);
    }

    @PostMapping("/add-group-user")
    public ResponseEntity<GroupUserDto> addGroupUser(@RequestBody GroupUserDto groupUserDto) {
        GroupUserDto addedGroupUser = groupUserService.addGroupUser(groupUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedGroupUser);
    }

    @DeleteMapping("/delete-group-user/{userId}/{groupId}")
    public ResponseEntity<String> deleteGroupUser(@PathVariable Long userId, @PathVariable Long groupId) {
        boolean deleted = groupUserService.deleteGroupUser(userId, groupId);
        System.out.println("userId: " + userId + ", groupId: " + groupId);
        if (deleted) {
            return ResponseEntity.ok("Group user deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group user not found");
        }
    }


    ///--------------------------------------Meeting API------------------------------------------///
    //TODO::Add get all meeting for teacher API
    //TODO::Apply to only teacher acc
    @GetMapping("/get-meeting-by-owner-user-id/{userId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Meeting>> getMeetingsByOwnerUserId(@PathVariable("userId") Long userId) {
        List<Meeting> meetings = meetingService.findMeetingByOwnerUserId(userId);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/get-meeting-by-group-id/{groupId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Meeting>> getMeetingsByGroupId(@PathVariable("groupId") Long groupId) {
        List<Meeting> meetings = meetingService.findMeetingByGroupId(groupId);
        return ResponseEntity.ok(meetings);
    }

    @PostMapping("/add-meeting")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Meeting> addMeeting(@RequestBody MeetingDto meetingDto) {
        Meeting newMeeting = meetingService.addMeeting(meetingDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newMeeting);
    }

    @PostMapping("/update-meeting")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Meeting> updateMeeting(@RequestBody MeetingDto meetingDto) {
        Meeting updatedMeeting = meetingService.updateMeeting(meetingDto);
        if (updatedMeeting != null) {
            return ResponseEntity.ok(updatedMeeting);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete-meeting/{meetingId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<String> deleteMeeting(@PathVariable("meetingId") Long meetingId) {
        boolean deleted = meetingService.deleteMeeting(meetingId);
        if (deleted) {
            return ResponseEntity.ok("Meeting deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Meeting not found");
        }
    }


    //TODO::Finish add, delete and search Student API
    ///--------------------------------------------Student API---------------------------------///
    @GetMapping("/get-user-by-meeting-plan-id/{meetingPlanId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<User>> getUsersByMeetingPlanId(@PathVariable Long meetingPlanId) {
        List<User> users = userService.getUsersByMeetingPlanId(meetingPlanId);
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }
}
