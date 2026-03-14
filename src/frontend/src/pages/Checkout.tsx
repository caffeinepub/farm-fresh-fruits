import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";

function formatPrice(price: bigint): string {
  return `₹${Number(price)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { identity, login } = useInternetIdentity();
  const placeOrder = usePlaceOrder();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [ordered, setOrdered] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login first to place an order.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      await placeOrder.mutateAsync({
        id: generateId(),
        customerName: form.name,
        customerPhone: form.phone,
        deliveryAddress: form.address,
        status: OrderStatus.pending,
        createdAt: BigInt(Date.now()) * 1_000_000n,
        totalAmount,
        customerId: identity.getPrincipal(),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: BigInt(i.quantity),
          priceAtOrder: i.product.price,
        })),
      });
      clearCart();
      setOrdered(true);
      toast.success("Order placed successfully! 🎉");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (ordered) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="checkout.success_state"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="font-display text-3xl font-bold mb-2">
          Order Placed! 🎉
        </h2>
        <p className="text-muted-foreground mb-8">
          We've received your order and will have it delivered fresh to your
          door.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild data-ocid="checkout.primary_button">
            <Link to="/orders">View My Orders</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            data-ocid="checkout.secondary_button"
          >
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold mb-4">
          Nothing to checkout
        </h2>
        <Button asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <Button
        variant="ghost"
        asChild
        className="mb-6 -ml-2"
        data-ocid="checkout.secondary_button"
      >
        <Link to="/cart">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cart
        </Link>
      </Button>

      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-semibold text-lg">Delivery Details</h2>

          {!identity && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm">
              <p className="mb-2 font-medium">Login required to place order</p>
              <Button
                size="sm"
                onClick={login}
                type="button"
                data-ocid="checkout.primary_button"
              >
                Login Now
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              autoComplete="name"
              data-ocid="checkout.input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
              type="tel"
              autoComplete="tel"
              data-ocid="checkout.input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Full delivery address including landmark"
              required
              rows={4}
              autoComplete="street-address"
              data-ocid="checkout.textarea"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={placeOrder.isPending || !identity}
            data-ocid="checkout.submit_button"
          >
            {placeOrder.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Placing
                Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>

          {placeOrder.isError && (
            <p
              className="text-sm text-destructive"
              data-ocid="checkout.error_state"
            >
              Failed to place order. Please try again.
            </p>
          )}
        </form>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.product.price * BigInt(item.quantity))}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totalAmount)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            🚚 Free delivery on all orders
          </p>
        </div>
      </div>
    </main>
  );
}
