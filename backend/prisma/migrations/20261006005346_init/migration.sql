-- CreateEnum
CREATE TYPE "NivelRiesgo" AS ENUM ('VERDE', 'AMARILLO', 'ROJO');

-- CreateEnum
CREATE TYPE "EstadoAlerta" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'FALSA_ALARMA');

-- CreateEnum
CREATE TYPE "MetodoActivacion" AS ENUM ('BOTON', 'VOZ');

-- CreateEnum
CREATE TYPE "MetodoNotificacion" AS ENUM ('SMS', 'EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'ENVIADO', 'FALLIDO');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "pais_codigo" CHAR(2) NOT NULL DEFAULT 'GT',
    "rol_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactos_emergencia" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "parentesco" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "email_notificacion" VARCHAR(150),
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autoridades" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "pais_codigo" CHAR(2) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autoridades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zonas_riesgo" (
    "id" SERIAL NOT NULL,
    "nombre_zona" VARCHAR(150) NOT NULL,
    "nivel_riesgo" "NivelRiesgo" NOT NULL DEFAULT 'AMARILLO',
    "geometria_polygon" JSONB NOT NULL,
    "descripcion_incidencia" TEXT,
    "registrado_por" INTEGER NOT NULL,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zonas_riesgo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutas_seguras" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "origen_lat" DECIMAL(10,8) NOT NULL,
    "origen_lng" DECIMAL(11,8) NOT NULL,
    "destino_lat" DECIMAL(10,8) NOT NULL,
    "destino_lng" DECIMAL(11,8) NOT NULL,
    "trayecto_geojson" JSONB,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rutas_seguras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas_sos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "token_publico" VARCHAR(36) NOT NULL,
    "latitud_inicial" DECIMAL(10,8) NOT NULL,
    "longitud_inicial" DECIMAL(11,8) NOT NULL,
    "pais_codigo" CHAR(2) NOT NULL,
    "metodo_activacion" "MetodoActivacion" NOT NULL DEFAULT 'BOTON',
    "estado" "EstadoAlerta" NOT NULL DEFAULT 'PENDIENTE',
    "atendida_por" INTEGER,
    "notas_resolucion" TEXT,
    "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resuelta_en" TIMESTAMPTZ,

    CONSTRAINT "alertas_sos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimiento_gps_vivo" (
    "id" BIGSERIAL NOT NULL,
    "alerta_id" INTEGER NOT NULL,
    "latitud" DECIMAL(10,8) NOT NULL,
    "longitud" DECIMAL(11,8) NOT NULL,
    "velocidad_kmh" DECIMAL(5,2) DEFAULT 0.00,
    "registrado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguimiento_gps_vivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones_enviadas" (
    "id" SERIAL NOT NULL,
    "alerta_id" INTEGER NOT NULL,
    "autoridad_id" INTEGER,
    "contacto_id" INTEGER,
    "metodo" "MetodoNotificacion" NOT NULL DEFAULT 'EMAIL',
    "estado_envio" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_envio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_enviadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_rol_key" ON "roles"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "contactos_emergencia_usuario_id_idx" ON "contactos_emergencia"("usuario_id");

-- CreateIndex
CREATE INDEX "autoridades_pais_codigo_idx" ON "autoridades"("pais_codigo");

-- CreateIndex
CREATE INDEX "zonas_riesgo_nivel_riesgo_idx" ON "zonas_riesgo"("nivel_riesgo");

-- CreateIndex
CREATE INDEX "rutas_seguras_usuario_id_idx" ON "rutas_seguras"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "alertas_sos_token_publico_key" ON "alertas_sos"("token_publico");

-- CreateIndex
CREATE INDEX "alertas_sos_usuario_id_idx" ON "alertas_sos"("usuario_id");

-- CreateIndex
CREATE INDEX "alertas_sos_estado_creado_en_idx" ON "alertas_sos"("estado", "creado_en" DESC);

-- CreateIndex
CREATE INDEX "seguimiento_gps_vivo_alerta_id_registrado_en_idx" ON "seguimiento_gps_vivo"("alerta_id", "registrado_en" DESC);

-- CreateIndex
CREATE INDEX "notificaciones_enviadas_alerta_id_idx" ON "notificaciones_enviadas"("alerta_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zonas_riesgo" ADD CONSTRAINT "zonas_riesgo_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas_seguras" ADD CONSTRAINT "rutas_seguras_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_sos" ADD CONSTRAINT "alertas_sos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_sos" ADD CONSTRAINT "alertas_sos_atendida_por_fkey" FOREIGN KEY ("atendida_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimiento_gps_vivo" ADD CONSTRAINT "seguimiento_gps_vivo_alerta_id_fkey" FOREIGN KEY ("alerta_id") REFERENCES "alertas_sos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones_enviadas" ADD CONSTRAINT "notificaciones_enviadas_alerta_id_fkey" FOREIGN KEY ("alerta_id") REFERENCES "alertas_sos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones_enviadas" ADD CONSTRAINT "notificaciones_enviadas_autoridad_id_fkey" FOREIGN KEY ("autoridad_id") REFERENCES "autoridades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones_enviadas" ADD CONSTRAINT "notificaciones_enviadas_contacto_id_fkey" FOREIGN KEY ("contacto_id") REFERENCES "contactos_emergencia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
