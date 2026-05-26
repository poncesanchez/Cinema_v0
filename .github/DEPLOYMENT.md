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
| `EC2_QA_HOST` | Host SSH servidor QA |
| `EC2_PROD_HOST` | Host SSH servidor PROD |
| `EC2_USER` | Usuario SSH |
| `EC2_SSH_KEY` | Clave privada SSH |

## Servidor EC2

En `/opt/cinebook` debe existir el `docker-compose.yml` del proyecto. El deploy exporta las variables del entorno GitHub antes de `docker compose up -d`.

Para desarrollo local se usan los archivos `.env` del repositorio (raíz y `frontend/`). En EC2/CI los valores los aportan los entornos GitHub `qa` y `prod`.
