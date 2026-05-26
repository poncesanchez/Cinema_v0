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
| `VITE_API_URL` | URL pública de la API para el build del frontend | `http://<IP-QA>:8082` | `https://api.tudominio.cl` |
| `VITE_BUILD_MODE` | Modo Vite (`qa` o `production`) | `qa` | `production` |

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

En cada deploy el workflow copia por SCP:

- `docker-compose.prod.yml`
- `db/init.sql`

y luego ejecuta `docker compose -f docker-compose.prod.yml pull && up -d` con imágenes desde ECR.

**Nota:** `init.sql` solo se ejecuta la primera vez que se crea el volumen `postgres_data`. Si Postgres falló antes por falta del archivo, en la EC2 ejecuta una vez:

```bash
cd ~/cinebook
docker compose -f docker-compose.prod.yml down
docker volume rm cinebook_postgres_data
```

Luego vuelve a lanzar el workflow.

## Repositorios ECR

- `cinebook-peliculas-service`
- `cinebook-frontend`
