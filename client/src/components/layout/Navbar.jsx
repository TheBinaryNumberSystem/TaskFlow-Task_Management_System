import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { RoleBadge } from '../common/Badge.jsx';
import { CheckSquare, LayoutDashboard, ListTodo, LogOut, Menu, X, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand & Left Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Task<span className="text-indigo-600">Flow</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  TMS
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/tasks')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ListTodo className="w-4 h-4 mr-2" />
                Tasks
              </Link>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Task
              </button>
            )}

            {/* User Profile Tag */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.name || 'User'}
                </span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-xs text-slate-500 truncate max-w-[130px]">
                    {user?.email}
                  </span>
                  <RoleBadge role={user?.role} />
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden space-x-2">
            {onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="p-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                title="New Task"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 pt-3 pb-4 space-y-2 bg-white">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/')
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/tasks"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/tasks')
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ListTodo className="w-5 h-5 mr-3" />
            Tasks
          </Link>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-700 text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                <RoleBadge role={user?.role} />
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="inline-flex items-center text-sm font-medium text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
