El proyecto SafeRoute Web es una aplicación cliente desarrollada en Angular para la gestión de emergencias, mapas de riesgo, alertas SOS, contactos de confianza y rutas seguras, conectada a una API en Node.js y Express mediante peticiones HTTP.

El enrutamiento principal definido en app.routes.ts maneja la navegación con carga perezosa mediante loadComponent e importaciones dinámicas import(). Las rutas públicas /login, /register y /emergencia/live/:token permiten el acceso libre, mientras que las vistas protegidas por authGuard incluyen /dashboard, /contactos, /rutas-seguras, /alertas y /perfil. 
Las secciones /monitoreo y /zonas-riesgo suman la protección adicional de roleGuard para restringir su uso a los roles OPERADOR o ADMIN. Cualquier dirección no reconocida es redirigida al login por la ruta comodín (). 
Para este módulo se utilizan las importaciones Routes desde @angular/router, junto a authGuard y roleGuard importados desde sus respectivas carpetas en core/guards.

El control de acceso y el estado de la sesión se gestionan entre auth.guard.ts y auth.service.ts. 
El guard consulta el estado de autenticación y redirige al inicio de sesión si el acceso no es válido, guardando la ruta de origen en la URL. El servicio maneja las peticiones con HttpClient, almacena el token y el objeto de usuario en LocalStorage y controla la reactividad mediante Signal. 
Para la renderización de cartografía y geolocalización en el frontend, la aplicación integra las librerías de OpenStreetMap importadas desde los paquetes leaflet y @asymmetrik/ngx-leaflet instalados en node_modules. L
a captura de datos de los formularios de Login y Registro se procesa con NgModel enviando la información estructurada en camelCase hacia la API. 
En este bloque se emplean las importaciones inject y signal desde @angular/core, Router y ActivatedRoute desde @angular/router, HttpClient desde @angular/common/http, FormsModule desde @angular/forms y CommonModule desde @angular/common.

En cuanto al backend, la solución se organiza en una arquitectura por capas dentro del servidor Express. 
La carpeta config maneja las variables globales y conexiones; controllers procesa la lógica de las solicitudes HTTP; routes define las rutas de los endpoints; middlewares aplica la validación de tokens JWT y verificación de roles; y models realiza las consultas a la base de datos SQL. 
El archivo .env.example funciona como una plantilla de referencia que enumera las variables de entorno requeridas, como puertos, credenciales de la base de datos y la clave secreta de JWT, sin exponer datos sensibles del entorno de producción.

Como resultado esperado, se busca que el usuario pueda registrarse, iniciar sesión y navegar de forma fluida por el panel principal, sus contactos, las rutas seguras y las alertas. Al mismo tiempo, los usuarios con permisos especiales de operador o administrador podrán acceder a los módulos de mapa de monitoreo interactivo y administración de zonas de riesgo.