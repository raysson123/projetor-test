
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Menu, X, User, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  // Determina qual dashboard usar baseado no papel do usuário
  const getDashboardPath = () => {
    if (!profile) return '/dashboard';
    return profile.role === 'admin' ? '/admin' : '/dashboard';
  };

  const getDashboardLabel = () => {
    if (!profile) return 'Dashboard';
    return profile.role === 'admin' ? 'Painel Admin' : 'Dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}

          <Link to="/" className="flex items-center space-x-3 group">
            {/* IMAGEM DA LOGO (Puxando direto da pasta public com barra correta) */}
            <img
              src="src/assets/logo.png"
              alt="Logo Denis Marques"
              className="h-14 w-auto transition-transform duration-200 group-hover:scale-102"
            />

            {/* TEXTOS ALINHADOS NA LATERAL (Um em cima do outro) */}
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                DENIS MARQUES
              </span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                GESTÃO DE SAÚDE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Início
            </a>
            <a href="#cursos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Cursos
            </a>
            {/*<a href="#ebooks" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              eBooks
            </a>*/}
            <a href="#sobre" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Sobre
            </a>
            <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contato
            </a>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardPath()}>
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <User className="h-4 w-4 mr-2" />
                    {getDashboardLabel()}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Início
              </a>
              <a href="#cursos" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Cursos
              </a>
             {/*<a href="#ebooks" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                eBooks
              </a>*/}
              <a href="#sobre" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Sobre
              </a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contato
              </a>

              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link to={getDashboardPath()}>
                    <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-fit">
                      <User className="h-4 w-4 mr-2" />
                      {getDashboardLabel()}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-gray-600 hover:text-red-600 w-fit"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-fit">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
