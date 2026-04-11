package com.notes_tracker.backend.application;


import com.notes_tracker.backend.security.application.UserService;
import com.notes_tracker.backend.security.application.dto.UserDto;
import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.Test;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTests {

    @Test
    void shouldGetUserById() {
        // Arrange
        UserRepository repo = mock(UserRepository.class);
        UserService service = new UserService(repo);

        User user = new User.Builder()
                .displayName("John Doe")
                .emailAddress("john@example.com")
                .password("securePassword123")
                .build();

        when(repo.findById("user-123")).thenReturn(Optional.of(user));

        // Act
        UserDto result = service.getUser("user-123");

        // Assert
        verify(repo).findById("user-123");
        assertNotNull(result);
        assertEquals("John Doe", result.displayName());
    }

    @Test
    void shouldUpdateUser() {
        // Arrange
        UserRepository repo = mock(UserRepository.class);
        UserService service = new UserService(repo);

        User existingUser = new User.Builder()
                .displayName("Old Name")
                .emailAddress("old@example.com")
                .password("securePassword123")
                .build();

        when(repo.findById("user-123")).thenReturn(Optional.of(existingUser));
        when(repo.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));



        // Act
        UserDto result = service.updateUser("user-123", "new@example.com","1", "New Name","http://photo.url/image.jpg");

        // Assert
        verify(repo).save(any(User.class));
        assertEquals("New Name", result.displayName());
        assertEquals("http://photo.url/image.jpg", result.photoURL());
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        UserRepository repo = mock(UserRepository.class);
        UserService service = new UserService(repo);

        when(repo.findById("invalid-id")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> service.getUser("invalid-id"));
    }
}