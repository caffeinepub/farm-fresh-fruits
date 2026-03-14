import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package } from "lucide-react";
import { OrderStatus } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserOrders } from "../hooks/useQueries";

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "Pending",
  [OrderStatus.confirmed]: "Confirmed",
  [OrderStatus.outForDelivery]: "Out for Delivery",
  [OrderStatus.delivered]: "Delivered",
  [OrderStatus.cancelled]: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.pending]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.confirmed]: "bg-blue-100 text-blue-800",
  [OrderStatus.outForDelivery]: "bg-orange-100 text-orange-800",
  [OrderStatus.delivered]: "bg-green-100 text-green-800",
  [OrderStatus.cancelled]: "bg-red-100 text-red-800",
};

function formatPrice(price: bigint): string {
  return `₹${Number(price)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2"];

export default function MyOrders() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: orders, isLoading } = useUserOrders(principal);

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-3xl font-bold mb-2">
          Login to see your orders
        </h2>
        <p className="text-muted-foreground mb-8">
          Track your fresh fruit deliveries anytime.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          data-ocid="orders.primary_button"
        >
          {isLoggingIn ? "Connecting..." : "Login"}
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main
        className="container mx-auto px-4 py-10"
        data-ocid="orders.loading_state"
      >
        <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-28 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="orders.empty_state"
      >
        <div className="text-5xl mb-4">📦</div>
        <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-8">
          Your first fresh fruit order awaits!
        </p>
        <Button asChild size="lg" data-ocid="orders.primary_button">
          <Link to="/shop">
            Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </main>
    );
  }

  const sorted = [...orders].sort((a, b) => Number(b.createdAt - a.createdAt));

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
        My Orders
      </h1>
      <div className="space-y-4">
        {sorted.map((order, i) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-xl p-5"
            data-ocid={`orders.item.${i + 1}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Order #{order.id.slice(-8)}
                </p>
                <p className="text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <Badge
                className={`${STATUS_COLORS[order.status]} border-0 text-xs font-semibold px-3 py-1`}
              >
                {STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <div className="text-sm space-y-1 mb-4">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-muted-foreground"
                >
                  <span>
                    × {Number(item.quantity)} item (ID:{" "}
                    {item.productId.slice(-6)})
                  </span>
                  <span>{formatPrice(item.priceAtOrder * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">
                📍 {order.deliveryAddress}
              </span>
              <span className="font-bold text-primary">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
