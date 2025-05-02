
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
    navigate('/');
  };

  const getInitials = () => {
    if (!profile?.full_name) return user?.email?.charAt(0).toUpperCase() || '?';
    
    const names = profile.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const authNavigation = user 
    ? [
        { name: 'Dashboard', href: '/', icon: <Home className="h-5 w-5" /> },
        { name: 'Upload CSV', href: '/upload', icon: <Upload className="h-5 w-5" /> },
        { name: 'Insights', href: '/insights', icon: <BarChart3 className="h-5 w-5" /> },
        { name: 'Settings', href: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
      ]
    : [];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-expense-blue font-bold text-xl">ExpenseSnap</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!user ? (
              // Guest navigation
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/' ? "text-expense-blue" : "text-gray-600 hover:text-expense-blue"
                  )}
                >
                  Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/auth?mode=login')}
                  className="text-expense-blue border-expense-blue"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="bg-expense-blue hover:bg-blue-700"
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
                        ? "text-white bg-expense-blue"
                        : "text-gray-600 hover:bg-expense-gray hover:text-expense-blue"
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
                to="/"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium mx-4",
                  location.pathname === '/'
                    ? "text-expense-blue"
                    : "text-gray-600 hover:text-expense-blue"
                )}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/auth?mode=login"
                className="block px-3 py-2 rounded-md text-base font-medium mx-4 text-expense-blue"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="block px-3 py-2 rounded-md text-base font-medium mx-4 bg-expense-blue text-white my-2"
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
                      ? "text-white bg-expense-blue"
                      : "text-gray-600 hover:bg-expense-gray hover:text-expense-blue"
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
