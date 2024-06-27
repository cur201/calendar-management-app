package com.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GroupUserDto {
    private Long id;
    private Long userId;
    private Long groupId;
    private Long studentDetailId;
}
