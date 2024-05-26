package com.project.services;

import com.project.dto.CredentialsDto;
import com.project.dto.SignUpDto;
import com.project.dto.UserDto;
import com.project.dto.StudentMeetingPlanDto;
import com.project.entities.GroupTbl;
import com.project.entities.GroupUser;
import com.project.entities.MeetingPlan;
import com.project.entities.User;
import com.project.exceptions.AppException;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.UserMapper;
import com.project.repositories.GroupRepository;
import com.project.repositories.GroupUserRepository;
import com.project.repositories.MeetingPlansRepository;
import com.project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@ComponentScan
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final MeetingPlansRepository meetingPlansRepository;
    private final GroupRepository groupRepository;
    private final GroupUserRepository groupUserRepository;
    public UserDto findByLogin(String login) {
        User user = userRepository.findByUsername(login)
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));
        System.out.println(user);
        return userMapper.toUserDto(user);
    }

    public UserDto login(CredentialsDto credentialsDto) {
        User user = userRepository.findByUsername(credentialsDto.getUsername())
                .orElseThrow(() -> new AppException("Unknown user", HttpStatus.NOT_FOUND));

        if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())) {
            return userMapper.toUserDto(user);
        }

        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(SignUpDto userDto) {
        Optional<User> optionalUser = userRepository.findByUsername(userDto.getUsername());
        if(optionalUser.isPresent()) {
            throw new AppException("Account already exists", HttpStatus.BAD_REQUEST);
        }

        User user = userMapper.signUpToUser(userDto);
        user.setPassword(passwordEncoder.encode(CharBuffer.wrap(userDto.getPassword())));
        user.setVisible(1L);

        userRepository.save(user);
        return userMapper.toUserDto(user);
    }

    public List<User> getUsersByMeetingPlanId(Long meetingPlanId) {
        return userRepository.findUsersByMeetingPlanId(meetingPlanId);
    }

    public boolean checkExistUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User getUserByUserId(Long userId) {
        return userRepository.findById(userId)
                             .orElseThrow(() -> new UserNotFoundException("User not found with id " + userId));
    }   

    public List<StudentMeetingPlanDto> getStudentsByTeacher(Long teacherId) {
        User teacher = userRepository.findByIdAndRole(teacherId, "TEACHER");
        if (teacher == null) {
            throw new RuntimeException("Teacher not found with id: " + teacherId);
        }

        List<MeetingPlan> meetingPlans = meetingPlansRepository.findByOwnerUserId(teacherId);
        List<StudentMeetingPlanDto> results = new ArrayList<>();

        for (MeetingPlan meetingPlan : meetingPlans) {
            List<GroupTbl> groups = groupRepository.findGroupByMeetingPlanId(meetingPlan.getId());

            for (GroupTbl group : groups) {
                List<GroupUser> groupUsers = groupUserRepository.findGroupUserByGroupId(group.getId());

                for (GroupUser groupUser : groupUsers) {
                    User student = userRepository.findByIdAndRole(groupUser.getUserId(), "STUDENT");
                    if (student != null) {
                        StudentMeetingPlanDto dto = new StudentMeetingPlanDto();
                        dto.setStudentId(student.getId());
                        dto.setStudentName(student.getName());
                        dto.setMeetingPlanId(meetingPlan.getId());
                        dto.setMeetingPlanName(meetingPlan.getName());
                        dto.setGroupId(group.getId());

                        results.add(dto);
                    }
                }
            }
        }

        return results;
    }
}
