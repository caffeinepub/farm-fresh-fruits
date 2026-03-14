import { Clock, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { OrderStatus } from "../../backend";
import { useAllOrders } from "../../hooks/useQueries";
import { useAvailableProducts } from "../../hooks/useQueries";

export default function AdminDashboard() {
  const { data: orders } = useAllOrders();
  const { data: products } = useAvailableProducts();

  const stats = {
    totalOrders: orders?.length ?? 0,
    pendingOrders:
      orders?.filter((o) => o.status === OrderStatus.pending).length ?? 0,
    totalProducts: products?.length ?? 0,
    totalRevenue: orders?.reduce((sum, o) => sum + o.totalAmount, 0n) ?? 0n,
  };

  const tiles = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: stats.totalOrders,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Clock,
      label: "Pending Orders",
      value: stats.pendingOrders,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      icon: Package,
      label: "Products Listed",
      value: stats.totalProducts,
      color: "text-green-600 bg-green-50",
    },
    {
      icon: TrendingUp,
      label: "Total Revenue",
      value: `₹${Number(stats.totalRevenue)}`,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${t.color}`}
            >
              <t.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold font-display mb-1">{t.value}</p>
            <p className="text-xs text-muted-foreground">{t.label}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        Use the tabs above to manage products and orders.
      </p>
    </div>
  );
}
