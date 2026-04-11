package com.notes_tracker.backend.application.integration;


import com.notes_tracker.backend.security.application.UserService;
import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import com.notes_tracker.backend.security.presentation.exception.UserNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;


import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceIntegrationTests {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }


    @Test
    void shouldUpdateUserAndVerifyPersistence() {
        // First, create a user

       User created=   this.userRepository.save( new User.Builder()
                .displayName("John")
                .password("securePassword123")
                .fireBaseUid("222")
                .emailAddress("email@mail.com")
                .build()
    );


        UserDto updated = userService.updateUser(created.getId(), "email2@mail.com","333", "New Name", "http://newphoto.com");

        assertNotNull(updated);
        assertEquals("New Name", updated.displayName());
        assertEquals("http://newphoto.com", updated.photoURL());
    }



    @Test
    void shouldDeleteUser() {
        User created=   this.userRepository.save( new User.Builder()
                .displayName("John")
                .password("securePassword123")
                .fireBaseUid("222")
                .emailAddress("email@mail.com")
                .build()
        );

        userService.deleteUser(created.getId());

        assertThrows(UserNotFoundException.class, () -> {
            userService.getUser(created.getId());
        });
    }

    @Test
    void shouldLoadUserByUsername() {
        this.userRepository.save( new User.Builder()
                .displayName("John")
                .password("securePassword123")
                .fireBaseUid("222")
                .emailAddress("login@example.com")
                .build()
        );

        var userDetails = userService.loadUserByUsername("login@example.com");

        assertNotNull(userDetails);
        assertEquals("login@example.com", userDetails.getUsername());
    }

    @Test
    void getUserById() {
        User created =  this.userRepository.save( new User.Builder()
                .displayName("John")
                .password("securePassword123")
                .fireBaseUid("222")
                .emailAddress("login@example.com")
                .build()
        );

        UserDto user = userService.getUser(created.getId());

        assertNotNull(user);
        assertEquals("John", user.displayName());
        assertEquals(created.getId(), user.id());
        assertEquals("", user.photoURL());
    }
}
