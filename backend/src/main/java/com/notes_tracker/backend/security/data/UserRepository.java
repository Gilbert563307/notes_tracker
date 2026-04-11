package com.notes_tracker.backend.security.data;

import com.notes_tracker.backend.security.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailAddress(String emailAddress);
    Optional<User> findByDisplayName(String displayName);
    boolean existsByEmailAddress(String emailAddress);
}
