-- =========================================================
-- SafeRoute - Esquema PostgreSQL v2
-- =========================================================
DROP TABLE IF EXISTS notificaciones_enviadas CASCADE;
DROP TABLE IF EXISTS seguimiento_gps_vivo   CASCADE;
DROP TABLE IF EXISTS alertas_sos            CASCADE;
DROP TABLE IF EXISTS rutas_seguras          CASCADE;
DROP TABLE IF EXISTS zonas_riesgo           CASCADE;
DROP TABLE IF EXISTS autoridades            CASCADE;
DROP TABLE IF EXISTS contactos_emergencia   CASCADE;
DROP TABLE IF EXISTS usuarios               CASCADE;
DROP TABLE IF EXISTS roles                  CASCADE;

DROP TYPE IF EXISTS nivel_riesgo_enum;
DROP TYPE IF EXISTS estado_alerta_enum;
DROP TYPE IF EXISTS metodo_activacion_enum;
DROP TYPE IF EXISTS metodo_notificacion_enum;
DROP TYPE IF EXISTS estado_envio_enum;

CREATE TYPE nivel_riesgo_enum        AS ENUM ('VERDE','AMARILLO','ROJO');
CREATE TYPE estado_alerta_enum       AS ENUM ('PENDIENTE','EN_PROCESO','RESUELTO','FALSA_ALARMA');
CREATE TYPE metodo_activacion_enum   AS ENUM ('BOTON','VOZ');
CREATE TYPE metodo_notificacion_enum AS ENUM ('SMS','EMAIL','PUSH');
CREATE TYPE estado_envio_enum        AS ENUM ('PENDIENTE','ENVIADO','FALLIDO');

-- ROLES (ADMIN, USUARIO, OPERADOR)
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    nombre_rol  VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- USUARIOS
CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    telefono        VARCHAR(20)  NOT NULL,
    pais_codigo     CHAR(2)      NOT NULL DEFAULT 'GT',
    rol_id          INT          NOT NULL,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- ENTIDAD 1: CONTACTOS DE EMERGENCIA (padres / tutores)
CREATE TABLE contactos_emergencia (
    id                 SERIAL PRIMARY KEY,
    usuario_id         INT          NOT NULL,
    nombre             VARCHAR(150) NOT NULL,
    parentesco         VARCHAR(50)  NOT NULL,
    telefono           VARCHAR(20)  NOT NULL,
    email_notificacion VARCHAR(150),
    creado_en          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contacto_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ENTIDAD 2: AUTORIDADES (por país)
CREATE TABLE autoridades (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,       -- ej: PNC Guatemala
    pais_codigo CHAR(2)      NOT NULL,
    email       VARCHAR(150) NOT NULL,
    telefono    VARCHAR(20),
    activa      BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ENTIDAD 3: ZONAS DE RIESGO
CREATE TABLE zonas_riesgo (
    id                     SERIAL PRIMARY KEY,
    nombre_zona            VARCHAR(150) NOT NULL,
    nivel_riesgo           nivel_riesgo_enum NOT NULL DEFAULT 'AMARILLO',
    geometria_polygon      JSONB NOT NULL,   -- GeoJSON Polygon
    descripcion_incidencia TEXT,
    registrado_por         INT NOT NULL,
    creado_en              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_zona_usuario FOREIGN KEY (registrado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- ENTIDAD 4: RUTAS SEGURAS (configuradas por el usuario)
CREATE TABLE rutas_seguras (
    id               SERIAL PRIMARY KEY,
    usuario_id       INT NOT NULL,
    nombre           VARCHAR(100) NOT NULL,   -- ej: Casa -> Universidad
    origen_lat       NUMERIC(10,8) NOT NULL,
    origen_lng       NUMERIC(11,8) NOT NULL,
    destino_lat      NUMERIC(10,8) NOT NULL,
    destino_lng      NUMERIC(11,8) NOT NULL,
    trayecto_geojson JSONB,                   -- LineString opcional
    activa           BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ruta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT chk_ruta_coords CHECK (
        origen_lat  BETWEEN -90 AND 90 AND destino_lat BETWEEN -90 AND 90 AND
        origen_lng  BETWEEN -180 AND 180 AND destino_lng BETWEEN -180 AND 180)
);

-- ENTIDAD 5: ALERTAS SOS (proceso principal)
CREATE TABLE alertas_sos (
    id                SERIAL PRIMARY KEY,
    usuario_id        INT NOT NULL,
	token_publivo     TEXT,
    latitud_inicial   NUMERIC(10,8) NOT NULL,
    longitud_inicial  NUMERIC(11,8) NOT NULL,
    pais_codigo       CHAR(2) NOT NULL,
    metodo_activacion metodo_activacion_enum NOT NULL DEFAULT 'BOTON',
    estado            estado_alerta_enum NOT NULL DEFAULT 'PENDIENTE',
    atendida_por      INT,                    -- operador que la gestiona
    notas_resolucion  TEXT,
    creado_en         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resuelta_en       TIMESTAMPTZ,
    CONSTRAINT fk_alerta_usuario  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_alerta_operador FOREIGN KEY (atendida_por) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_alerta_coords CHECK (
        latitud_inicial BETWEEN -90 AND 90 AND longitud_inicial BETWEEN -180 AND 180)
);

-- SEGUIMIENTO GPS EN VIVO
CREATE TABLE seguimiento_gps_vivo (
    id            BIGSERIAL PRIMARY KEY,
    alerta_id     INT NOT NULL,
    latitud       NUMERIC(10,8) NOT NULL,
    longitud      NUMERIC(11,8) NOT NULL,
    velocidad_kmh NUMERIC(5,2) DEFAULT 0.00,
    registrado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_seguimiento_alerta FOREIGN KEY (alerta_id) REFERENCES alertas_sos(id) ON DELETE CASCADE,
    CONSTRAINT chk_gps_coords CHECK (latitud BETWEEN -90 AND 90 AND longitud BETWEEN -180 AND 180)
);

-- NOTIFICACIONES (autoridad O contacto)
CREATE TABLE notificaciones_enviadas (
    id           SERIAL PRIMARY KEY,
    alerta_id    INT NOT NULL,
    autoridad_id INT,
    contacto_id  INT,
    metodo       metodo_notificacion_enum NOT NULL DEFAULT 'EMAIL',
    estado_envio estado_envio_enum NOT NULL DEFAULT 'PENDIENTE',
    fecha_envio  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_alerta    FOREIGN KEY (alerta_id)    REFERENCES alertas_sos(id)          ON DELETE CASCADE,
    CONSTRAINT fk_notif_autoridad FOREIGN KEY (autoridad_id) REFERENCES autoridades(id)          ON DELETE SET NULL,
    CONSTRAINT fk_notif_contacto  FOREIGN KEY (contacto_id)  REFERENCES contactos_emergencia(id) ON DELETE SET NULL,
    CONSTRAINT chk_un_destinatario CHECK (
        (autoridad_id IS NOT NULL AND contacto_id IS NULL) OR
        (autoridad_id IS NULL AND contacto_id IS NOT NULL))
);


CREATE INDEX idx_contactos_usuario    ON contactos_emergencia(usuario_id);
CREATE INDEX idx_rutas_usuario        ON rutas_seguras(usuario_id);
CREATE INDEX idx_zonas_nivel          ON zonas_riesgo(nivel_riesgo);
CREATE INDEX idx_autoridades_pais     ON autoridades(pais_codigo) WHERE activa;
CREATE INDEX idx_alertas_usuario      ON alertas_sos(usuario_id);
CREATE INDEX idx_alertas_estado_fecha ON alertas_sos(estado, creado_en DESC);
CREATE INDEX idx_gps_alerta_tiempo    ON seguimiento_gps_vivo(alerta_id, registrado_en DESC);
CREATE INDEX idx_notif_alerta         ON notificaciones_enviadas(alerta_id);