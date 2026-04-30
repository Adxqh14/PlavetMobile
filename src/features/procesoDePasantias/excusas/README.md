# Módulo de Excusas - Documentación de Roles y Permisos

Este documento detalla la estructura de Control de Acceso Basado en Roles (RBAC) implementada en el módulo de "Excusas" (`/src/features/procesoDePasantias/excusas`). 

El módulo utiliza el patrón definido en `services/excusasConfig.ts` para determinar de forma dinámica qué interfaz, qué columnas de tabla y qué botones de acción se le muestran a cada tipo de usuario logueado en la plataforma.

A continuación se detallan los roles soportados y sus restricciones:

---

## 1. Administrador (`ADMINISTRADOR`)

El administrador tiene acceso global al sistema y capacidades completas de CRUD (Crear, Leer, Actualizar, Borrar) además de poder cambiar los estados de la excusa (Aprobar/Rechazar).

**Permisos (`permissions`):**
- ✅ `can_view`: Permite ver los detalles y el certificado (PDF/Imagen) adjunto.
- ✅ `can_create`: Permite acceder al formulario superior y registrar nuevas excusas.
- ✅ `can_edit`: Permite editar cualquier campo de las excusas de otros usuarios.
- ✅ `can_delete`: Permite borrar registros del sistema.
- ✅ `can_approve`: Permite autorizar o rechazar la excusa mediante el menú de los 3 puntos.

**Vista de Tabla:** 
Ve la tabla completa de datos, lo que incluye: ID, Pasantía, Estudiante, Tutor, Justificación, Certificado, Fecha de Envío, Estado y las Acciones.

---

## 2. Tutor Empresarial (`TUTOR EMPRESARIAL`)

El rol de Tutor Empresarial actúa como un usuario supervisor externo sobre los estudiantes. Su principal propósito es ser notificado del estado de la excusa (Aprobada/Rechazada), el cual es decidido y gestionado por el Tutor Académico. Por ello, solo tiene permisos de visualización.

**Permisos (`permissions`):**
- ✅ `can_view`: Puede previsualizar los PDFs/Certificados, leer los motivos de los estudiantes y observar el estado actual de la solicitud.
- ❌ `can_create`: No ve el panel de creación de nueva excusa.
- ❌ `can_edit`: No puede editar ninguna excusa.
- ❌ `can_delete`: No puede borrar ninguna excusa.
- ❌ `can_approve`: No tiene botón de aprobar/rechazar directamente en la tabla.

**Vista de Tabla:**
Su interfaz es compacta y centrada en la información que un tutor empresarial necesita ver:
Nombre del Estudiante, Fecha de Envío, Motivo, Estado Actual y Acciones de Gestión (solo lectura).

---

## 3. Estudiante (`ESTUDIANTE`)

El estudiante es el emisor final de las excusas. Únicamente requiere poder enviar documentos de justificación por inasistencia y revisar el estatus de sus solicitudes previas. 

**Permisos (`permissions`):**
- ✅ `can_view`: Puede ver el registro de sus propias excusas y volver a ver el PDF enviado.
- ✅ `can_create`: Muestra el formulario para crear/subir un nuevo certificado de excusa.
- ❌ `can_edit`: Una vez que envía la excusa, no puede alterar ni manipular su contenido.
- ❌ `can_delete`: No puede borrar un historial (debe ser el tutor o admin quien lo haga).
- ❌ `can_approve`: Evidentemente, no puede auto-aprobarse una excusa.

**Vista de Tabla:**
Es la vista más minimalista y simplificada de la aplicación:
Fecha de envío, Razón (extracto del texto), Estado de Solicitud (para ver si le aprobaron o rechazaron) y un botón simple para ver "Detalles".

---

## 4. Tutor Académico (`TUTOR ACADEMICO`)

El Tutor Académico es responsable de la gestión integral de las excusas. Evalúa y decide el estado final de las justificaciones presentadas por los estudiantes. Esta decisión es la que posteriormente visualizará el Tutor Empresarial.

**Permisos (`permissions`):**
- ✅ `can_view`: Permite ver los detalles y los certificados adjuntos.
- ✅ `can_create`: Permite registrar una excusa en nombre del estudiante.
- ✅ `can_edit`: Permite editar y corregir cualquier información de la excusa.
- ✅ `can_delete`: Permite limpiar o eliminar excusas del registro.
- ✅ `can_approve`: Permite dictaminar (Aprobar/Rechazar) la excusa.

**Vista de Tabla:**
Su tabla es extensa e incluye los campos clave: Estudiante, Tutor, Fecha Envío, Motivo, Estado y las Acciones completas de gestión.

---

## 5. Supervisor (`SUPERVISOR`)

El Supervisor requiere monitorizar el proceso de las pasantías y el cumplimiento de las normativas por parte del estudiante. Para la sección de Excusas, cuenta únicamente con permisos de observación.

**Permisos (`permissions`):**
- ✅ `can_view`: Puede observar la lista de excusas y ver detalles.
- ❌ `can_create`, `can_edit`, `can_delete`, `can_approve`: Completamente deshabilitados.

**Vista de Tabla:**
Muestra columnas de Estudiante, Fecha Envío, Motivo, Estado y Acciones (limitadas a solo lectura/ver detalles).

---

## 6. Vinculador (`VINCULADOR`)

El Vinculador actúa como puente o apoyo logístico institucional, supervisando el panorama general. Sus permisos en este módulo se restringen a visibilidad de los datos para fines de consulta.

**Permisos (`permissions`):**
- ✅ `can_view`: Observador de las excusas emitidas.
- ❌ `can_create`, `can_edit`, `can_delete`, `can_approve`: Completamente deshabilitados.

**Vista de Tabla:**
Al igual que el Supervisor, visualiza las columnas principales: Estudiante, Fecha Envío, Motivo, Estado y Acciones.

---

## Consideraciones Técnicas (Desarrollo)

1. **Simulación de Rol**: Durante desarrollo, puedes cambiar el perfil activo desde `pages/page.tsx` modificando la constante `const user = { role: 'ESTUDIANTE' as ExcusaRole };`.
2. **Modularidad**: Todos estos permisos son consumidos de forma reactiva por los componentes. Si un rol cambia en el futuro, solo debes modificar `excusasConfig.ts` y las vistas, modales y botones (`ExcusaTable.tsx`, `ExcusaForm.tsx`) se ocultarán o reordenarán automáticamente.
