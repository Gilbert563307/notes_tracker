package com.notes_tracker.backend.domain;


import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import com.notes_tracker.backend.security.domain.User;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserDomainTests {

    @Test
    void shouldBuildValidUser() {
        User user = new User.Builder()
                .displayName("John Doe")
                .emailAddress("john@example.com")
                .password("securePassword123")
                .fireBaseUid("fb-123")
                .build();

        assertNotNull(user);
        assertEquals("John Doe", user.getDisplayName());
        assertEquals("john@example.com", user.getEmailAddress());
        assertEquals("securePassword123", user.getPassword());
        assertTrue(user.getRoles().contains(User.Role.USER));
        assertNotNull(user.getCreatedAt());
    }

    @Test
    void shouldThrowExceptionWhenEmailIsInvalid() {
        User.Builder builder = new User.Builder()
                .displayName("John")
                .password("securePassword123")
                .emailAddress("not-an-email"); // Missing '@'

        DomainException exception = assertThrows(DomainException.class, builder::build);
        assertEquals("The email address provided is invalid.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsTooShort() {
        User.Builder builder = new User.Builder()
                .displayName("John")
                .emailAddress("john@example.com")
                .password("short"); // Less than 8 chars

        DomainException exception = assertThrows(DomainException.class, builder::build);
        assertEquals("Password is too short. It must be at least 8 characters long.", exception.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenDisplayNameIsMissing() {
        User.Builder builder = new User.Builder()
                .emailAddress("john@example.com")
                .password("securePassword123");
        // displayName not set

        DomainException exception = assertThrows(DomainException.class, builder::build);
        assertTrue(exception.getMessage().contains("Display name is missing"));
    }

    @Test
    void shouldUpdateUserSuccessfully() {
        User user = new User.Builder()
                .displayName("Old Name")
                .emailAddress("old@example.com")
                .password("securePassword123")
                .build();

        user.update("new-fb-id", "New Name", "new@example.com", "http://photo.com/1");

        assertEquals("New Name", user.getDisplayName());
        assertEquals("new@example.com", user.getEmailAddress());
        assertEquals("new-fb-id", user.getFireBaseUid());
        assertNotNull(user.getUpdatedAt());
    }

    @Test
    void shouldAssignRole() {
        User user = new User.Builder()
                .displayName("Admin User")
                .emailAddress("admin@example.com")
                .password("securePassword123")
                .build();

        user.assignRole(User.Role.ADMIN);

        assertTrue(user.getRoles().contains(User.Role.ADMIN));
        assertTrue(user.getRoles().contains(User.Role.USER));
    }
}
