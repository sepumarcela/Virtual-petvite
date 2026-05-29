package com.virtualpet.backend.repository;

import com.virtualpet.backend.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByActivoTrue();

    List<Producto> findByCategoriaIgnoreCaseAndActivoTrue(String categoria);

    Page<Producto> findAll(Pageable pageable);

    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.activo = true AND p.categoria IS NOT NULL")
    List<String> findCategorias();

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(:categoria IS NULL OR LOWER(p.categoria) = LOWER(:categoria))")
    List<Producto> findByFiltros(@Param("categoria") String categoria);
}
