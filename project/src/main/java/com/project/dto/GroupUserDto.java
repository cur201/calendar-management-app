package com.project.dto;

import com.project.entities.GroupTbl;
import com.project.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GroupUserDto {
    private Long userId;
    private Long groupId;
}
