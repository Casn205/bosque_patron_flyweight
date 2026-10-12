# 🌲 Bosque · Patrón Flyweight en TypeScript

Ejemplo didáctico del patrón de diseño estructural **Flyweight** (Peso Ligero).
El proyecto simula un bosque con hasta 5.000 árboles animados por el viento y permite
comparar **en vivo** el consumo de memoria **sin** el patrón (con deuda técnica) y **con** el patrón.

---

## 📑 Contenido

1. [¿Qué es el patrón Flyweight?](#-qué-es-el-patrón-flyweight)
2. [El problema que resolvemos](#-el-problema-que-resolvemos)
3. [La solución](#-la-solución)
4. [Estructura del proyecto](#-estructura-del-proyecto)
5. [Cómo ejecutarlo paso a paso](#-cómo-ejecutarlo-paso-a-paso)
6. [Cómo usar la aplicación](#-cómo-usar-la-aplicación)
7. [Resultados esperados](#-resultados-esperados)
8. [Solución de problemas](#-solución-de-problemas)
9. [Tecnologías](#-tecnologías)

---

## 🧩 ¿Qué es el patrón Flyweight?

Flyweight es un patrón estructural que **reduce el consumo de memoria** cuando una aplicación
necesita crear una gran cantidad de objetos que **comparten gran parte de sus datos**.

La idea es dividir el estado de un objeto en dos partes:

| Tipo de estado | Qué es | Dónde vive |
|---|---|---|
| **Intrínseco** | Datos idénticos para muchos objetos (no cambian) | En un objeto **compartido** (el flyweight) |
| **Extrínseco** | Datos propios de cada objeto individual | En cada objeto, o se pasa como parámetro |

En lugar de que cada objeto tenga su propia copia de los datos pesados, todos **apuntan al mismo**.

---

## ⚠️ El problema que resolvemos

Un bosque de videojuego tiene miles de árboles. Cada árbol necesita:

- **Datos pesados y repetidos** (iguales para todos los árboles de la misma especie):
  una malla 3D (~60 KB) y una textura (~64 KB), además de especie, color de hojas y altura base.
- **Datos propios** (distintos en cada árbol): posición `x, y`, escala, rotación y fase del viento.

En la versión **sin patrón**, cada `Tree` carga y guarda sus propios buffers.
Con 5.000 árboles y solo 4 especies, hay **5.000 copias de datos que solo existen en 4 variantes**:
unos **600 MB** de memoria, casi todos duplicados.

---

## ✅ La solución

Se separa el estado y se comparte lo pesado:

- `TreeType` (**Flyweight**): guarda el estado intrínseco. Hay **uno por especie**.
- `TreeTypeFactory` (**Flyweight Factory**): entrega siempre el mismo `TreeType` para una especie; lo crea solo la primera vez.
- `Tree` (**Context**): guarda solo el estado extrínseco y una **referencia** a su `TreeType`.
- `FlyweightForest` (**Client**): pide los tipos a la fábrica y crea los árboles.

Resultado: con 5.000 árboles solo existen **4 conjuntos de buffers** (~0,47 MB en lugar de ~600 MB),
y el bosque se ve exactamente igual.

---

## 📂 Estructura del proyecto

```
forest-flyweight/
├── index.html                  # Página y estilos de la interfaz
├── package.json                # Dependencias y comandos
├── tsconfig.json               # Configuración de TypeScript
└── src/
    ├── main.ts                 # Bucle de animación y orquestación
    ├── domain/
    │   ├── shared/             # Común a ambas versiones
    │   │   ├── Species.ts      # Especies y su configuración
    │   │   ├── resources.ts    # Simula la carga de mallas y texturas
    │   │   ├── ByteCounter.ts  # Cuenta los bytes de buffers creados
    │   │   └── IForest.ts      # Interfaces comunes (IForest, IRenderableTree)
    │   ├── debt/               # ANTES: versión con deuda técnica
    │   │   ├── Tree.ts
    │   │   └── DebtForest.ts
    │   └── flyweight/          # DESPUÉS: versión con el patrón
    │       ├── TreeType.ts
    │       ├── TreeTypeFactory.ts
    │       ├── Tree.ts
    │       └── FlyweightForest.ts
    └── ui/                     # Interfaz (no forma parte del patrón)
        ├── renderer.ts         # Dibujo en Canvas
        ├── controls.ts         # Selector de modo, slider y botones
        ├── metricsPanel.ts     # Panel de métricas y FPS
        └── dom.ts              # Utilidad para obtener elementos del HTML
```

> **Para estudiar el patrón** compara las carpetas `src/domain/debt/` y `src/domain/flyweight/`.
> El resto del código (interfaz, animación) es idéntico para ambas versiones.

---

## 🚀 Cómo ejecutarlo paso a paso

Esta guía supone un **computador limpio**, sin nada instalado y sin experiencia previa.

### Paso 1. Instalar Node.js

Node.js es el programa que permite ejecutar el proyecto.

1. Entra a **https://nodejs.org**.
2. Descarga la versión marcada como **LTS** (recomendada).
3. Abre el instalador y pulsa **Siguiente** en todas las pantallas, dejando las opciones por defecto.
4. Cuando termine, **reinicia el computador** (o al menos cierra y vuelve a abrir cualquier terminal).

### Paso 2. Descargar el proyecto

Elige **una** de estas dos formas.

**Opción A: descargar el ZIP (la más fácil, no requiere nada más)**

1. Abre la página del repositorio en GitHub: `https://github.com/TU_USUARIO/TU_REPO`.
2. Pulsa el botón verde **Code** y luego **Download ZIP**.
3. Busca el ZIP descargado y haz clic derecho → **Extraer todo...** (en Windows) o doble clic (en Mac).
4. Mueve la carpeta resultante a un lugar sencillo, por ejemplo `C:\dev\` en Windows o tu carpeta personal en Mac.

> ⚠️ **Evita carpetas sincronizadas con OneDrive, Dropbox o iCloud** (como *Documentos*, *Escritorio* o *Imágenes* en algunos equipos). Sincronizan miles de archivos de `node_modules` y pueden volver todo muy lento o causar errores.

**Opción B: clonar con Git (si ya tienes Git instalado)**

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
```

### Paso 3. Abrir una terminal dentro de la carpeta del proyecto

La carpeta correcta es la que contiene el archivo `package.json`.

- **Windows:** abre la carpeta en el Explorador de archivos, haz clic en la barra de direcciones, escribe `cmd` y pulsa **Enter**. Se abre una terminal ya ubicada en esa carpeta.
- **Mac:** clic derecho sobre la carpeta → **Nuevo terminal en la carpeta**.
- **Linux:** clic derecho dentro de la carpeta → **Abrir en terminal**.

### Paso 4. Verificar que Node.js quedó instalado

En la terminal escribe:

```bash
node -v
npm -v
```

Deben aparecer dos números de versión (por ejemplo `v20.11.0` y `10.2.4`). Se requiere Node.js **18 o superior**.
Si aparece un error del tipo *"no se reconoce el comando"*, reinicia el computador y repite este paso.

### Paso 5. Instalar las dependencias

```bash
npm install
```

Tarda uno o dos minutos y crea la carpeta `node_modules`. Es normal que muestre mucho texto.
Al terminar no debe haber líneas que digan `ERR!`.

> Solo es necesario hacerlo **una vez**.

### Paso 6. Iniciar la aplicación

```bash
npm run dev
```

Verás un mensaje parecido a este:

```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

### Paso 7. Abrir la aplicación en el navegador

Abre **Chrome, Edge o Firefox** y entra a la dirección que apareció en la terminal
(normalmente **http://localhost:5173**). Verás el bosque y el panel de controles.

> Deja la terminal abierta mientras uses la aplicación.
> Para **detenerla**, pulsa `Ctrl + C` en la terminal.

---

## 🎮 Cómo usar la aplicación

1. **Modo:** elige *Sin Flyweight* o *Con Flyweight* con los botones de la parte superior del panel.
2. **Cantidad a plantar:** mueve el slider (100 a 5.000) y pulsa **Plantar**,
   o usa los atajos **+100**, **+500** y **+1000**.
3. **Vaciar:** elimina todos los árboles y reinicia las métricas.
4. **Cambiar de modo** vacía el bosque y vuelve a plantar la **misma cantidad**
   con la otra implementación, para que las métricas sean comparables.
5. El panel de **Métricas** muestra árboles, conjuntos de recursos, buffers creados,
   memoria, tiempo de creación y FPS.

### Experimento recomendado

1. Con *Sin Flyweight*, planta **5.000** árboles y anota la memoria.
2. Pulsa **Con Flyweight** y compara las métricas.
3. Observa que el bosque se ve **igual**, pero la memoria cae de cientos de MB a menos de 1 MB.

---

## 📊 Resultados esperados

| Métrica (5.000 árboles) | Sin Flyweight | Con Flyweight |
|---|---|---|
| Conjuntos mesh + texture | 5.000 | **4** |
| Buffers creados | 10.000 | **8** |
| Memoria en buffers | ~599 MB | **~0,47 MB** |
| Tiempo de creación | Alto | Muy bajo |

La memoria se mide con un contador propio (`ByteCounter`) que suma el tamaño de cada buffer creado,
por eso el resultado es **exacto y reproducible** en cualquier equipo.
El tiempo y los FPS sí dependen de tu computador.

---

## 🛠️ Solución de problemas

| Problema | Causa y solución |
|---|---|
| `'node' no se reconoce como un comando` | Node.js no está instalado o la terminal se abrió antes de instalarlo. Reinicia el equipo y vuelve a intentarlo. |
| `npm : No se puede cargar el archivo npm.ps1 ... la ejecución de scripts está deshabilitada` (Windows PowerShell) | Usa **cmd** en lugar de PowerShell (ver Paso 3), o ejecuta una vez en PowerShell: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `Could not read package.json` o `ENOENT` | Estás en la carpeta equivocada. Debes estar en la que contiene `package.json` (ver Paso 3). |
| La página no carga en `localhost:5173` | Revisa que la terminal siga abierta con `npm run dev` y que uses la dirección exacta que muestra. Si el puerto 5173 está ocupado, Vite usará otro (por ejemplo 5174). |
| La pestaña se pone muy lenta o falla con 5.000 árboles en *Sin Flyweight* | Es esperado: ese modo consume unos 600 MB a propósito. Cierra otras pestañas o planta menos árboles. Es precisamente el problema que resuelve el patrón. |
| Errores raros al instalar dentro de OneDrive | Mueve el proyecto a una carpeta fuera de OneDrive (por ejemplo `C:\dev`), borra `node_modules` y repite `npm install`. |

---

## 🧰 Tecnologías

- [TypeScript](https://www.typescriptlang.org/): lenguaje del proyecto.
- [Vite](https://vitejs.dev/): servidor de desarrollo y empaquetador.
- Canvas 2D: dibujo del bosque, sin librerías externas.

### Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las dependencias (solo la primera vez) |
| `npm run dev` | Inicia la aplicación en modo desarrollo |
| `npm run build` | Verifica los tipos y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión generada por `build` |
