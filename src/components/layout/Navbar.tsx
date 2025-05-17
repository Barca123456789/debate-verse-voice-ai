
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Award, Settings } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-debate rounded-lg flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <span className="ml-2 text-xl font-bold debate-gradient-text">DebateHub</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-foreground hover:text-debate px-3 py-2 rounded-md font-medium">
                Home
              </Link>
              <Link to="/leaderboard" className="text-foreground hover:text-debate px-3 py-2 rounded-md font-medium">
                Leaderboard
              </Link>
              {status === AuthStatus.AUTHENTICATED && (
                <Link to="/dashboard" className="text-foreground hover:text-debate px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center">
            {status === AuthStatus.AUTHENTICATED && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.username}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
                    <Award className="mr-2 h-4 w-4" />
                    <span>Leaderboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button onClick={() => navigate('/register')}>Sign up</Button>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-debate focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-foreground hover:text-debate block px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/leaderboard"
              className="text-foreground hover:text-debate block px-3 py-2 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            {status === AuthStatus.AUTHENTICATED && (
              <Link
                to="/dashboard"
                className="text-foreground hover:text-debate block px-3 py-2 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {status === AuthStatus.AUTHENTICATED && user ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium">{user.username}</div>
                    <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to={`/profile/${user.id}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-debate"
                    onClick={() => setIsOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-debate"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-debate"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="px-5 py-3 space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    setIsOpen(false);
                  }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
