package com.sigmotos.workshopservice.exception;

public class DuplicatePlateException extends RuntimeException {

    public DuplicatePlateException(String plate) {
        super("Ya existe un vehículo registrado con la placa: " + plate);
    }
}
