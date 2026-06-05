package com.notes_tracker.backend.security.domain;

import com.notes_tracker.backend.kanboard.presentation.exception.DomainException;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class User {
    public enum Role{
        USER,
        ADMIN
    }

    @Id
    private String id;
    @Indexed(unique = true)
    private String displayName;
    @Indexed(unique = true)
    private String emailAddress;
    private Set<Role> roles;
    private String photoURL;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private User() {
    }

    public User(Builder builder) {
        this.validate(builder.emailAddress, builder.displayName);

        this.displayName = builder.displayName;
        this.emailAddress = builder.emailAddress;
        this.roles = builder.roles;
        this.photoURL = builder.photoURL;
        this.createdAt = builder.createdAt;
        this.updatedAt = builder.updatedAt;
    }

    public void update(String fireBaseUid, String displayName, String emailAddress, String photoURL) {
        this.validate(emailAddress,  displayName);
        this.displayName = displayName;
        this.emailAddress = emailAddress;
        this.photoURL = photoURL;
        this.updatedAt = LocalDateTime.now();
    }

    public void assignRole(Role role){
        this.roles.add(role);
    }

    public String getId() {
        return id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public static class Builder {
        private String displayName;
        private String emailAddress;
        private String photoURL  = "";
        private Set<Role> roles = new HashSet<>();
        //AUTO
        {
            roles.add(Role.USER);
        }
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        public Builder displayName(String displayName) {
            this.displayName = displayName;
            return this;
        }

        public Builder emailAddress(String emailAddress) {
            this.emailAddress = emailAddress;
            return this;
        }

        public Builder roles(Set<Role> roles) {
            this.roles = roles;
            return this;
        }

        public Builder photoURL(String photoURL) {
            this.photoURL = photoURL;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }

    private void validate(String email, String displayName) {
        if (email == null || email.trim().isEmpty()) {
            throw new DomainException("Email address is required. Please provide a valid email.");
        }

        // Basic email format check if you want to be thorough
        if (!email.contains("@")) {
            throw new DomainException("The email address provided is invalid.");
        }

        if (displayName == null || displayName.trim().isEmpty()) {
            throw new DomainException("Display name is missing. Please tell us what to call you.");
        }
    }
}
