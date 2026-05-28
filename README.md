# LabCI-CD

Proyecto desarrollado para la instancia de evaluación de **Integración y Entrega Continua**.

El objetivo del trabajo es implementar un entorno básico de Integración Continua, utilizando un repositorio de código, un servidor CI, una build local, una prueba automatizada y un despliegue en un entorno de entrega.

---

## Descripción del proyecto

Este proyecto consiste en una API sencilla desarrollada con **Node.js** y **Express**.

La API expone un endpoint de verificación de estado:

```http
GET /health
```

Cuando la aplicación está funcionando correctamente, responde:

```json
{
  "status": "ok",
  "service": "products-expiration-api"
}
```

Este endpoint se utiliza para verificar que la aplicación está activa tanto en el entorno local como luego del despliegue en Docker.

---

## Stack tecnológico

| Componente | Herramienta |
|---|---|
| Control de versiones | Git + GitHub |
| Servidor de Integración Continua | Jenkins |
| Entorno de desarrollo y build local | Node.js + npm |
| Framework web | Express |
| Testing automatizado | Jest + Supertest |
| Entorno de entrega/despliegue | Docker |
| Inspección de calidad de código | SonarQube, pendiente de integración |
| Spec Driven Development | Pendiente de definición |

---

## Estructura del proyecto

```text
LabCI-CD/
│
├── src/
│   └── app.js
│
├── tests/
│   └── health.test.js
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── Jenkinsfile
├── package.json
├── package-lock.json
└── README.md
```

---

## Archivos principales

### `src/app.js`

Contiene el código fuente de la API.

Este archivo:

- Importa Express.
- Crea la aplicación.
- Define el puerto de ejecución.
- Configura el uso de JSON.
- Expone el endpoint `/health`.
- Levanta el servidor cuando se ejecuta directamente con `npm start`.
- Exporta la app para que pueda ser utilizada por los tests.

El endpoint principal del proyecto es:

```http
GET /health
```

---

### `tests/health.test.js`

Contiene la prueba automatizada del endpoint `/health`.

La prueba verifica que:

- La API responda con código HTTP `200`.
- El campo `status` sea `"ok"`.
- El campo `service` sea `"products-expiration-api"`.

Esta prueba se ejecuta con Jest y utiliza Supertest para simular una petición HTTP a la API.

---

### `package.json`

Define la configuración general del proyecto Node.js, sus dependencias y los scripts principales.

Scripts definidos:

```json
"scripts": {
  "start": "node src/app.js",
  "test": "jest",
  "build": "node --check src/app.js"
}
```

Significado de cada script:

| Script | Función |
|---|---|
| `npm start` | Ejecuta la API localmente |
| `npm test` | Ejecuta las pruebas automatizadas con Jest |
| `npm run build` | Ejecuta una verificación de sintaxis del archivo principal |

---

### `Dockerfile`

Define cómo construir la imagen Docker de la aplicación.

El Dockerfile indica:

- Qué imagen base se utiliza.
- En qué directorio interno trabaja el contenedor.
- Qué archivos se copian.
- Cómo se instalan las dependencias.
- Qué puerto se expone.
- Qué comando se ejecuta al iniciar el contenedor.

---

### `.dockerignore`

Indica qué archivos y carpetas no deben copiarse dentro de la imagen Docker.

Esto permite evitar que se copien archivos innecesarios, como:

- `node_modules`
- `coverage`
- `.git`
- archivos temporales

---

### `Jenkinsfile`

Define el pipeline de Integración Continua y Entrega Continua.

Jenkins lee este archivo desde el repositorio remoto y ejecuta las etapas configuradas.

---

## Requisitos para ejecutar localmente

Para ejecutar el proyecto en un entorno local se necesita tener instalado:

- Node.js
- npm
- Git

Para ejecutar el despliegue local en contenedor también se necesita:

- Docker Desktop

Para ejecutar el pipeline automatizado se necesita:

- Jenkins
- Git disponible para Jenkins
- Node.js y npm disponibles para Jenkins
- Docker disponible para Jenkins

---

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/JoaBrocal/LabCI-CD.git
cd LabCI-CD
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución local de la API

Para levantar la aplicación localmente:

```bash
npm start
```

La API queda disponible en:

```text
http://localhost:3000
```

Para verificar su funcionamiento:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "products-expiration-api"
}
```

También se puede verificar desde el navegador ingresando a:

```text
http://localhost:3000/health
```

---

## Build local

El proyecto incluye una build local mínima mediante el comando:

```bash
npm run build
```

Este comando ejecuta:

```bash
node --check src/app.js
```

Como se trata de una API simple en Node.js, no requiere una compilación tradicional como ocurriría en Java, C#, TypeScript o una aplicación frontend con Vite/React.

Por este motivo, la build local consiste en una verificación de sintaxis del archivo principal antes de ejecutar pruebas o desplegar.

En este proyecto:

```text
npm run build
```

representa la etapa de build local.

---

## Testing automatizado

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

El proyecto utiliza:

- **Jest** como framework de testing.
- **Supertest** para probar endpoints HTTP.

Actualmente se prueba el endpoint:

```http
GET /health
```

El test verifica que la API responda correctamente y devuelva el estado esperado.

---

## Docker

Docker se utiliza como entorno de entrega/despliegue local.

La idea es que la aplicación no dependa únicamente del entorno local del desarrollador, sino que pueda ejecutarse dentro de un contenedor con un entorno definido y reproducible.

---

## Construir la imagen Docker

Para construir la imagen Docker:

```bash
docker build -t lab-ci-api .
```

Explicación:

```text
docker build        Construye una imagen Docker.
-t lab-ci-api       Asigna el nombre lab-ci-api a la imagen.
.                   Indica que el contexto de construcción es la carpeta actual.
```

---

## Ejecutar el contenedor Docker

Para ejecutar la aplicación en un contenedor:

```bash
docker run -d --name lab-ci-api-container -p 3000:3000 lab-ci-api
```

Explicación del comando:

```text
docker run                    Ejecuta un contenedor.
-d                            Lo ejecuta en segundo plano.
--name lab-ci-api-container   Asigna un nombre al contenedor.
-p 3000:3000                  Conecta el puerto 3000 local con el puerto 3000 del contenedor.
lab-ci-api                    Imagen Docker que se utiliza para crear el contenedor.
```

Verificar que el contenedor está funcionando:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "products-expiration-api"
}
```

---

## Detener y eliminar el contenedor

Para detener y eliminar el contenedor:

```bash
docker rm -f lab-ci-api-container
```

---

## Diferencia entre entorno local y Docker

En el entorno local, la aplicación se ejecuta directamente sobre la computadora del desarrollador.

Ejemplo:

```bash
npm install
npm run build
npm test
npm start
```

En este caso, la máquina necesita tener instalado Node.js, npm y las dependencias necesarias.

En cambio, con Docker, la aplicación se ejecuta dentro de un contenedor.

Ejemplo:

```bash
docker build -t lab-ci-api .
docker run -d --name lab-ci-api-container -p 3000:3000 lab-ci-api
```

En este caso, la máquina solo necesita tener Docker instalado. El entorno de ejecución de la aplicación queda definido en el Dockerfile.

---

## Pipeline de Jenkins

El pipeline está definido en el archivo:

```text
Jenkinsfile
```

Las etapas configuradas son:

1. **Checkout**
   
   Jenkins obtiene el código fuente desde GitHub.

2. **Instalar dependencias**
   
   Ejecuta:

   ```bash
   npm install
   ```

3. **Build local**
   
   Ejecuta:

   ```bash
   npm run build
   ```

4. **Tests automatizados con Jest**
   
   Ejecuta:

   ```bash
   npm test
   ```

5. **Construir imagen Docker**
   
   Ejecuta:

   ```bash
   docker build -t lab-ci-api .
   ```

6. **Desplegar en Docker**
   
   Elimina un contenedor anterior si existe y levanta uno nuevo:

   ```bash
   docker rm -f lab-ci-api-container
   docker run -d --name lab-ci-api-container -p 3000:3000 lab-ci-api
   ```

7. **Verificar despliegue**
   
   Consulta el endpoint:

   ```bash
   curl http://localhost:3000/health
   ```

---

## Flujo del pipeline

El flujo automatizado es el siguiente:

```text
GitHub
   ↓
Jenkins
   ↓
Checkout del código
   ↓
npm install
   ↓
npm run build
   ↓
npm test
   ↓
docker build
   ↓
docker run
   ↓
GET /health
   ↓
Resultado del pipeline
```

---

## Trigger de build automatizada

El job de Jenkins está configurado con un build trigger.

Esto permite que la build no dependa únicamente de ejecutarse manualmente con `Build Now`, sino que pueda dispararse automáticamente cuando se detectan cambios en el repositorio remoto.

Flujo esperado:

```text
Commit local
   ↓
Push a GitHub
   ↓
Jenkins detecta cambios
   ↓
Ejecuta el pipeline
   ↓
Build local
   ↓
Testing automatizado
   ↓
Construcción de imagen Docker
   ↓
Despliegue local en contenedor
   ↓
Verificación de /health
```

---

## Flujo completo de trabajo

El flujo completo del proyecto es:

```text
Desarrollador
   ↓
Modifica código
   ↓
Ejecuta pruebas locales
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
GitHub
   ↓
Jenkins detecta cambios
   ↓
Ejecuta Jenkinsfile
   ↓
npm install
   ↓
npm run build
   ↓
npm test
   ↓
docker build
   ↓
docker run
   ↓
curl http://localhost:3000/health
   ↓
Feedback del pipeline
```

---

## Relación con la consigna

Este proyecto cubre los componentes principales solicitados:

| Punto de la consigna | Implementación en el proyecto |
|---|---|
| Repositorio de código | Git + GitHub |
| Servidor de Integración Continua | Jenkins |
| Entorno para desarrolladores | Node.js + npm |
| Build local | `npm run build` |
| Prueba automatizada | Jest + Supertest |
| Despliegue en entorno de entrega | Docker |
| Verificación del despliegue | Endpoint `/health` |
| Build automatizada | Trigger configurado en Jenkins |
| Herramienta adicional | Docker |
| Inspección de código | SonarQube pendiente de integración |
| Spec Driven Development | Pendiente de definición |

---

## Nota sobre Docker y Jenkins en Windows

En esta implementación local, Jenkins necesita poder comunicarse con Docker Desktop.

Durante la configuración se utilizó la variable:

```groovy
DOCKER_HOST = 'tcp://localhost:2375'
```

Esta configuración permite que Jenkins acceda al motor de Docker desde el pipeline.

Importante: esta configuración es válida para un entorno local de prueba o demostración. No se recomienda como configuración segura para un entorno productivo sin evaluar alternativas de seguridad.

---

## Comandos útiles

Ejecutar localmente:

```bash
npm start
```

Ejecutar build local:

```bash
npm run build
```

Ejecutar tests:

```bash
npm test
```

Construir imagen Docker:

```bash
docker build -t lab-ci-api .
```

Ejecutar contenedor:

```bash
docker run -d --name lab-ci-api-container -p 3000:3000 lab-ci-api
```

Verificar API:

```bash
curl http://localhost:3000/health
```

Eliminar contenedor:

```bash
docker rm -f lab-ci-api-container
```

---

## Estado actual del proyecto

El MVP del entorno CI/CD se encuentra funcional.

Actualmente el proyecto cuenta con:

- API básica en Node.js + Express.
- Endpoint `/health`.
- Test automatizado con Jest + Supertest.
- Build local mediante `npm run build`.
- Imagen Docker construible.
- Despliegue local mediante contenedor Docker.
- Pipeline automatizado con Jenkins.
- Trigger de build configurado.

Como mejora futura se contempla integrar SonarQube para inspección de calidad de código y definir capacidades de Spec Driven Development.

---

## Posibles mejoras futuras

Las siguientes mejoras quedan planteadas como evolución del proyecto:

- Integrar SonarQube al pipeline.
- Agregar reporte de cobertura de tests.
- Incorporar más endpoints a la API.
- Agregar más pruebas automatizadas.
- Definir una especificación OpenAPI.
- Incorporar Spec Driven Development.
- Automatizar el trigger mediante webhook de GitHub.
- Separar entornos de desarrollo, testing y entrega.