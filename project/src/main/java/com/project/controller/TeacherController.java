package com.project.controller;

import com.project.dto.*;
import com.project.entities.*;
import com.project.mappers.GroupMapper;
import com.project.mappers.MeetingPlanMapper;
import com.project.mappers.UserDtoUserDetailsMapper;
import com.project.services.*;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
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
    private final StudentProjectDetailService studentProjectDetailService;
    // private final TimeSlotService timeSlotService;

    // public TeacherController(MeetingPlanService meetingPlanService, MeetingPlanMapper meetingPlanMapper,
    //                          GroupService groupService, GroupMapper groupMapper, GroupUserService groupUserService,
    //                          MeetingService meetingService, UserService userService, UserDtoUserDetailsMapper userDtoUserDetailsMapper, TimeSlotService timeSlotService) {
    public TeacherController(MeetingPlanService meetingPlanService, MeetingPlanMapper meetingPlanMapper,
                            GroupService groupService, GroupMapper groupMapper, GroupUserService groupUserService,
                            MeetingService meetingService, UserService userService, UserDtoUserDetailsMapper userDtoUserDetailsMapper, 
                            StudentProjectDetailService studentProjectDetailService){
        this.meetingPlanService = meetingPlanService;
        this.meetingPlanMapper = meetingPlanMapper;
        this.groupService = groupService;
        this.groupMapper = groupMapper;
        this.groupUserService = groupUserService;
        this.meetingService = meetingService;
        this.userService = userService;
        this.userDtoUserDetailsMapper = userDtoUserDetailsMapper;
        this.studentProjectDetailService = studentProjectDetailService;
        // this.timeSlotService = timeSlotService;
    }

    ///-----------------------------------------------Meeting Plan API------------------------------------///
    @GetMapping("/get-plans")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<MeetingPlan>> getMeetingPlans() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long userId = userDto.getId();
            List<MeetingPlan> meetingPlans = meetingPlanService.findMeetingPlanByOwnerUserId(userId);
            return new ResponseEntity<>(meetingPlans, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/search-meeting-plan-teacher")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<MeetingPlan>> searchMeetingPlans(@RequestParam String query, @RequestParam Long ownerUserId) {
        List<MeetingPlan> meetingPlans = meetingPlanService.searchMeeting(query, ownerUserId);
        return ResponseEntity.ok(meetingPlans);
    }

    @PostMapping("/add-meeting-plan")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<?> addMeetingPlan(@RequestBody MeetingPlanDto meetingPlanDto){

        System.out.println("Meeting plan dto: " + meetingPlanDto);
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

    @GetMapping("/get-group-by-owner-user-id")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<GroupTbl>> getGroupsByOwnerUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long userId = userDto.getId();
            List<GroupTbl> groupTblList = groupService.getGroupByOwnerUserId(userId);
            return new ResponseEntity<>(groupTblList, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
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
    @GetMapping("/get-group-user-in-meeting-plan/{meetingPlanId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<GroupUser>> getGroupUsersByMeetingPlanId(@PathVariable Long meetingPlanId) {
        List<GroupUser> groupUsers = groupUserService.getGroupUsersByMeetingPlanId(meetingPlanId);
        return ResponseEntity.ok(groupUsers);
    }

    @PostMapping("/add-group-user")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<GroupUserDto> addGroupUser(@RequestBody GroupUserDto groupUserDto) {
        GroupUserDto addedGroupUser = groupUserService.addGroupUser(groupUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedGroupUser);
    }

    @DeleteMapping("/delete-group-user/{userId}/{groupId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<String> deleteGroupUser(@PathVariable Long userId, @PathVariable Long groupId) {
        boolean deleted = groupUserService.deleteGroupUser(userId, groupId);
        if (deleted) {
            return ResponseEntity.ok("Group user deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group user not found");
        }
    }


    ///--------------------------------------Meeting API------------------------------------------///
    @GetMapping("/get-meeting-by-owner-user-id")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Meeting>> getMeetingsByOwnerUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long userId = userDto.getId();
            List<Meeting> meetings = meetingService.findMeetingByOwnerUserId(userId);
            return ResponseEntity.ok(meetings);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/get-meeting-by-group-id/{groupId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Meeting>> getMeetingsByGroupId(@PathVariable("groupId") Long groupId) {
        List<Meeting> meetings = meetingService.findMeetingByGroupId(groupId);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/get-meeting-by-student-id/{studentId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<Meeting>> getMeetingsByStudentId(@PathVariable("studentId") Long studentId) {
        List<Meeting> meetings = meetingService.findMeetingByUserId(studentId);
        return ResponseEntity.ok(meetings);
    }
    
    @PostMapping("/add-meeting")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<Meeting> addMeeting(@RequestBody MeetingDto meetingDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long userId = userDto.getId();
            Meeting newMeeting = meetingService.addMeeting(meetingDto, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newMeeting);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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


    //TODO::Finish search Student API
    ///--------------------------------------------Student API---------------------------------///

    @GetMapping("/get-all-student/{teacherId}")
    @PreAuthorize("hasAuthority('TEACHER')")
    // public List<StudentMeetingPlanDto> getStudentsByTeacher(@PathVariable Long teacherId) {
    public List<StudentProjectDetail> getStudentsByTeacher(@PathVariable Long teacherId) {
        return userService.getStudentsByTeacher(teacherId);
    }

    @PostMapping("/add-student")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<String>> addStudent(@RequestBody List<StudentInfoDto> studentInfoDtos) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDto userDto = userDtoUserDetailsMapper.convertFromUserDetailsToUserDto(userDetails);
            Long teacherId = userDto.getId();

            List<String> results = new ArrayList<>();
            for( StudentInfoDto studentInfo: studentInfoDtos)
            {
                UserDto newUserDto = new UserDto();
                String studentEmail = studentInfo.getStudentEmail();
                String studentName = studentInfo.getStudentName();
                Long classId = studentInfo.getClassId();
    
                boolean checkExistEmail = userService.checkExistUsername(studentEmail);
    
                if(checkExistEmail == false){
                    //Create new account with default password 123
                    SignUpDto signUpDto = new SignUpDto(studentName, studentEmail, "123".toCharArray(), "STUDENT");
                    newUserDto = userService.register(signUpDto);
                    results.add("Create account: " + studentName);
                }else{
                    newUserDto = userService.findByLogin(studentEmail);
                }
    
                //Check if account already in one group in that meeting plan
                // boolean isExist = groupUserService.isUserWithClassIdInAnyGroupInMeetingPlan(newUserDto.getId(), meetingPlanId, classId);
                boolean isExist = studentProjectDetailService.isStudentProjectDetailExist(newUserDto.getId(), classId);

                System.out.println("Student id: " + newUserDto.getId());
                System.out.println("ClassId: " + classId);
                System.out.println("isExist student: " + isExist);

                if (!isExist) {
                    // Add new group
                    // GroupDto newGroupDto = new GroupDto();
                    // newGroupDto.setMeetingPlanId(meetingPlanId);
                    // newGroupDto.setLeaderId(newUserDto.getId());
    
                    StudentProjectDetailDto newStudentProjectDetailDto = new StudentProjectDetailDto();
    
                    newStudentProjectDetailDto.setUserId(newUserDto.getId());
                    newStudentProjectDetailDto.setStudentCode(studentInfo.getStudentId());
                    newStudentProjectDetailDto.setClassId(classId);
                    newStudentProjectDetailDto.setCourseId(studentInfo.getCourseId());
                    newStudentProjectDetailDto.setCourseName(studentInfo.getCourseName());
                    newStudentProjectDetailDto.setProjectName(studentInfo.getProjectName());
                    newStudentProjectDetailDto.setInstructorId(teacherId);
                    newStudentProjectDetailDto.setVisible(1L);
                    
                    studentProjectDetailService.saveStudentProjectDetail(newStudentProjectDetailDto);

                    // GroupDto newGroup = groupService.addGroup(newGroupDto);
    
                    // Add new group user
                    // GroupUser groupUser = new GroupUser();
                    // groupUser.setUserId(newUserDto.getId());
                    // groupUser.setGroupId(newGroup.getId());
                    // groupUser.setStudentId(studentInfo.getStudentId());
                    // groupUserService.saveGroupUser(groupUser);
    
                    User newMeetingPlanUser = new User(null, newUserDto.getName(), newUserDto.getUsername(),
                            newUserDto.getPassword(), newUserDto.getRole(), 1L);
                    results.add("Added " + newMeetingPlanUser + ".");
                }else{
                    results.add("User with this classID already exists for email: " + studentEmail);
                }
            }
            return ResponseEntity.ok(results);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/add-student-to-meeting-plan")
    @PreAuthorize("hasAuthority('TEACHER')")
    public ResponseEntity<List<String>> addStudentToMeetingPlan(@RequestBody List<StudentProjectDetail> studentProjectDetails) {
        List<String> results = new ArrayList<>();
        return ResponseEntity.ok(results);
    }

}
