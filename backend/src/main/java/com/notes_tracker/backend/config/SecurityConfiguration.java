package com.notes_tracker.backend.config;

import java.util.List;

import com.notes_tracker.backend.security.application.CustomOidcUserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

//https://stackoverflow.com/questions/75113210/401-unauthorized-when-using-spring-security-bcrypt-in-spring-boot-jpa
//https://www.baeldung.com/spring-security-basic-authentication
//https://www.geeksforgeeks.org/advance-java/authentication-and-authorization-in-spring-boot-3-0-with-spring-security/
//LATEST DOCS https://www.djamware.com/post/integrating-jwt-authentication-with-spring-boot-and-react
@Configuration
public class SecurityConfiguration {

    private final CustomOidcUserService customOidcUserService;

    @Value("${cors.allowed.origins.localhost}")
    private String corsAllowedOriginsLocalhost;

    @Value("${cors.allowed.origins.production}")
    private String corsAllowedOriginsProduction;

    @Value("${auth.default.success.url}")
    private String authDefaultSuccessUrl;

    public SecurityConfiguration(CustomOidcUserService customOidcUserService) {
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/auth/**", "/api/login/oauth2/code/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfoEndpointConfig -> userInfoEndpointConfig.oidcUserService(this.customOidcUserService))
                                .defaultSuccessUrl(this.authDefaultSuccessUrl, true) //force redirect to this frontend page when sucessfull loged in
                        ).logout(logout -> logout
//                        .logoutSuccessUrl("http://localhost:5173/login")    // redirect to frontend login page after logout //TODO
                        .invalidateHttpSession(true)    //Invalidate the session
                        .clearAuthentication(true)  // clear authentication context
                        .deleteCookies("JESSIONID") // remove session cookie
                        .permitAll())   // Allow logout endpoint for all users
                // Exception handling (unauthenticated or forbidden cases)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);    // When not logged in → return 401 Unauthorized
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN);    // When logged in but forbidden (e.g. missing ADMIN role) → return 403
                        }))
                .build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(this.corsAllowedOriginsLocalhost, this.corsAllowedOriginsProduction));
        configuration.setAllowedMethods(List.of("HEAD","OPTIONS","GET","POST", "PUT", "PATCH", "DELETE"));
        configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;
    }

}
