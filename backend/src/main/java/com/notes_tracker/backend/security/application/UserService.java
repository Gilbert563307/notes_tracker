package com.notes_tracker.backend.security.application;

import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.UserNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = this.userRepository.findByEmailAddress(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(user.get().getEmailAddress(), user.get().getPassword(), user.get().getAuthorities());
    }

    public UserDto getUser(String userId) {
        User user = this.getUserById(userId);
        return UserDto.from(user);
    }


    public UserDto updateUser(String userId, String emailAddress, String fireBaseUid, String displayName, String photoURL ) {
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
}
