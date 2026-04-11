package com.notes_tracker.backend.security.presentation;


import com.notes_tracker.backend.config.JwtTokenUtil;
import com.notes_tracker.backend.security.application.AuthenticationService;
import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.request.AuthenticationRequest;
import com.notes_tracker.backend.security.presentation.request.RegisterRequest;
import com.notes_tracker.backend.security.presentation.response.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest)  {
        User authenticatedUser = this.authenticationService.authenticate(authenticationRequest.email(), authenticationRequest.password());
        String jwtToken = jwtTokenUtil.generateToken(authenticatedUser);

        AuthResponse authResponse = new AuthResponse(
                jwtToken,
                jwtTokenUtil.getExpirationTime(),
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
