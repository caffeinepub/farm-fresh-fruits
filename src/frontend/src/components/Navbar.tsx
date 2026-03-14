import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerRole } from "../hooks/useQueries";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: role } = useCallerRole();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAdmin = role === UserRole.admin;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              FarmFresh
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === "/shop"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-ocid="nav.link"
            >
              Shop
            </Link>
            {identity && (
              <Link
                to="/orders"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === "/orders"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-ocid="nav.link"
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath.startsWith("/admin")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-ocid="nav.link"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative" data-ocid="nav.link">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                  {totalItems}
                </Badge>
              )}
            </Link>

            {identity ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" data-ocid="nav.link">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/orders" data-ocid="nav.link">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={clear} data-ocid="nav.button">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="hidden md:flex"
                data-ocid="nav.primary_button"
              >
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-2"
              data-ocid="nav.link"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium py-2"
              data-ocid="nav.link"
            >
              Shop
            </Link>
            {identity && (
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2"
                data-ocid="nav.link"
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2"
                data-ocid="nav.link"
              >
                Dashboard
              </Link>
            )}
            {!identity && (
              <Button
                size="sm"
                onClick={() => {
                  login();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
              >
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
