import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";

function formatPrice(price: bigint): string {
  return `₹${Number(price)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="cart.empty_state"
      >
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-bold mb-3">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Add some fresh fruits to get started!
        </p>
        <Button asChild size="lg" data-ocid="cart.primary_button">
          <Link to="/shop">
            Browse Fruits <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
        Your Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center"
                data-ocid={`cart.item.${i + 1}`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={
                      item.product.imageId?.getDirectURL() ??
                      [
                        "/assets/generated/fruit-mango.dim_600x600.jpg",
                        "/assets/generated/fruit-strawberry.dim_600x600.jpg",
                        "/assets/generated/fruit-grapes.dim_600x600.jpg",
                        "/assets/generated/fruit-watermelon.dim_600x600.jpg",
                        "/assets/generated/fruit-banana.dim_600x600.jpg",
                        "/assets/generated/fruit-apple.dim_600x600.jpg",
                      ][i % 6]
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.product.price)} / {item.product.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    data-ocid={`cart.secondary_button.${i + 1}`}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    data-ocid={`cart.primary_button.${i + 1}`}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-primary">
                    {formatPrice(item.product.price * BigInt(item.quantity))}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-destructive hover:text-destructive/80 mt-1"
                    data-ocid={`cart.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(item.product.price * BigInt(item.quantity))}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span className="text-primary">{formatPrice(totalAmount)}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => navigate({ to: "/checkout" })}
            data-ocid="cart.primary_button"
          >
            <ShoppingBag className="mr-2 w-4 h-4" />
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </main>
  );
}
