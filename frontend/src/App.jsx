import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <TaskProvider>
          <Header />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Footer />
        </TaskProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
