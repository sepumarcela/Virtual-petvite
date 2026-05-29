package com.virtualpet.backend.controller;

import com.virtualpet.backend.entity.Producto;
import com.virtualpet.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Importación masiva (requiere ROLE_ADMIN):
 *   POST /api/admin/importar/productos  → Excel (.xlsx)
 *   POST /api/admin/importar/imagenes   → imágenes de productos
 */
@RestController
@RequestMapping("/api/admin/importar")
@RequiredArgsConstructor
@Slf4j
public class AdminImportarController {

    private final ProductoRepository productoRepository;

    @Value("${app.upload.dir:uploads/productos}")
    private String uploadDir;

    // ── Importar Excel ────────────────────────────────────────
    @PostMapping("/productos")
    public ResponseEntity<?> importarExcel(@RequestParam("archivo") MultipartFile file) throws IOException {

        List<Producto> importados = new ArrayList<>();

        try (Workbook wb = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            Row header = sheet.getRow(0);

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Producto p = Producto.builder()
                        .referencia(cellStr(row, 0))
                        .nombre(cellStr(row, 1))
                        .marca(cellStr(row, 2))
                        .categoria(cellStr(row, 3))
                        .descripcion(cellStr(row, 4))
                        .precio(cellDouble(row, 5))
                        .stock(cellInt(row, 6))
                        .especie(cellStr(row, 7))
                        .presentaciones(cellStr(row, 8))
                        .activo(true)
                        .disponibilidad("DISPONIBLE")
                        .build();

                importados.add(productoRepository.save(p));
            }
        }

        return ResponseEntity.ok(Map.of(
                "importados", importados.size(),
                "mensaje", "Importación completada"
        ));
    }

    // ── Subir imágenes ────────────────────────────────────────
    @PostMapping("/imagenes")
    public ResponseEntity<?> importarImagenes(
            @RequestParam("archivos") List<MultipartFile> archivos) throws IOException {

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);

        List<String> guardados = new ArrayList<>();
        for (MultipartFile f : archivos) {
            String filename = f.getOriginalFilename();
            if (filename == null) continue;
            Path dest = dir.resolve(filename);
            Files.copy(f.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            guardados.add(filename);
            log.info("Imagen guardada: {}", dest);
        }

        return ResponseEntity.ok(Map.of(
                "guardados", guardados.size(),
                "archivos", guardados
        ));
    }

    // ── Helpers ───────────────────────────────────────────────
    private String cellStr(Row row, int col) {
        Cell c = row.getCell(col);
        if (c == null) return null;
        return switch (c.getCellType()) {
            case STRING  -> c.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) c.getNumericCellValue());
            default      -> null;
        };
    }

    private Double cellDouble(Row row, int col) {
        Cell c = row.getCell(col);
        if (c == null || c.getCellType() != CellType.NUMERIC) return null;
        return c.getNumericCellValue();
    }

    private Integer cellInt(Row row, int col) {
        Double d = cellDouble(row, col);
        return d != null ? d.intValue() : null;
    }
}
