import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
  index: number;
}

function formatPrice(price: bigint): string {
  return `₹${Number(price)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function ProductCard({ product, index }: Props) {
  const { addItem, items, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.quantity ?? 0;

  const placeholderImages = [
    "/assets/generated/fruit-mango.dim_600x600.jpg",
    "/assets/generated/fruit-strawberry.dim_600x600.jpg",
    "/assets/generated/fruit-grapes.dim_600x600.jpg",
    "/assets/generated/fruit-watermelon.dim_600x600.jpg",
    "/assets/generated/fruit-banana.dim_600x600.jpg",
    "/assets/generated/fruit-apple.dim_600x600.jpg",
  ];

  const imageUrl =
    !imageError && product.imageId
      ? product.imageId.getDirectURL()
      : placeholderImages[index % placeholderImages.length];

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      className="bg-card rounded-xl overflow-hidden shadow-card card-hover border border-border/50 flex flex-col"
      data-ocid={`product.item.${index + 1}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
        {product.stockQuantity <= 5n && product.isAvailable && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs">
            Only {Number(product.stockQuantity)} left!
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              / {product.unit}
            </span>
          </div>

          {qty === 0 ? (
            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={!product.isAvailable}
              data-ocid={`product.primary_button.${index + 1}`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => updateQuantity(product.id, qty - 1)}
                data-ocid={`product.secondary_button.${index + 1}`}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg w-8 text-center">
                {qty}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => updateQuantity(product.id, qty + 1)}
                data-ocid={`product.primary_button.${index + 1}`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
