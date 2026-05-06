import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { getMe } from './store/authSlice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import AIItineraryPage from './pages/AIItineraryPage';
import NotFoundPage from './pages/NotFoundPage';

// User Portal Phase 1
import OnboardingPage from './pages/OnboardingPage';
import MapPage from './pages/MapPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import QuizPage from './pages/QuizPage';

// Admin Portal Phase 1
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminDestinationsPage from './pages/admin/AdminDestinationsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminContentPage from './pages/admin/AdminContentPage';

// Creator Portal Phase 1
import CreatorDashboardPage from './pages/creator/CreatorDashboardPage';
import CreatorGuidesPage from './pages/creator/CreatorGuidesPage';
import CreatorGuideFormPage from './pages/creator/CreatorGuideFormPage';
import CreatorApplicationPage from './pages/creator/CreatorApplicationPage';
function AppLayout() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(getMe()); }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Auth pages without navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages with navbar + footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destination/:slug" element={<DestinationDetailPage />} />
                <Route path="/ai-planner" element={<AIItineraryPage />} />
                
                {/* User Portal Phase 1 Routes */}
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/quiz" element={<QuizPage />} />

                {/* Admin Portal Phase 1 Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole={['admin', 'moderator']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requiredRole={['admin']}><AdminUsersPage /></ProtectedRoute>} />
                <Route path="/admin/destinations" element={<ProtectedRoute requiredRole={['admin', 'moderator']}><AdminDestinationsPage /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute requiredRole={['admin']}><AdminCategoriesPage /></ProtectedRoute>} />
                <Route path="/admin/applications" element={<ProtectedRoute requiredRole={['admin', 'moderator']}><AdminApplicationsPage /></ProtectedRoute>} />
                <Route path="/admin/content" element={<ProtectedRoute requiredRole={['admin', 'moderator']}><AdminContentPage /></ProtectedRoute>} />

                {/* Creator Portal Phase 1 Routes */}
                <Route path="/creator/dashboard" element={<ProtectedRoute requiredRole={['creator', 'admin']}><CreatorDashboardPage /></ProtectedRoute>} />
                <Route path="/creator/guides" element={<ProtectedRoute requiredRole={['creator', 'admin']}><CreatorGuidesPage /></ProtectedRoute>} />
                <Route path="/creator/guides/new" element={<ProtectedRoute requiredRole={['creator', 'admin']}><CreatorGuideFormPage /></ProtectedRoute>} />
                <Route path="/creator/guides/:id/edit" element={<ProtectedRoute requiredRole={['creator', 'admin']}><CreatorGuideFormPage /></ProtectedRoute>} />
                <Route path="/apply" element={<ProtectedRoute><CreatorApplicationPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
}
