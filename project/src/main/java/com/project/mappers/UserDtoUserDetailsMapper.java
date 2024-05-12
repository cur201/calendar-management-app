package com.project.mappers;

import com.project.dto.UserDto;
import com.project.services.UserService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserDtoUserDetailsMapper {

    private final UserService userService;

    public UserDtoUserDetailsMapper(UserService userService) {
        this.userService = userService;
    }

    public UserDetails convertFromUserDtoToUserDetails(UserDto userDto) {
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(userDto.getRole());

        return new User(
                userDto.getUsername(),
                userDto.getPassword(),
                authorities
        );
    }

    public UserDto convertFromUserDetailsToUserDto(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }

        String username = userDetails.getUsername();
        UserDto userDto = userService.findByLogin(username);
        if (userDto != null) {
            return userDto;
        } else {
            return null;
        }
    }


}