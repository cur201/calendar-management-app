package com.project.controller;

import com.project.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class MessageController {


    //TODO:: Remove message controller
    @GetMapping("/message")
    public ResponseEntity<List<String>> message()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //System.out.println(authentication);
        if (authentication != null && authentication.getPrincipal() instanceof UserDto) {
            UserDto userDetails = (UserDto) authentication.getPrincipal();
            System.out.println(userDetails);
            String userName = userDetails.getUsername();
            String name = userDetails.getName();
            String role = userDetails.getRole();
            return ResponseEntity.ok(Arrays.asList(userName, name, role));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
