package com.sigmotos.inventoryservice.dto;

import com.sigmotos.inventoryservice.entity.TipoMovimiento;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoResponse {

    private Long id;
    private Long productoId;
    private String productoNombre;
    private String productoCodigo;
    private TipoMovimiento tipoMovimiento;
    private Integer cantidad;
    private String motivo;
    private LocalDateTime fechaMovimiento;
    private Long usuarioId;
}
