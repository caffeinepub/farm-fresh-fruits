import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useAvailableProducts } from "../hooks/useQueries";

const SAMPLE_PRODUCTS = [
  {
    id: "s1",
    name: "Alphonso Mangoes",
    description:
      "The king of mangoes. Sun-ripened, incredibly sweet, and aromatic. Grown on our farm in Ratnagiri.",
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
      "Hand-picked at peak ripeness. Bursting with natural sweetness and rich berry flavor.",
    price: 149n,
    unit: "250g",
    stockQuantity: 30n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s3",
    name: "Thompson Seedless Grapes",
    description:
      "Crisp, sweet, and seedless. Freshly harvested from our vineyard rows.",
    price: 89n,
    unit: "500g",
    stockQuantity: 60n,
    isAvailable: true,
    imageId: undefined,
  },
  {
    id: "s4",
    name: "Sugar Watermelon",
    description:
      "Enormous and cool, with deep red flesh. Perfect for hot summer days.",
    price: 45n,
    unit: "kg",
    stockQuantity: 20n,
    isAvailable: true,
    imageId: undefined,
  },
];

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    desc: "No pesticides. Just sun, water, and love.",
  },
  {
    icon: Truck,
    title: "Same-Day Delivery",
    desc: "Ordered before noon? You'll have it by evening.",
  },
  {
    icon: Star,
    title: "Farm-Fresh Quality",
    desc: "Picked at peak ripeness, never in cold storage.",
  },
  {
    icon: ShieldCheck,
    title: "Money-Back Guarantee",
    desc: "Not satisfied? Full refund, no questions asked.",
  },
];

const SKELETON_KEYS = ["sk-0", "sk-1", "sk-2", "sk-3"];

export default function Home() {
  const { data: products, isLoading } = useAvailableProducts();
  const featured = (
    products && products.length > 0 ? products : SAMPLE_PRODUCTS
  ).slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <img
          src="/assets/generated/hero-farm.dim_1200x600.jpg"
          alt="Fresh farm fruits"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className="inline-block bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Direct from Our Farm
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Fresh from Our Farm
              <br />
              <span className="text-accent">to Your Home</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-md">
              No brokers. No cold storage. Just fruits plucked at sunrise,
              arriving at your door the same day.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                asChild
                data-ocid="hero.primary_button"
              >
                <Link to="/shop">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/40 text-white hover:bg-white/20"
                asChild
                data-ocid="hero.secondary_button"
              >
                <Link to="/shop">Browse All Fruits</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="farm-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
              Today's Picks
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Fresh & In Season
            </h2>
          </div>
          <Button variant="ghost" asChild data-ocid="home.secondary_button">
            <Link to="/shop" className="gap-2 flex items-center">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            data-ocid="product.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground py-16 mx-4 md:mx-8 rounded-3xl mb-16">
        <div className="text-center px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to taste the difference?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Join hundreds of happy families getting farm-fresh fruits every
            week.
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            asChild
            data-ocid="cta.primary_button"
          >
            <Link to="/shop">Start Shopping Today</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
