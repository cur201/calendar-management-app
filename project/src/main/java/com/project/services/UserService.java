package com.project.services;

import com.project.dto.CredentialsDto;
import com.project.dto.SignUpDto;
import com.project.dto.UserDto;
import com.project.entities.User;
import com.project.exceptions.AppException;
import com.project.exceptions.UserNotFoundException;
import com.project.mappers.UserMapper;
import com.project.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@ComponentScan
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
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

        User savedUser = userRepository.save(user);
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
}
