package com.sigmotos.inventoryservice.controller;

import com.sigmotos.inventoryservice.dto.ProductoRequest;
import com.sigmotos.inventoryservice.dto.ProductoResponse;
import com.sigmotos.inventoryservice.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    // POST /api/productos — Crear un repuesto
    @PostMapping
    public ResponseEntity<ProductoResponse> crearProducto(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse guardado = productoService.crearProducto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    // GET /api/productos — Listar todos los repuestos activos
    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listarProductos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }

    // GET /api/productos/{id} — Obtener detalle de un repuesto
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    // PUT /api/productos/{id} — Actualizar los datos de un repuesto
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    // DELETE /api/productos/{id} — Eliminar (desactivar) lógicamente un repuesto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/productos/alertas — Listar repuestos con stock bajo
    @GetMapping("/alertas")
    public ResponseEntity<List<ProductoResponse>> obtenerProductosConAlertaStock() {
        return ResponseEntity.ok(productoService.obtenerProductosConAlertaStock());
    }
}