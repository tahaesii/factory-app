import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import LoginPage from '@/components/LoginPage';
import Layout from '@/components/Layout';
import CommandPalette from '@/components/CommandPalette';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const theme = useAppStore((s) => s.theme);

  // Apply dark/light class to :root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply RTL
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  return (
    <>
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            background: 'var(--color-card)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Vazirmatn',
            direction: 'rtl',
          },
        }}
      />
      {isAuthenticated ? (
        <>
          <CommandPalette />
          <ErrorBoundary>
            <Layout />
          </ErrorBoundary>
        </>
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App;
