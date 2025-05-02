
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, BarChart3, Upload, Settings as SettingsIcon, 
  Home, LogIn, UserCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/landing');
  };

  const getInitials = () => {
    if (!profile?.full_name) return user?.email?.charAt(0).toUpperCase() || '?';
    
    const names = profile.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const isLandingPage = location.pathname === '/landing';

  const authNavigation = user 
    ? [
        { name: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
        { name: 'Upload', href: '/upload', icon: <Upload className="h-5 w-5" /> },
        { name: 'Results', href: '/results', icon: <BarChart3 className="h-5 w-5" /> },
        { name: 'Settings', href: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
      ]
    : [];

  return (
    <nav className={cn(
      "sticky top-0 z-40 w-full border-b border-gray-100",
      isLandingPage ? "bg-white/80 backdrop-blur-md" : "bg-white"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/landing" className="flex-shrink-0 flex items-center">
              <span className="font-display text-black font-bold text-xl">Expense<span className="text-gray-400">Snap</span></span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!user ? (
              // Guest navigation
              <div className="flex items-center space-x-4">
                {!isLandingPage && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/landing')}
                    className="text-gray-700 hover:text-black"
                  >
                    Home
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth?mode=login')}
                  className="text-gray-700 hover:text-black"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="bg-black hover:bg-gray-800 text-white rounded-md"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              // Authenticated navigation
              <>
                {authNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                      location.pathname === item.href
                        ? "text-white bg-black"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                    )}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogIn className="mr-2 h-4 w-4 rotate-180" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full mr-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile?.username || user.email}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden bg-white pt-2 pb-3 space-y-1 shadow-md animate-slide-up">
          {!user ? (
            // Guest navigation (mobile)
            <>
              <Link
                to="/landing"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium mx-4",
                  location.pathname === '/landing'
                    ? "text-black"
                    : "text-gray-700 hover:text-black"
                )}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/auth?mode=login"
                className="block px-3 py-2 rounded-md text-base font-medium mx-4 text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="block px-3 py-2 rounded-md text-base font-medium mx-4 bg-black text-white my-2"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            // Authenticated navigation (mobile)
            <>
              {authNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium mx-4 flex items-center",
                    location.pathname === item.href
                      ? "text-white bg-black"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium mx-4 flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle className="mr-2 h-5 w-5" />
                Profile
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium mx-4 text-red-600 hover:bg-red-50 flex items-center"
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
              >
                <LogIn className="mr-2 h-5 w-5 rotate-180" />
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
