# Configuración de despliegue (GitHub Environments)

El workflow selecciona el entorno según la rama:

| Rama / PR hacia | Entorno GitHub |
|-----------------|----------------|
| `develop` | `qa` |
| `main` | `prod` |

## Variables por entorno (`vars`)

| Variable | Descripción | Ejemplo QA | Ejemplo PROD |
|----------|-------------|------------|--------------|
| `SPRING_PROFILES_ACTIVE` | Perfil Spring (sin `docker`; Compose lo añade) | `qa` | `prod` |
| `VITE_API_URL` | URL **completa** del API (con `http://` y puerto `:8082`) | `http://98.92.219.201:8082` | `https://api.tudominio.cl` |
| `VITE_BUILD_MODE` | Modo Vite (`qa` o `production`) | `qa` | `production` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos por el backend (mismo host del frontend) | `http://<IP-QA>` | `https://tudominio.cl` |

## Secrets por entorno (`secrets`)

Opcionales si la BD en EC2 usa las mismas credenciales que `docker-compose`; obligatorios si usas RDS u otra instancia:

| Secret | Descripción |
|--------|-------------|
| `SPRING_DATASOURCE_URL` | JDBC URL de PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | Usuario BD |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña BD |

## Secrets del repositorio (globales)

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Credencial AWS |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS |
| `AWS_REGION` | Región AWS (opcional; por defecto `us-east-1`) |
| `EC2_QA_HOST` | Host SSH servidor QA |
| `EC2_PROD_HOST` | Host SSH servidor PROD |
| `EC2_USER` | Usuario SSH (ej. `ec2-user`) |
| `EC2_SSH_KEY` | Clave privada SSH |

## Servidor EC2

Requisitos:

1. Usuario SSH (`EC2_USER`) con carpeta de deploy: `/home/<EC2_USER>/cinebook` (el workflow la crea).
2. **AWS CLI** y rol IAM con permisos ECR pull sobre `cinebook-peliculas-service` y `cinebook-frontend`.
3. Docker y Docker Compose v2.

En cada deploy el workflow copia por SCP `docker-compose.prod.yml` y luego ejecuta `docker compose -f docker-compose.prod.yml pull && up -d` con imágenes desde ECR.

**Perfiles Spring en EC2:** Compose usa `qa,docker` o `prod,docker` (el perfil `docker` va **al final**). Así `ddl-auto: update` del perfil docker crea la tabla `peliculas` aunque `prod` use `validate`. Las películas de demostración se insertan automáticamente al arrancar el backend si la tabla está vacía.

## Repositorios ECR

- `cinebook-peliculas-service`
- `cinebook-frontend`

## Acceso desde el navegador

| Servicio | URL | Puerto en Security Group |
|----------|-----|--------------------------|
| Frontend | `http://<IP-EC2>` | **80** (TCP inbound) |
| API | `http://<IP-EC2>:8082` | **8082** |

El frontend en producción se publica en el puerto **80** del host (`FRONTEND_PORT` por defecto). Si entras solo a `http://IP` sin puerto, es el puerto correcto.

### Si la página no carga

1. **Security Group** de la EC2: reglas de entrada para TCP 80 y 8082 desde `0.0.0.0/0` (o tu IP).
2. En la EC2: `docker ps` y `curl -I http://localhost` (debe responder 200).
3. **`VITE_API_URL`**: usa la forma completa `http://<IP>:8082`. **No** uses solo la IP (`98.92.219.201`): el frontend generaría URLs erróneas como `http://<IP>:3000/98.92.219.201/peliculas`. Tras cambiarla, **redeploy** (rebuild de la imagen frontend).
4. **`CORS_ALLOWED_ORIGINS`**: debe incluir el origen del frontend (`http://<IP>` sin puerto si usas el 80).

### Si la página carga pero no hay películas

Abre las herramientas de desarrollo (F12) → pestaña Red. Si ves errores CORS o fallos a `localhost:8082`, revisa `VITE_API_URL` y `CORS_ALLOWED_ORIGINS` y redeploy.
