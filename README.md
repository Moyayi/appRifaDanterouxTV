# 🎯 AppWeb Rifa DanterouxTV

Aplicación web de rifas premium para DanterouxTV. Interfaz moderna con estética gaming, gestión completa de 100 números con estados (disponible, reservado, pagado), sorteo animado e historial de ganadores. Todo funciona 100% en el navegador usando localStorage — sin backend ni base de datos.

## Stack tecnológico

- **React 18** + **TypeScript**
- **Vite** — servidor de desarrollo y bundler
- **TailwindCSS** — estilos utility-first
- **Shadcn/UI** + **Radix UI** — componentes accesibles
- **Framer Motion** — animaciones y microinteracciones
- **Zustand** — gestión de estado global
- **localStorage** — persistencia de datos

---

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) **v18 o superior** (incluye npm)
- Un navegador moderno (Chrome, Firefox, Edge)

Para comprobar que Node.js está instalado correctamente:

```bash
node --version
npm --version
```

---

## Instalación y puesta en marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/appWebRifaDanterouxTV.git
```

### 2. Entra en la carpeta del proyecto

```bash
cd appWebRifaDanterouxTV
```

### 3. Instala las dependencias

```bash
npm install
```

### 4. Inicia el servidor de desarrollo

```bash
npm run dev
```

Abre el navegador y accede a la URL que aparece en la consola (normalmente [http://localhost:5173](http://localhost:5173)).

---

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera la build de producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza la build de producción en local |

---

## Características

- **100 números** del 1 al 100, cada uno con estado: Disponible / Reservado / Pagado
- **Máximo 5 números por participante**
- **Guardado automático** en localStorage — no se pierde nada al cerrar el navegador
- **Exportar / Importar** datos en formato JSON
- **Sorteo animado** entre los números pagados con modal de ganador
- **Historial de ganadores** con número, participante y fecha
- **Dashboard** con estadísticas en tiempo real y barra de progreso animada

---

## Datos y privacidad

La aplicación no envía ningún dato a ningún servidor. Toda la información (participantes, estados, historial) se almacena únicamente en el `localStorage` de tu navegador.
