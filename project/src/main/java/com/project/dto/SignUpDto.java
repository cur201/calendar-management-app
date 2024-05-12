package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.ComponentScan;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ComponentScan
public class SignUpDto {
    private String name;
    private String username;
    private char[] password;
    private String role;
}
