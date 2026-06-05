package com.notes_tracker.backend.security.application;

import com.notes_tracker.backend.security.data.UserRepository;
import com.notes_tracker.backend.security.domain.User;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;


@Service
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final OidcUserService oidcUserService;
    private final UserRepository userRepository;

    public CustomOidcUserService( UserRepository userRepository) {
        this.oidcUserService = new OidcUserService();  // default OIDC service
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        // load user details fron google (or other OIDC provider).
        // Delegate to the default OidcUserService to load user info from the OAuth2 provider
        OidcUser oidcUser = this.oidcUserService.loadUser(userRequest);

        final String name = oidcUser.getAttribute("name");
        final String email = oidcUser.getAttribute("email");
        final String photoUrl = oidcUser.getAttribute("picture");

        // // Check if the user exists in the database; if not, create a new user with default role USER
        User user = this.userRepository.findByEmailAddress(email).orElseGet(() -> userRepository.save(
                new User.Builder().displayName(name).emailAddress(email).photoURL(photoUrl).build()
        ));

        return new DefaultOidcUser(user.getAuthorities(), oidcUser.getIdToken(), oidcUser.getUserInfo());
    }
}
