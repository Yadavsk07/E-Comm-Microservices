package com.app.auth_service.Dto;

import lombok.Data;

@Data
public class UserRequest {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private AddressDto address;
}
