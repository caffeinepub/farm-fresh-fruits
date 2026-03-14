import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAvailableProducts } from "../hooks/useQueries";

const SAMPLE_PRODUCTS = [
  {
    id: "s1",
    name: "Alphonso Mangoes",
    description:
      "The king of mangoes. Sun-ripened, incredibly sweet, and aromatic.",
    price: 299n,
    unit: "kg",
    stockQuantity: 50n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s2",
    name: "Garden Strawberries",
    description:
      "Hand-picked at peak ripeness. Bursting with natural sweetness.",
    price: 149n,
    unit: "250g",
    stockQuantity: 30n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s3",
    name: "Thompson Seedless Grapes",
    description: "Crisp, sweet, and seedless. Freshly harvested.",
    price: 89n,
    unit: "500g",
    stockQuantity: 60n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s4",
    name: "Sugar Watermelon",
    description: "Enormous and cool, with deep red flesh. Perfect for summer.",
    price: 45n,
    unit: "kg",
    stockQuantity: 20n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s5",
    name: "Cavendish Bananas",
    description:
      "Sweet, creamy, and perfectly ripe. Great for breakfast or smoothies.",
    price: 59n,
    unit: "dozen",
    stockQuantity: 80n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s6",
    name: "Fuji Apples",
    description:
      "Crunchy, aromatic and naturally sweet. Grown in cool highland orchards.",
    price: 199n,
    unit: "kg",
    stockQuantity: 40n,
    isAvailable: true,
    imageId: undefined,
  },
];

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name", value: "name" },
];

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

export default function Shop() {
  const { data: products, isLoading } = useAvailableProducts();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  const allProducts =
    products && products.length > 0 ? products : SAMPLE_PRODUCTS;

  const filtered = useMemo(() => {
    let list = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );
    if (sort === "price-asc")
      list = [...list].sort((a, b) => Number(a.price - b.price));
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => Number(b.price - a.price));
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [allProducts, search, sort]);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
          Our Products
        </span>
        <h1 className="font-display text-4xl font-bold mb-2">
          Fresh Fruit Shop
        </h1>
        <p className="text-muted-foreground">
          All fruits harvested within 24 hours of your order.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search fruits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="shop.search_input"
          />
        </div>
        <div className="flex gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground self-center" />
          {SORT_OPTIONS.map((o) => (
            <Button
              key={o.value}
              variant={sort === o.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSort(o.value)}
              data-ocid="shop.tab"
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          data-ocid="shop.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="shop.empty_state">
          <div className="text-5xl mb-4">🍃</div>
          <h3 className="font-display text-2xl font-bold mb-2">
            No fruits found
          </h3>
          <p className="text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.06 }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
