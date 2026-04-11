package com.notes_tracker.backend.security.presentation;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notes_tracker.backend.config.JwtTokenUtil;
import com.notes_tracker.backend.security.application.AuthenticationService;
import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.request.AuthenticationRequest;
import com.notes_tracker.backend.security.presentation.request.RegisterRequest;
import com.notes_tracker.backend.security.presentation.response.AuthResponse;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtTokenUtil jwtTokenUtil, AuthenticationService authenticationService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationService = authenticationService;
    }

    @PostMapping()
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthenticationRequest request)  {
        User authenticatedUser = this.authenticationService.authenticate(request.email(), request.password());
        String jwtToken = jwtTokenUtil.generateToken(authenticatedUser);

        AuthResponse authResponse = new AuthResponse(
                jwtToken,
                UserDto.from(authenticatedUser)
        );
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        User user = this.authenticationService.register(request);
        return  ResponseEntity.ok(UserDto.from(user));
    }

}
