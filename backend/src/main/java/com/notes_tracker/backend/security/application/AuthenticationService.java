package com.notes_tracker.backend.security.application;

import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.PasswordDoestNotMatchException;
import com.notes_tracker.backend.security.presentation.exception.UserAlreadyExistsByEmailException;
import com.notes_tracker.backend.security.presentation.request.RegisterRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private  final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticate(String email, String password) {
        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );
        return this.userRepository.findByEmailAddress(email)
                .orElseThrow();
    }

    public User register(RegisterRequest request) {
        if(this.userRepository.existsByEmailAddress(request.emailAddress())){
            throw new UserAlreadyExistsByEmailException("Email address is already in use, try a different one");
        }
        if(!request.password().equals(request.passwordConfirm())){
            throw new PasswordDoestNotMatchException("The password and password confirmation must be identical.");
        }

        User user = new User.Builder()
                .displayName(request.displayName())
                .emailAddress(request.emailAddress())
                .password(passwordEncoder.encode(request.password()))
                .build();

        return this.userRepository.save(user);
    }
}

