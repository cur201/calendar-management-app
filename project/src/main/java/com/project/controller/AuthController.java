package com.project.controller;

import com.project.config.UserAuthProvider;
import com.project.dto.CredentialsDto;
import com.project.dto.SignUpDto;
import com.project.dto.UserDto;
import com.project.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RequiredArgsConstructor
@RestController
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsDto) {
        UserDto user = userService.login(credentialsDto);

        user.setToken(userAuthProvider.createToken(user.getUsername()));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody SignUpDto signUpDto)
    {
        UserDto user = userService.register(signUpDto);
        user.setToken(userAuthProvider.createToken(user.getUsername()));
        return ResponseEntity.created(URI.create("/user/" + user.getId())).body(user);
    }
}
