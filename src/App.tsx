import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  ExternalLink,
  PackageSearch,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoCheckoutdulu from "./assets/logo_checkoutdulu.png";

/* ============================================================
   DATA PRODUK — EDIT DI SINI
   - price    : angka (rupiah), kategori badge & tab otomatis dari harga
   - image    : URL gambar produk (ganti dengan gambar asli)
   - shopeeUrl: link affiliate Shopee kamu
   ============================================================ */
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  shopeeUrl: string;
};

const PRODUCTS: Product[] = [];

/* ============================================================
   PROFIL
   ============================================================ */
const PROFILE = {
  name: "checkoutdulu",
  username: "@checkoutaja_dulu",
  bio: "Racun Shopee worth it per budget 🛒 | Rekomendasi di bawah 20rb, 50rb, & 100rb",
  avatar: logoCheckoutdulu,
  threadsUrl: "https://www.threads.net/@checkoutaja_dulu",
};

/* ============================================================
   HELPER
   ============================================================ */
type Tier = "20" | "50" | "100";
type Filter = "all" | Tier;

const TIER_LABEL: Record<Tier, string> = {
  "20": "< 20rb",
  "50": "< 50rb",
  "100": "< 100rb",
};

// Kategori eksklusif: <20rb | 20–49rb | 50–99rb
const getTier = (price: number): Tier | null => {
  if (price < 20000) return "20";
  if (price < 50000) return "50";
  if (price < 100000) return "100";
  return null;
};

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ============================================================
   KOMPONEN
   ============================================================ */
export default function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchTier = filter === "all" || getTier(p.price) === filter;
      return matchName && matchTier;
    });
  }, [query, filter]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-background">
      <div className="mx-auto w-full max-w-md px-4 pb-16 pt-10">
        {/* Header Profil */}
        <header className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={PROFILE.avatar} alt={PROFILE.name} />
            <AvatarFallback className="text-xl font-semibold">
              CD
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            {PROFILE.name}
          </h1>

          <a
            href={PROFILE.threadsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge variant="secondary" className="mt-2 cursor-pointer">
              {PROFILE.username}
            </Badge>
          </a>

          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {PROFILE.bio}
          </p>
        </header>

        {/* Search */}
        <div className="relative mt-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="h-11 rounded-full bg-white pl-10"
            aria-label="Cari produk"
          />
        </div>

        {/* Budget Filter */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as Filter)}
          className="mt-4"
        >
          <TabsList className="grid h-11 w-full grid-cols-4">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="20">&lt; 20rb</TabsTrigger>
            <TabsTrigger value="50">&lt; 50rb</TabsTrigger>
            <TabsTrigger value="100">&lt; 100rb</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Daftar Produk */}
        {filtered.length > 0 ? (
          <section className="mt-6 grid grid-cols-2 gap-3">
            {filtered.map((product) => {
              const tier = getTier(product.price);
              return (
                <Card
                  key={product.id}
                  className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {tier && (
                      <Badge className="absolute left-2 top-2 bg-orange-500 text-white hover:bg-orange-500">
                        {TIER_LABEL[tier]}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="flex-1 space-y-1 p-3">
                    <h2 className="line-clamp-2 text-sm font-medium leading-snug">
                      {product.name}
                    </h2>
                    <p className="text-base font-bold text-orange-600">
                      {formatRupiah(product.price)}
                    </p>
                  </CardContent>

                  <CardFooter className="p-3 pt-0">
                    <Button
                      size="sm"
                      className="w-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <a
                        href={product.shopeeUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                      >
                        <ShoppingCart className="mr-1.5 h-4 w-4" />
                        Cek di Shopee
                        <ExternalLink className="ml-1.5 h-3 w-3 opacity-70" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </section>
        ) : (
          <div className="mt-16 flex flex-col items-center text-center text-muted-foreground">
            <PackageSearch className="h-10 w-10" />
            <p className="mt-3 text-sm font-medium">Produk tidak ditemukan</p>
            <p className="text-xs">
              Coba kata kunci atau kategori budget lain.
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 space-y-1 text-center text-xs text-muted-foreground">
          <p>
            Beberapa link adalah link afiliasi. Harga bisa berubah
            sewaktu-waktu.
          </p>
          <p>
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
        </footer>
      </div>
    </main>
  );
}
