# Caso Práctico — Plataforma Distribuida de Gestión de Reservas de Cine

> **Nota (iteración v0):** Este repositorio está simplificado a dos componentes: `frontend` y `peliculas-service`. El documento completo describe el alcance final del caso; la implementación actual cubre solo la gestión de películas. Ver `README.md` para ejecutar el proyecto.


## 1. Introducción

La empresa CineBook desea modernizar su plataforma tecnológica migrando desde una arquitectura monolítica a una arquitectura distribuida basada en microservicios desplegados en la nube.

La nueva plataforma deberá permitir:

* Consultar películas disponibles.
* Consultar funciones y horarios.
* Gestionar reservas de entradas.
* Administrar salas y asientos.
* Gestionar usuarios.
* Escalar dinámicamente según demanda.
* Automatizar despliegues mediante CI/CD.

La solución deberá utilizar contenedores Docker, Docker Swarm y servicios cloud desplegados sobre AWS.

---

# 2. Objetivos de aprendizaje

El proyecto busca que los estudiantes desarrollen competencias relacionadas con:

* Diseño de arquitecturas distribuidas.
* Construcción de microservicios con Spring Boot.
* Dockerización de aplicaciones.
* Orquestación con Docker Swarm.
* Integración continua y despliegue continuo (CI/CD).
* Despliegue en AWS.
* Escalabilidad de servicios.
* Comunicación entre microservicios.
* Buenas prácticas de DevOps.

---

# 3. Arquitectura General

```text
                        ┌────────────────────┐
                        │ Frontend React     │
                        └─────────┬──────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ gateway-service    │
                        └─────────┬──────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│ usuarios       │      │ peliculas      │      │ funciones      │
│ service        │      │ service        │      │ service        │
└────────────────┘      └────────────────┘      └────────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ reservas-service   │
                        └─────────┬──────────┘
                                  │
                                  ▼
                        ┌────────────────────┐
                        │ PostgreSQL         │
                        └────────────────────┘
```

---

# 4. Tecnologías Propuestas

| Componente               | Tecnología           |
| ------------------------ | -------------------- |
| Backend                  | Spring Boot 3        |
| Lenguaje                 | Java 21              |
| Base de datos            | PostgreSQL           |
| Frontend                 | React                |
| Contenedores             | Docker               |
| Orquestación             | Docker Swarm         |
| CI/CD                    | GitHub Actions       |
| Cloud                    | AWS                  |
| Registro imágenes        | AWS ECR              |
| Infraestructura          | AWS EC2              |
| Gateway                  | Spring Cloud Gateway |
| Descubrimiento servicios | Eureka Server        |

---

# 5. Microservicios del Sistema

## 5.1 gateway-service

### Responsabilidad

Centralizar el acceso a los microservicios.

### Funcionalidades

* Redireccionar peticiones.
* Balancear carga.
* Gestionar rutas.
* Centralizar acceso.

### Tecnologías

* Spring Cloud Gateway
* Eureka Client

### Puerto sugerido

```text
8080
```

---

## 5.2 eureka-server

### Responsabilidad

Registrar y descubrir microservicios.

### Funcionalidades

* Registro automático de servicios.
* Descubrimiento dinámico.
* Gestión de disponibilidad.

### Tecnologías

* Spring Cloud Netflix Eureka Server

### Puerto sugerido

```text
8761
```

---

## 5.3 usuarios-service

### Responsabilidad

Administrar usuarios de la plataforma.

### Funcionalidades

* Registrar usuarios.
* Buscar usuarios.
* Actualizar usuarios.
* Eliminar usuarios.
* Iniciar sesión.

### Datos sugeridos

| Campo         | Tipo          |
| ------------- | ------------- |
| id            | UUID          |
| nombre        | String        |
| apellido      | String        |
| correo        | String        |
| contraseña    | String        |
| rol           | String        |
| fechaRegistro | LocalDateTime |

### Endpoints sugeridos

```http
GET /usuarios
GET /usuarios/{id}
POST /usuarios
PUT /usuarios/{id}
DELETE /usuarios/{id}
```

### Base de datos

Tabla:

```text
usuarios
```

---

## 5.4 peliculas-service

### Responsabilidad

Gestionar películas disponibles.

### Funcionalidades

* Listar películas.
* Buscar película.
* Crear películas.
* Actualizar películas.
* Eliminar películas.

### Datos sugeridos

| Campo         | Tipo      |
| ------------- | --------- |
| id            | UUID      |
| titulo        | String    |
| descripcion   | String    |
| duracion      | Integer   |
| genero        | String    |
| clasificacion | String    |
| imagenUrl     | String    |
| fechaEstreno  | LocalDate |

### Endpoints sugeridos

```http
GET /peliculas
GET /peliculas/{id}
POST /peliculas
PUT /peliculas/{id}
DELETE /peliculas/{id}
```

### Base de datos

Tabla:

```text
peliculas
```

---

## 5.5 funciones-service

### Responsabilidad

Gestionar funciones y horarios.

### Funcionalidades

* Crear funciones.
* Consultar horarios.
* Consultar disponibilidad.
* Gestionar salas.

### Datos sugeridos

| Campo       | Tipo      |
| ----------- | --------- |
| id          | UUID      |
| peliculaId  | UUID      |
| sala        | String    |
| fecha       | LocalDate |
| hora        | LocalTime |
| capacidad   | Integer   |
| disponibles | Integer   |
| precio      | Double    |

### Endpoints sugeridos

```http
GET /funciones
GET /funciones/{id}
POST /funciones
PUT /funciones/{id}
DELETE /funciones/{id}
```

### Base de datos

Tabla:

```text
funciones
```

---

## 5.6 reservas-service

### Responsabilidad

Gestionar reservas de entradas.

### Funcionalidades

* Crear reservas.
* Cancelar reservas.
* Consultar reservas.
* Validar disponibilidad.

### Datos sugeridos

| Campo            | Tipo          |
| ---------------- | ------------- |
| id               | UUID          |
| usuarioId        | UUID          |
| funcionId        | UUID          |
| cantidadEntradas | Integer       |
| total            | Double        |
| fechaReserva     | LocalDateTime |
| estado           | String        |

### Endpoints sugeridos

```http
GET /reservas
GET /reservas/{id}
POST /reservas
DELETE /reservas/{id}
```

### Base de datos

Tabla:

```text
reservas
```

---

# 6. Frontend

## Tecnología sugerida

* React
* Vite
* Axios
* React Router
* Material UI

---

## Funcionalidades mínimas

### Página Inicio

* Mostrar películas.
* Mostrar cartelera.

---

### Página Película

* Información detallada.
* Horarios disponibles.

---

### Página Reservas

* Seleccionar función.
* Reservar entradas.

---

### Página Administración

* CRUD películas.
* CRUD funciones.

---

# 7. Arquitectura de Base de Datos

## Alternativa 1 — Base compartida

Adecuado para aprendizaje inicial.

```text
PostgreSQL
 ├── usuarios
 ├── peliculas
 ├── funciones
 └── reservas
```

---

## Alternativa 2 — Base por microservicio

Más cercana a arquitectura real.

```text
usuarios-db
peliculas-db
funciones-db
reservas-db
```

---

# 8. Dockerización

Cada microservicio deberá contener:

```text
Dockerfile
```

Ejemplo sugerido:

```dockerfile
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# 9. Docker Compose

El sistema deberá contar con un archivo:

```text
docker-compose.yml
```

capaz de levantar todos los servicios.

Ejemplo general:

```yaml
version: '3.9'

services:

  eureka:
    image: eureka-server:latest
    ports:
      - "8761:8761"

  gateway:
    image: gateway-service:latest
    ports:
      - "8080:8080"

  usuarios:
    image: usuarios-service:latest

  peliculas:
    image: peliculas-service:latest

  funciones:
    image: funciones-service:latest

  reservas:
    image: reservas-service:latest

  postgres:
    image: postgres:16
```

---

# 10. Docker Swarm

## Objetivo

Desplegar servicios distribuidos utilizando Docker Swarm.

---

## Inicialización

```bash
docker swarm init
```

---

## Agregar worker

```bash
docker swarm join --token TOKEN IP_MANAGER:2377
```

---

## Despliegue stack

```bash
docker stack deploy -c docker-compose.yml cinebook
```

---

## Ver servicios

```bash
docker service ls
```

---

# 11. Escalabilidad

Los estudiantes deberán demostrar escalabilidad dinámica.

Ejemplo:

```bash
docker service scale cinebook_reservas=3
```

---

# 12. CI/CD

## Objetivo

Automatizar:

* Build
* Test
* Docker Build
* Push imágenes
* Deploy cloud

---

## GitHub Actions

Archivo:

```text
.github/workflows/deploy.yml
```

---

## Flujo esperado

```text
Commit
   ↓
GitHub Actions
   ↓
Build Maven
   ↓
Tests
   ↓
Docker Build
   ↓
Push AWS ECR
   ↓
Deploy EC2
```

---

# 13. Infraestructura AWS

## Arquitectura mínima

```text
AWS
│
├── EC2 QA
├── EC2 PROD
├── AWS ECR
└── Security Groups
```

---

# 14. Ambientes

El sistema deberá manejar al menos:

```text
QA
PROD
```

---

## Rama QA

```text
develop
```

---

## Rama PROD

```text
main
```

---

## Variables de entorno

Ejemplo:

```env
SPRING_PROFILES_ACTIVE=qa
```

```env
SPRING_PROFILES_ACTIVE=prod
```

---

# 15. Variables de Entorno

Ejemplo:

```env
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=
```

---

# 16. Requisitos Técnicos del Proyecto

## Obligatorios

* Microservicios funcionales.
* Dockerfiles funcionales.
* Docker Compose funcional.
* Docker Swarm funcional.
* CI/CD funcional.
* Despliegue AWS funcional.
* Escalabilidad demostrable.
* README documentado.

---

# 17. Estructura Sugerida Repositorios

```text
cinebook/
│
├── gateway-service/
├── eureka-server/
├── usuarios-service/
├── peliculas-service/
├── funciones-service/
├── reservas-service/
├── frontend/
└── docker-compose.yml
```

---

# 18. README Recomendado

Cada repositorio debería incluir:

* Descripción.
* Tecnologías.
* Variables entorno.
* Cómo ejecutar.
* Docker Build.
* Docker Compose.
* Docker Swarm.
* Endpoints.
* Arquitectura.

---

# 20. Escenarios de Escalabilidad (NO EJECUTAR ESTE PASO AUN)

## Escenario 1

Alta demanda de reservas.

Escalar:

```text
reservas-service
```

---

## Escenario 2

Alta consulta de películas.

Escalar:

```text
peliculas-service
```

---

# 21. Posible Evolución Futura (NO EJECUTAR ESTE PASO AUN)

## Próximas iteraciones

El sistema podrá evolucionar incorporando:

* AWS SQS.
* AWS Lambda.
* API Gateway.
* Notificaciones asíncronas.
* Observabilidad.
* Kubernetes.
* ECS.
* Terraform.

---

# 22. Buenas Prácticas Esperadas

## Docker

* Imágenes livianas.
* Multi-stage builds.
* Variables entorno.
* No hardcodear credenciales.

---

## Backend

* Arquitectura por capas.
* DTOs.
* Validaciones.
* Manejo excepciones.
* Respuestas HTTP correctas.

---

# 23. Conclusión

Este proyecto busca simular un escenario real de despliegue de microservicios en la nube utilizando tecnologías ampliamente utilizadas en la industria.

La solución debe demostrar:

* Arquitectura distribuida.
* Contenerización.
* Orquestación.
* Escalabilidad.
* Automatización.
* Integración continua.
* Despliegue continuo.
* Buenas prácticas DevOps.
