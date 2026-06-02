package com.sigmotos.inventoryservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String codigo;
    private String marca;
    private String categoria;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private Integer stockActual;
    private Integer stockMinimo;
    private String ubicacion;
    private Boolean activo;
    private Boolean alertaStock;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
