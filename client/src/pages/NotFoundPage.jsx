import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-7xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
