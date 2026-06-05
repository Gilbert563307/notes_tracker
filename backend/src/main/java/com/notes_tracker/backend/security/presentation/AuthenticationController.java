package com.notes_tracker.backend.security.presentation;


import com.notes_tracker.backend.security.application.UserService;
import com.notes_tracker.backend.security.application.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final UserService userService;

    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUserInfo(OAuth2AuthenticationToken auth) {
        if (auth == null) {
            // If no authentication, return 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String email = auth.getPrincipal().getAttribute("email");
        UserDto userDto = this.userService.getUserDtoByEmail(email);
        return ResponseEntity.ok(userDto);
    }

}
