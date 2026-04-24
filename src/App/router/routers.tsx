import LoginPage from '@/features/auth/pages/page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '@/features/main/pages/page';
import DashboardPage from '@/features/dashboard/pages/page';
import CentroDeTrabajoPage from '@/features/gestionEmprearial/centroDeTrabajo/pages/page';
import InicioPage from '@/features/inicio/pages/page';
import PlazasPage from '@/features/gestionEmprearial/plazas/pages/page';
import TutoresPage from '@/features/gestionEmprearial/tutores/pages/page';
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

function RoutersProtected() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/centroDeTrabajo" element={<CentroDeTrabajoPage/>} />
        <Route path="/plaza" element={<PlazasPage/>} />
        <Route path="/tutores" element={<TutoresPage/>} />
        <Route path="/documentos" element={<DocumentosPage/>} />
        <Route path="/mis-documentos" element={<MisDocumentosPage/>} />
        <Route path="/subir" element={<SubirDocumentosPage/>} />
        <Route path="/evaluaciones" element={<EvaluacionesPage/>} />
        <Route path="/mis-calificaciones" element={<MisCalificacionesPage/>} />
        <Route path="/calificaciones" element={<CalificacionesPage/>} />
        <Route path="/reportes" element={<ReportesPage/>} />
        <Route path="/gestionDePasantias" element={<GestionPasantiasPage/>} />
        <Route path="/cierrePasantias" element={<CierrePasantiasPage/>} />
        <Route path="/excusas" element={<ExcusasPage/>} />
        <Route path="/supervisores" element={<SupervisoresPage/>} />
        <Route path="/vinculadores" element={<VinculadoresPage/>} />
        <Route path="/estudiantes" element={<EstudiantesPage/>} />
        <Route path="/talleres" element={<TalleresPage/>} />
        <Route path="/support" element={<SupportPage/>} />
        <Route path="/feedback" element={<FeedbackPage/>} />
        <Route path="/account" element={<AccountPage/>} />
        <Route path="/usuarios" element={<UsuariosPage/>} />
      
      </Routes>
    </BrowserRouter>
  )
}

export default RoutersProtected