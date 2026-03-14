import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../../backend";
import { useAllOrders, useUpdateOrderStatus } from "../../hooks/useQueries";

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

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.pending]: [OrderStatus.confirmed, OrderStatus.cancelled],
  [OrderStatus.confirmed]: [OrderStatus.outForDelivery, OrderStatus.cancelled],
  [OrderStatus.outForDelivery]: [OrderStatus.delivered],
  [OrderStatus.delivered]: [],
  [OrderStatus.cancelled]: [],
};

function formatPrice(price: bigint): string {
  return `₹${Number(price)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3"];

export default function AdminOrders() {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = orders
    ? [...orders]
        .sort((a, b) => Number(b.createdAt - a.createdAt))
        .filter((o) => filter === "all" || o.status === filter)
    : [];

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated!");
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-6">Orders</h2>

      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as "all" | OrderStatus)}
        className="mb-6"
      >
        <TabsList data-ocid="admin.tab">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={OrderStatus.pending}>Pending</TabsTrigger>
          <TabsTrigger value={OrderStatus.confirmed}>Confirmed</TabsTrigger>
          <TabsTrigger value={OrderStatus.outForDelivery}>
            Out for Delivery
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.delivered}>Delivered</TabsTrigger>
          <TabsTrigger value={OrderStatus.cancelled}>Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="admin.empty_state">
          <p className="text-muted-foreground">No orders in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const nextStatuses = NEXT_STATUSES[order.status];
            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-5"
                data-ocid={`admin.item.${i + 1}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      #{order.id.slice(-10)} · {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      📱 {order.customerPhone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      📍 {order.deliveryAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${STATUS_COLORS[order.status]} border-0 text-xs font-semibold px-3 py-1`}
                    >
                      {STATUS_LABELS[order.status]}
                    </Badge>
                    <span className="font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  {order.items.map((item) => (
                    <span key={item.productId} className="mr-3">
                      × {Number(item.quantity)} ({item.productId.slice(-6)})
                    </span>
                  ))}
                </div>

                {nextStatuses.length > 0 && (
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground font-medium">
                      Update Status:
                    </span>
                    <Select
                      onValueChange={(v) =>
                        handleStatusChange(order.id, v as OrderStatus)
                      }
                      disabled={updatingId === order.id}
                    >
                      <SelectTrigger
                        className="w-48 h-8 text-xs"
                        data-ocid={`admin.select.${i + 1}`}
                      >
                        <SelectValue placeholder="Change status..." />
                      </SelectTrigger>
                      <SelectContent>
                        {nextStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updatingId === order.id && (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        Updating...
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
