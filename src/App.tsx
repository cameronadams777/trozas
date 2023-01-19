import { AuthProvider } from 'src/state/AuthContext'
import { MainLayout } from 'src/layouts/MainLayout';
import { AuthTokenForm } from './components/AuthTokenForm';

function App() { 
  return (
    <AuthProvider> 
      <MainLayout>
        <AuthTokenForm />
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
