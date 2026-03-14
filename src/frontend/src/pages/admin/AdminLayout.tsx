import { Button } from "@/components/ui/button";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { UserRole } from "../../backend";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useCallerRole } from "../../hooks/useQueries";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout() {
  const { data: role, isLoading } = useCallerRole();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Login required</h2>
        <p className="text-muted-foreground mb-6">
          You need to login as the farmer to access this area.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="admin.primary_button"
        >
          {isLoggingIn ? "Connecting..." : "Login"}
        </Button>
      </div>
    );
  }

  if (!isLoading && role !== UserRole.admin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          This area is only for the farm admin.
        </p>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Farmer Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Manage your fruits and orders
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-xl mb-8 w-fit">
        {navItems.map((item) => {
          const active = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="admin.tab"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}
