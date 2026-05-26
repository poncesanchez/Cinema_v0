# CineBook — Cartelera de Películas

Aplicación con dos componentes: un **frontend** React y un **backend** `peliculas-service` (Spring Boot), orquestados con Docker Compose.

## Tecnologías

| Componente | Tecnología |
|------------|------------|
| Backend | Spring Boot 3, Java 21, JPA |
| Base de datos | PostgreSQL 16 |
| Frontend | React, Vite, Material UI, Axios |
| Contenedores | Docker, Docker Compose |
| CI/CD | GitHub Actions, AWS ECR, EC2 |

## Arquitectura

```text
Frontend (React :3000)  →  peliculas-service (:8082)  →  PostgreSQL
```

### Componentes

| Componente | Puerto | Descripción |
|------------|--------|-------------|
| `peliculas-service` | 8082 | API REST de películas |
| `frontend` | 3000 | Interfaz web |
| `postgres` | 5432 | Base de datos |

## Perfiles y variables de entorno

### Backend (`peliculas-service`)

| Perfil | Archivo | Uso |
|--------|---------|-----|
| `qa` | `application-qa.yml` | Pruebas: SQL visible, `ddl-auto: update` |
| `prod` | `application-prod.yml` | Producción: `ddl-auto: validate`, menos logs |
| `docker` | `application-docker.yml` | Contenedor: host `postgres` en la red Compose |

En Docker Compose se activan **`docker` + `qa`** o **`docker` + `prod`** según `SPRING_PROFILES_ACTIVE` en `.env`.

### Frontend (Vite)

| Modo | Archivo | Comando |
|------|---------|---------|
| `development` | `frontend/.env.development` | `npm run dev` |
| `qa` | `frontend/.env.qa` | `npm run build:qa` |
| `production` | `frontend/.env.production` | `npm run build:prod` |

### Local (Docker Compose)

Usa el `.env` de la raíz (perfil **qa** por defecto):

```bash
docker compose up --build -d
```

Para probar perfil **prod** en local:

```bash
docker compose --env-file .env.prod up --build -d
```

### CI/CD (GitHub)

Variables y secrets por entorno **`qa`** y **`prod`**: ver [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md).

| Rama | Entorno GitHub | Perfil típico |
|------|----------------|---------------|
| `develop` | `qa` | `SPRING_PROFILES_ACTIVE=qa` |
| `main` | `prod` | `SPRING_PROFILES_ACTIVE=prod` |

## Cómo ejecutar

### Requisitos

- Java 21 y Maven 3.9+ (desarrollo backend local)
- Docker y Docker Compose
- Node.js 20+ (desarrollo frontend local)

### Con Docker Compose (recomendado)

```bash
docker compose down -v   # solo si quieres reiniciar la BD desde cero
docker compose up --build -d
```

Servicios disponibles:

- Frontend: http://localhost:3000
- API películas: http://localhost:8082/peliculas

### Desarrollo local (sin Docker)

1. Levantar PostgreSQL en el puerto 5432 con la base `cinebook` (opcional: ejecutar `db/init.sql`).
2. Backend:

```bash
cd peliculas-service
# Perfil qa (por defecto) o prod:
mvn spring-boot:run -Dspring-boot.run.profiles=qa
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

### Build Docker individual

Define `VITE_API_URL` en `.env` y ejecuta `.\scripts\build-all.ps1`, o:

```bash
docker build -t peliculas-service:latest ./peliculas-service
docker build --build-arg VITE_API_URL=$VITE_API_URL -t cinebook-frontend:latest ./frontend
```

O usa el script:

```powershell
.\scripts\build-all.ps1
```

## CI/CD (GitHub Actions)

El workflow `.github/workflows/deploy.yml` usa los entornos GitHub **`qa`** y **`prod`** (sin URLs ni perfiles en duro en el YAML).

1. Build y tests de `peliculas-service` (Maven)
2. Build del frontend con `vars.VITE_API_URL` y `vars.VITE_BUILD_MODE`
3. Build de imágenes Docker
4. Push a AWS ECR y deploy SSH a EC2 con variables del entorno

Configuración completa: [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md).

## Endpoints de la API

```http
GET    /peliculas
GET    /peliculas/{id}
POST   /peliculas
PUT    /peliculas/{id}
DELETE /peliculas/{id}
```

## Datos de demostración

Tras el primer arranque con `db/init.sql` se cargan dos películas de ejemplo (Dune: Parte Dos, Inside Out 2).

## Estructura del repositorio

```text
cinebook/
├── peliculas-service/   # Backend
├── frontend/            # UI React
├── db/init.sql
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── .github/DEPLOYMENT.md
```

## Licencia

Proyecto académico — Duoc UC / JVY0101.
