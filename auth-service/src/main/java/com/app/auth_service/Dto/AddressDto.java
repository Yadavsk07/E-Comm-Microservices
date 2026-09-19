package com.app.auth_service.Dto;

import lombok.Data;

@Data
public class AddressDto {
    private String street;
    private String city;
    private String state;
    private String country;
    private String zipcode;
}
