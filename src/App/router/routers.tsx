import LoginPage from '@/features/auth/pages/page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '@/features/main/pages/page';
import DashboardPage from '@/features/dashboard/pages/page';
import CentroDeTrabajoPage from '@/features/gestionEmprearial/centroDeTrabajo/pages/page';
import InicioPage from '@/features/inicio/pages/page';
import PlazasPage from '@/features/gestionEmprearial/plazas/pages/page';
import TutoresAcademicosPage from '@/features/gestionAcademica/tutores/pages/page';
import DocumentosPage from '@/features/documentacion/pages/page';
import SubirDocumentosPage from '@/features/documentacion/subir-documentos/page';
import MisDocumentosPage from '@/features/documentacion/mis-documentos/pages/page';
import EvaluacionesPage from '@/features/evaluaciones/pages/page';
import MisCalificacionesPage from '@/features/evaluaciones/mis-calificaciones/page';
import CalificacionesPage from '../../features/evaluaciones/calificacion/pages/page';
import ReportesPage from '@/features/reportes/page';
import CierrePasantiasPage from '@/features/procesoDePasantias/cierreDePasantias/pages/page';
import ExcusasPage from '@/features/procesoDePasantias/excusas/pages/page';
import GestionPasantiasPage from '@/features/procesoDePasantias/gestionDePasantias/pages/page';
import SupervisoresPage from '@/features/rolesYpersonal/supervisores/pages/page';
import VinculadoresPage from '@/features/rolesYpersonal/vinculadores/pages/page';
import EstudiantesPage from '@/features/gestionAcademica/estudiantes/pages/page';
import TalleresPage from '@/features/gestionAcademica/talleres/pages/page';
import SupportPage from '@/features/support/pages/page';
import FeedbackPage from '@/features/feedback/pages/page';
import AccountPage from '@/features/account/pages/page';
import UsuariosPage from '@/features/rolesYpersonal/usuarios/pages/page';
import TutoresEmpresarialPage from '@/features/gestionEmprearial/tutores/pages/page';

import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

function RoutersProtected() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas por RBAC */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>} />
        <Route path="/centroDeTrabajo" element={<ProtectedRoute><CentroDeTrabajoPage/></ProtectedRoute>} />
        <Route path="/plaza" element={<ProtectedRoute><PlazasPage/></ProtectedRoute>} />
        <Route path="/tutoresAcademicos" element={<ProtectedRoute><TutoresAcademicosPage/></ProtectedRoute>} />
        <Route path="/tutoresEmpresariales" element={<ProtectedRoute><TutoresEmpresarialPage/></ProtectedRoute>} />
        <Route path="/documentos" element={<ProtectedRoute><DocumentosPage/></ProtectedRoute>} />
        <Route path="/mis-documentos" element={<ProtectedRoute><MisDocumentosPage/></ProtectedRoute>} />
        <Route path="/subir" element={<ProtectedRoute><SubirDocumentosPage/></ProtectedRoute>} />
        <Route path="/evaluaciones" element={<ProtectedRoute><EvaluacionesPage/></ProtectedRoute>} />
        <Route path="/mis-calificaciones" element={<ProtectedRoute><MisCalificacionesPage/></ProtectedRoute>} />
        <Route path="/calificaciones" element={<ProtectedRoute><CalificacionesPage/></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute><ReportesPage/></ProtectedRoute>} />
        <Route path="/gestionDePasantias" element={<ProtectedRoute><GestionPasantiasPage/></ProtectedRoute>} />
        <Route path="/cierrePasantias" element={<ProtectedRoute><CierrePasantiasPage/></ProtectedRoute>} />
        <Route path="/excusas" element={<ProtectedRoute><ExcusasPage/></ProtectedRoute>} />
        <Route path="/supervisores" element={<ProtectedRoute><SupervisoresPage/></ProtectedRoute>} />
        <Route path="/vinculadores" element={<ProtectedRoute><VinculadoresPage/></ProtectedRoute>} />
        <Route path="/estudiantes" element={<ProtectedRoute><EstudiantesPage/></ProtectedRoute>} />
        <Route path="/talleres" element={<ProtectedRoute><TalleresPage/></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportPage/></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage/></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><AccountPage/></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><UsuariosPage/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default RoutersProtected