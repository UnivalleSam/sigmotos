package com.sigmotos.inventoryservice.service;

import com.sigmotos.inventoryservice.dto.ProductoRequest;
import com.sigmotos.inventoryservice.dto.ProductoResponse;

import java.util.List;

public interface ProductoService {

    ProductoResponse crearProducto(ProductoRequest request);

    List<ProductoResponse> obtenerTodos();

    ProductoResponse obtenerPorId(Long id);

    ProductoResponse actualizarProducto(Long id, ProductoRequest request);

    void eliminarProducto(Long id);

    List<ProductoResponse> obtenerProductosConAlertaStock();
}
