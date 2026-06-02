package com.sigmotos.inventoryservice.controller;

import com.sigmotos.inventoryservice.entity.Producto;
import com.sigmotos.inventoryservice.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @PostMapping
    public ResponseEntity<Producto> crearProducto(
            @RequestBody Producto producto) {

        Producto guardado = productoRepository.save(producto);

        return ResponseEntity.ok(guardado);
    }

    @GetMapping
    public ResponseEntity<?> listarProductos() {
        return ResponseEntity.ok(productoRepository.findAll());
    }
}