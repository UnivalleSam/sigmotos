package com.sigmotos.workshopservice.exception;

public class PlateAlreadyExistsException extends RuntimeException {

    public PlateAlreadyExistsException(String message) {
        super(message);
    }
}
