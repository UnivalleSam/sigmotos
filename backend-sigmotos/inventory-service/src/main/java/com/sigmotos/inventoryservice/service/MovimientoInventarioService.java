package com.sigmotos.inventoryservice.service;

import com.sigmotos.inventoryservice.dto.MovimientoRequest;
import com.sigmotos.inventoryservice.dto.MovimientoResponse;

import java.util.List;

public interface MovimientoInventarioService {

    MovimientoResponse registrarMovimiento(MovimientoRequest request, Long usuarioId);

    List<MovimientoResponse> obtenerTodos();

    List<MovimientoResponse> obtenerPorProductoId(Long productoId);
}
