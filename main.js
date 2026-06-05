import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

const DB_NAME = 'plataforma_web.db';

// 1. Limpieza previa del entorno (por si ejecutas el script varias veces)
if (fs.existsSync(DB_NAME)) {
    fs.unlinkSync(DB_NAME);
}

console.log(" Iniciando entorno de simulación de Sostenibilidad...");
const db = new DatabaseSync(DB_NAME);

// 2. Creación de la estructura de tablas
db.exec(`
    CREATE TABLE sesiones_usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INT NOT NULL,
        token TEXT NOT NULL,
        ip_conexion TEXT,
        fecha_inicio DATETIME NOT NULL,
        ultima_actividad DATETIME NOT NULL
    );

    CREATE TABLE logs_sistema (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nivel_log TEXT CHECK(nivel_log IN ('INFO', 'DEBUG', 'WARNING', 'ERROR')),
        componente TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
console.log(" Estructura de tablas creada con éxito.");

// 3. Inserción masiva de datos (Simulación de acumulación masiva y obsoleta)
db.exec(`
    -- Datos históricos obsoletos (Años 2022 y 2023)
    INSERT INTO sesiones_usuario (usuario_id, token, ip_conexion, fecha_inicio, ultima_actividad) VALUES
    (101, 'tok_8f9a2b', '192.168.1.45', '2022-03-15 08:30:00', '2022-03-15 09:15:00'),
    (102, 'tok_3c4d5e', '185.45.12.90', '2022-06-20 14:22:00', '2022-06-20 14:30:00'),
    (103, 'tok_1a2b3c', '84.120.43.21', '2023-01-10 11:05:00', '2023-01-10 13:45:00'),
    (104, 'tok_7e8f9a', '192.168.1.67', '2023-11-05 18:12:00', '2023-11-05 18:20:00');

    INSERT INTO logs_sistema (nivel_log, componente, mensaje, fecha_registro) VALUES
    ('DEBUG', 'AuthService', 'Intento de login para usuario 101 exitoso', '2022-03-15 08:30:01'),
    ('INFO', 'Router', 'Carga de vista /dashboard completada en 120ms', '2022-03-15 08:30:05'),
    ('DEBUG', 'Database', 'Ejecución de query: SELECT * FROM productos', '2022-06-20 14:23:11'),
    ('WARNING', 'PaymentGateway', 'Timeout de 2s detectado en pasarela externa, reintentando', '2023-01-10 11:07:44'),
    ('INFO', 'Mailer', 'Correo de bienvenida enviado a usuario 103', '2023-01-10 11:10:00'),
    ('DEBUG', 'Cache', 'Limpieza de caché en bloque de memoria sector_4', '2023-11-05 18:15:00');

    -- Datos recientes y activos (Año actual - 2026)
    INSERT INTO sesiones_usuario (usuario_id, token, ip_conexion, fecha_inicio, ultima_actividad) VALUES
    (501, 'tok_2026_act1', '92.150.33.12', '2026-05-25 09:00:00', '2026-05-28 11:30:00'),
    (502, 'tok_2026_act2', '192.168.1.102', '2026-05-27 22:15:00', '2026-05-28 11:45:00');

    INSERT INTO logs_sistema (nivel_log, componente, mensaje, fecha_registro) VALUES
    ('ERROR', 'BillingSystem', 'Error crítico: No se pudo procesar la suscripción mensual', '2026-05-28 08:15:33'),
    ('INFO', 'AuthService', 'Usuario 502 ha cambiado su contraseña', '2026-05-28 10:00:22');
`);
console.log(" Datos iniciales inyectados en el sistema.");

// Función auxiliar para leer el tamaño del archivo en disco de forma síncrona
const obtenerTamanoDB = () => fs.statSync(DB_NAME).size;

const tamanoInicial = obtenerTamanoDB();

// Cerramos la base de datos de manera limpia
db.close();