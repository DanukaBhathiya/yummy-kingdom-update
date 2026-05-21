import ProductCard from "@/components/shared/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllCategories, getAllProducts } from "@/lib/actions/product.actions";
import Link from "next/link";
import {
  CakeSlice,
  GlassWater,
  Pizza,
  Sandwich,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

const prices = [
  {
    name: "Rs. 500 to Rs. 1,500",
    value: "500-1500",
  },
  {
    name: "Rs. 1,501 to Rs. 2,500",
    value: "1501-2500",
  },
  {
    name: "Rs. 2,501 to Rs. 3,500",
    value: "2501-3500",
  },
  {
    name: "Rs. 3,501 to Rs. 4,500",
    value: "3501-4500",
  },
  {
    name: "Rs. 4,501 to Rs. 6,500",
    value: "4501-6500",
  },
];

const ratings = [4, 3, 2, 1];
const sortOrders = ["newest", "lowest", "highest", "rating"];

const orderModeUi = {
  deliver: {
    label: "Delivery",
    icon: Truck,
  },
  collect: {
    label: "Takeaway",
    icon: ShoppingBag,
  },
  dinein: {
    label: "Dine-in",
    icon: UtensilsCrossed,
  },
} as const;

const quickOrderTabs = [
  {
    label: "Deals",
    href: "/offers",
    icon: Tag,
  },
  {
    label: "Pizza",
    href: "/search?q=pizza",
    icon: Pizza,
  },
  {
    label: "Sides",
    href: "/search?category=Sides",
    icon: Sandwich,
  },
  {
    label: "Drinks",
    href: "/search?category=Beverages",
    icon: GlassWater,
  },
  {
    label: "Desserts",
    href: "/search?category=Desserts",
    icon: CakeSlice,
  },
] as const;

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const { q = "all", category = "all", price = "all", rating = "all" } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet = category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ""}
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  }

  return {
    title: "Search",
  };
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
    mode?: "deliver" | "collect" | "dinein";
    loc?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
    mode = "deliver",
    loc = "",
  } = await props.searchParams;

  const safeMode = ["deliver", "collect", "dinein"].includes(mode)
    ? (mode as "deliver" | "collect" | "dinein")
    : "deliver";
  const modeMeta = orderModeUi[safeMode];

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
    m,
    l,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
    m?: "deliver" | "collect" | "dinein";
    l?: string;
  }) => {
    const params = { q, category, price, rating, sort, page, mode: safeMode, loc };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (m) params.mode = m;
    if (typeof l !== "undefined") params.loc = l;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  const hasActiveFilters =
    (q !== "all" && q !== "") ||
    (category !== "all" && category !== "") ||
    price !== "all" ||
    rating !== "all";

  const activeFilters = [
    q !== "all" && q !== "" ? `Search: ${q}` : null,
    category !== "all" && category !== "" ? `Category: ${category}` : null,
    price !== "all" ? `Price: ${price}` : null,
    rating !== "all" ? `Rating: ${rating}+` : null,
  ].filter(Boolean) as string[];

  const filterLinkClass = (active: boolean) =>
    cn(
      "block rounded-lg px-3 py-2 text-sm transition-colors",
      active ? "bg-[#ed1c24] font-semibold text-white shadow-sm" : "text-[#23201f] hover:bg-[#fff2f3]"
    );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <modeMeta.icon className="h-4 w-4" />
              {modeMeta.label} Mode
            </div>
            <h1 className="mt-2 text-4xl font-black leading-none tracking-tight text-[#1a1717]">Order Now</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {loc ? `Location: ${loc}` : "Set your location from the home page for local deals."}
            </p>
          </div>

          <Button asChild className="h-11 rounded-xl bg-[#ed1c24] px-5 text-sm font-bold hover:bg-[#d3161d]">
            <Link href="/">Change Mode or Location</Link>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {quickOrderTabs.map((tab) => (
            <Link
              key={tab.label}
              href={`${tab.href}${tab.href.includes("?") ? "&" : "?"}mode=${safeMode}${loc ? `&loc=${encodeURIComponent(loc)}` : ""}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#1a1717] transition-colors hover:border-[#ed1c24] hover:text-[#ed1c24]"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1717]">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pizza Category</h3>
                <ul className="space-y-1">
                  <li>
                    <Link className={filterLinkClass(category === "all" || category === "")} href={getFilterUrl({ c: "all" })}>
                      Any
                    </Link>
                  </li>
                  {categories.map((item) => (
                    <li key={item.category}>
                      <Link
                        className={filterLinkClass(category === item.category)}
                        href={getFilterUrl({ c: item.category })}
                      >
                        {item.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</h3>
                <ul className="space-y-1">
                  <li>
                    <Link className={filterLinkClass(price === "all")} href={getFilterUrl({ p: "all" })}>
                      Any
                    </Link>
                  </li>
                  {prices.map((item) => (
                    <li key={item.value}>
                      <Link className={filterLinkClass(price === item.value)} href={getFilterUrl({ p: item.value })}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer Ratings</h3>
                <ul className="space-y-1">
                  <li>
                    <Link className={filterLinkClass(rating === "all")} href={getFilterUrl({ r: "all" })}>
                      Any
                    </Link>
                  </li>
                  {ratings.map((item) => (
                    <li key={item}>
                      <Link className={filterLinkClass(rating === item.toString())} href={getFilterUrl({ r: `${item}` })}>
                        {item} stars & up
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {hasActiveFilters ? (
                  activeFilters.map((item) => (
                    <Badge key={item} variant="outline" className="rounded-full border-[#f5c6c8] bg-[#fff6f7] px-3 py-1 text-[#8c1d22]">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No filters selected</span>
                )}
                {hasActiveFilters && (
                  <Button asChild variant="link" className="h-auto px-1 text-[#ed1c24]">
                    <Link href="/search">Clear all</Link>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Sort by</span>
                <div className="flex flex-wrap gap-2">
                  {sortOrders.map((item) => (
                    <Link
                      key={item}
                      href={getFilterUrl({ s: item })}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm capitalize transition-colors",
                        sort === item
                          ? "border-[#ed1c24] bg-[#ed1c24] text-white"
                          : "border-black/10 bg-white text-[#1a1717] hover:border-[#ed1c24] hover:text-[#ed1c24]"
                      )}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {products.data.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-[#1a1717]">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try changing your category, price range, or rating filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
