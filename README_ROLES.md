# 🔐 Sistema de Roles y Permisos Centralizado (RBAC) - Plavet

Este documento explica cómo funciona el sistema de gestión de roles que hemos implementado para permitir una transición fluida entre el desarrollo con roles simulados y la integración final con el backend.

## 📁 Estructura de Archivos

Para cumplir con las reglas de **Vite/React Fast Refresh** y mantener una arquitectura limpia, el sistema se ha dividido en los siguientes archivos:

1.  **Tipos**: `src/features/auth/types/index.ts`
    *   Contiene la definición de los roles (`ADMINISTRADOR`, `ESTUDIANTE`, etc.).
2.  **Instancia del Contexto**: `src/features/auth/context/AuthContextInstance.ts`
    *   Crea la instancia de `createContext`. Se separó para evitar errores de recarga rápida.
3.  **Provider (Lógica)**: `src/features/auth/context/AuthContext.tsx`
    *   Contiene el `AuthProvider`. Es aquí donde se gestiona el estado del rol y se guarda en `localStorage`.
4.  **Hook de Acceso**: `src/features/auth/hooks/useAuth.ts`
    *   El hook `useAuth()` para usar en cualquier componente.
5.  **Configuración Centralizada**: `src/shared/config/rbac.ts`
    *   **EL ARCHIVO MÁS IMPORTANTE**. Aquí están todas las reglas de qué puede ver cada rol.

---

## 🛠️ Cómo gestionar Permisos (rbac.ts)

Si necesitas cambiar qué ve un usuario, solo tienes que editar `src/shared/config/rbac.ts`.

### 1. Rutas Permitidas (`ROUTE_PERMISSIONS`)
Define qué URLs son accesibles por cada rol. El componente `ProtectedRoute` en el router usa estas reglas.
```typescript
{ path: "/plaza", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] }
```

### 2. Visibilidad del Menú (`NAV_PERMISSIONS`)
Define qué ítems del Sidebar son visibles para los estudiantes (otros roles suelen ver todo o tienen reglas específicas en la función `isNavVisible`).

### 3. Configuraciones de Módulo (Excusas, etc.)
He unificado la configuración del módulo de Excusas dentro de este mismo archivo bajo `EXCUSAS_MODULE_CONFIG`. Aquí controlas los títulos de página y las columnas de las tablas por cada rol.

---

## 🔄 Cambio de Roles en Desarrollo

Para cambiar de rol durante el desarrollo, debes hacerlo directamente en el código:

1.  Ve a `src/features/auth/context/AuthContext.tsx`.
2.  En la **línea 12**, cambia el valor por defecto:
```tsx
// Cambia 'ESTUDIANTE' por 'ADMINISTRADOR', etc.
return (localStorage.getItem('plavet_role') as UserRole) || 'ADMINISTRADOR';
```
3.  Si ya habías seleccionado un rol anteriormente, es posible que debas limpiar el `localStorage` de tu navegador o usar la consola: `localStorage.setItem('plavet_role', 'ADMINISTRADOR')`.

---

## 🔗 Guía para Integración con Backend (Para el compañero)

Para conectar con usuarios reales:
1.  Ve a `src/features/auth/context/AuthContext.tsx`.
2.  En el `useEffect` inicial, en lugar de leer de `localStorage`, realiza la llamada a tu sistema de autenticación (Firebase, Supabase, API).
3.  Actualiza el estado `userRole` con el rol que devuelva tu base de datos.
4.  El resto de la aplicación (Sidebar, Dashboard, Rutas) se actualizará automáticamente ya que todos dependen del mismo `useAuth()`.

---

## 🚀 Componentes Implementados
- **Dashboard Condicional**: Muestra una vista premium para `ESTUDIANTE` y la vista administrativa para otros.
- **ProtectedRoute**: Envuelve las rutas en `routers.tsx` para evitar accesos no autorizados.
- **Sidebar Dinámico**: Filtra grupos y submenús según las reglas de `rbac.ts`.
