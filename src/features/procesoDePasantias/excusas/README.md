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

El rol de Tutor Empresarial actúa como un usuario supervisor sobre los estudiantes. Por su naturaleza, no debe poder crear excusas para sí mismo ni debe poder modificar los datos enviados. Su rol principal es el de **Lectura y Limpieza**.

**Permisos (`permissions`):**
- ✅ `can_view`: Puede previsualizar los PDFs/Certificados y leer los motivos de los estudiantes.
- ❌ `can_create`: No ve el panel de creación de nueva excusa.
- ❌ `can_edit`: El botón de "Editar" en el menú de la tabla desaparece por completo.
- ✅ `can_delete`: Puede purgar y limpiar excusas que ya no considere necesarias.
- ❌ `can_approve`: (Actualmente deshabilitado) No tiene botón de aprobar/rechazar directamente en la tabla.

**Vista de Tabla:**
Su interfaz es más compacta y centrada solo en lo que un tutor necesita evaluar:
Nombre del Estudiante, Fecha de Envío, Motivo, Estado Actual y Acciones de Gestión.

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

## Consideraciones Técnicas (Desarrollo)

1. **Simulación de Rol**: Durante desarrollo, puedes cambiar el perfil activo desde `pages/page.tsx` modificando la constante `const user = { role: 'ESTUDIANTE' as const };`.
2. **Modularidad**: Todos estos permisos son consumidos de forma reactiva por los componentes. Si un rol cambia en el futuro, solo debes modificar `excusasConfig.ts` y las vistas, modales y botones (`ExcusaTable.tsx`, `ExcusaForm.tsx`) se ocultarán o reordenarán automáticamente.
