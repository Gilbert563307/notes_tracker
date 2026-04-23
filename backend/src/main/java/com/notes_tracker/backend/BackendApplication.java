package com.notes_tracker.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.notes_tracker.backend.security.application.UserService;

@SpringBootApplication
public class BackendApplication {

    private final UserService userService;

    public BackendApplication(UserService userService) {
        this.userService = userService;
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner dummyData(){
        this.userService.initWithMockUser();
        return (args) -> {

        };
    }

}
