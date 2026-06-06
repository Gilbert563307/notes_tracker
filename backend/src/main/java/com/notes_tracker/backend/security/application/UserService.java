package com.notes_tracker.backend.security.application;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.UserNotFoundAuthorizationException;
import com.notes_tracker.backend.security.presentation.exception.UserNotFoundException;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUser(String userId) {
        User user = this.getUserById(userId);
        return UserDto.from(user);
    }

    public UserDto updateUser(String userId, String emailAddress, String fireBaseUid, String displayName,
            String photoURL) {
        User user = this.getUserById(userId);

        user.update(
                fireBaseUid,
                displayName,
                emailAddress,
                photoURL);

        this.userRepository.save(user);
        return UserDto.from(user);
    }

    public void deleteUser(String userId) {
        if (!this.userRepository.existsById(userId)) {
            throw new UserNotFoundException("Cannot delete: User not found");
        }
        this.userRepository.deleteById(userId);
    }

    public UserDto getUserDtoByEmail(String email) {
        Optional<User> user = this.userRepository.findByEmailAddress(email);
        if (user.isEmpty()) {
            throw new UserNotFoundAuthorizationException("User not found by provided email " + email);
        }
        return UserDto.from(user.get());
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmailAddress(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email " + email));
    }

    private User getUserById(String userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with provided id " + userId));
    }

    public String getUserIdByAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        User user  = this.getUserByEmail(email);
        return user.getId();
    }
}
