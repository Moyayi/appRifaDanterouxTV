# PROYECTO: APLICACIÓN WEB DE RIFAS PREMIUM

## ANÁLISIS DE SKILLS

Antes de comenzar el desarrollo, analiza el repositorio oficial de Skills de Anthropic:

https://github.com/anthropics/skills

### Objetivo

Quiero que revises las skills disponibles y selecciones automáticamente aquellas que consideres más adecuadas para:

* Arquitectura de software
* Desarrollo frontend moderno
* UI/UX
* Diseño visual
* Accesibilidad
* Componentización
* Animaciones
* Refactorización
* Calidad de código
* Product Design

Explica qué skills has seleccionado y por qué.

Después utiliza esas skills durante todo el desarrollo del proyecto.

---

# MODO DE TRABAJO

Actúa simultáneamente como:

* Product Designer
* Senior Frontend Engineer
* Senior UI Designer
* Senior UX Designer
* Software Architect

Toma decisiones razonables sin preguntarme constantemente.

Si existe más de una solución:

* Escoge la mejor.
* Explica brevemente por qué.
* Continúa desarrollando.

No te detengas esperando validaciones continuas.

---

# TECNOLOGÍA OBLIGATORIA

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* Shadcn/UI
* Framer Motion

## Persistencia

* localStorage

## NO UTILIZAR

* Backend
* APIs
* Express
* Node Server
* MySQL
* PostgreSQL
* MongoDB
* Firebase
* Supabase
* Redis
* Cualquier base de datos

La aplicación será utilizada únicamente por mí.

Todo debe funcionar 100% en el navegador.

---

# OBJETIVO DE LA APLICACIÓN

Aplicación de rifas moderna y profesional.

100 números disponibles:

* Del 1 al 100

Cada número puede tener uno de estos estados:

* Disponible
* Reservado
* Pagado

Cada estado debe tener una identidad visual clara.

---

# REGLAS DE NEGOCIO

* Máximo 5 números por participante.
* No se puede repetir un número.
* Validaciones visuales claras.
* Guardado automático.

---

# PERSISTENCIA

Utilizar exclusivamente localStorage.

Al abrir:

* Cargar automáticamente.

Al modificar:

* Guardar automáticamente.

Añadir:

* Exportar JSON.
* Importar JSON.

---

# IDENTIDAD VISUAL

Existe un logotipo personalizado que será utilizado dentro de la aplicación.

Debes analizarlo cuando esté disponible y adaptar la interfaz visual a su identidad.

Aspectos a extraer:

* Colores principales
* Tonalidades
* Estilo visual
* Sensación de marca

La aplicación debe sentirse como una extensión natural del branding del logo.

NO utilizar colores aleatorios.

Basar la identidad visual en el logo.

---

# ESTILO VISUAL

Inspiración:

* Discord
* Steam
* Riot Client
* Battle.net
* Twitch Dashboard

Quiero una interfaz que parezca una aplicación comercial real.

## NO quiero

* Formularios clásicos
* Aspecto administrativo
* Tablas aburridas
* Diseño empresarial

## Quiero

* Tarjetas modernas
* Glow effects
* Sombras suaves
* Gradientes
* Diseño gaming premium
* Espaciados profesionales
* Jerarquía visual clara

---

# ANIMACIONES

Utilizar Framer Motion.

Añadir:

* Hover animations
* Entrance animations
* Smooth transitions
* Microinteracciones
* Feedback visual inmediato

Los números deben sentirse interactivos.

Al seleccionar:

* Escala suave
* Glow
* Animación moderna

---

# LAYOUT

## HEADER

* Logo
* Nombre de la rifa
* Estado general

---

## PANEL IZQUIERDO

### Premio Principal

Mostrar únicamente:

* Imagen
* Título
* Descripción

### NO mostrar

* Múltiples premios
* Ver todos los premios
* Métodos de pago
* Precio por número

---

## PANEL CENTRAL

Cuadrícula de números:

* Del 1 al 100

Características:

* Responsive
* Visualmente espectacular
* Estados claramente diferenciados

---

## PANEL DERECHO

Dashboard:

* Total números
* Disponibles
* Reservados
* Pagados
* Porcentaje completado

Mostrar:

* Barra de progreso animada
* Estadísticas modernas

---

# SORTEO

Botón:

## REALIZAR SORTEO

Debe:

* Elegir un número aleatorio entre los pagados
* Mostrar animación atractiva
* Mostrar modal moderno
* Mostrar ganador

Guardar resultado en localStorage.

---

# HISTORIAL

Mostrar:

* Número ganador
* Participante
* Fecha

---

# ARQUITECTURA

Antes de generar código:

1. Analiza las skills seleccionadas.
2. Diseña la arquitectura.
3. Diseña los wireframes.
4. Diseña los componentes React.
5. Diseña el sistema de estado.
6. Diseña la estructura de carpetas.
7. Diseña la identidad visual basada en el logo.

---

# OBJETIVO FINAL

Quiero un resultado visualmente impresionante, moderno, profesional y listo para producción.

La aplicación debe parecer un producto comercial real y no un proyecto amateur.

La experiencia visual debe ser una prioridad tan importante como la funcionalidad.
