package com.notes_tracker.backend.security.application;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.UserNotFoundException;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     *
     * @param username the username (is the user email) identifying the user whose data is required.
     * @return
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = this.userRepository.findByEmailAddress(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found by provided email");
        }
        return new org.springframework.security.core.userdetails.User(user.get().getEmailAddress(), user.get().getPassword(), user.get().getAuthorities());
    }

    public UserDto getUser(String userId) {
        User user = this.getUserById(userId);
        return UserDto.from(user);
    }

    public UserDto updateUser(String userId, String emailAddress, String fireBaseUid, String displayName, String photoURL) {
        User user = this.getUserById(userId);

        user.update(
                fireBaseUid,
                displayName,
                emailAddress,
                photoURL
        );

        this.userRepository.save(user);
        return UserDto.from(user);
    }

    public void deleteUser(String userId) {
        if (!this.userRepository.existsById(userId)) {
            throw new UserNotFoundException("Cannot delete: User not found");
        }
        this.userRepository.deleteById(userId);
    }

    private User getUserById(String userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with provided id"));
    }

    public void initWithMockUser() {
        Optional<User> user = this.userRepository.findByDisplayName("MOCK_USER");
        if (user.isEmpty()) {
            this.userRepository.save(
                    new User.Builder()
                            .displayName("MOCK_USER")
                            .emailAddress("mockuser@gmail.com")
                            .password(new BCryptPasswordEncoder().encode("password"))
                            .build());
        }
    }

    private String getUserIdByDisplayName(String displayName) {
        Optional<User> user = this.userRepository.findByDisplayName(displayName);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found by provided display name " + displayName);
        }
        return user.get().getId();
    }

    // https://www.youtube.com/watch?v=mt7wR0CujHo  1:34:10
    public String getUserIdByAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return this.getUserIdByDisplayName(authentication.getName());
    }
}
