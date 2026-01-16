import { Moon, Sun, Menu, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme/theme-provider';
import { useAppSelector } from '@/app/hooks';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
console.log(isAuthenticated, user);
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            E-Commerce
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {user?.role === 'ADMIN' && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/auth/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/auth/register')}>Register</Button>
            </div>
          )}

          <div className="md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 space-y-4">
                  <Link
                    to="/products"
                    className="block text-sm font-medium"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Products
                  </Link>
                  {isAuthenticated && user?.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      className="block text-sm font-medium"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/cart"
                        className="block text-sm font-medium"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Cart ({cartItemCount})
                      </Link>
                      <Link
                        to="/profile"
                        className="block text-sm font-medium"
                        onClick={() => setDrawerOpen(false)}
                      >
                        Profile
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setDrawerOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate('/auth/login');
                          setDrawerOpen(false);
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          navigate('/auth/register');
                          setDrawerOpen(false);
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}
