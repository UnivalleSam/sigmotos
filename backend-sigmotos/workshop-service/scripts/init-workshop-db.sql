-- =============================================================================
-- SIGMOTOS — Base de datos del microservicio workshop-service
-- Ejecutar en pgAdmin: clic derecho en el servidor → Query Tool → pegar y ejecutar
-- =============================================================================

-- Crear la base (si ya existe, puedes ignorar el error)
CREATE DATABASE workshop_db
    WITH OWNER = postgres
    ENCODING = 'UTF8';

-- Verificar (debe aparecer workshop_db en los resultados)
SELECT datname FROM pg_database WHERE datname = 'workshop_db';
