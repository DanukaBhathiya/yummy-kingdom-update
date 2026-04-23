import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import {
  CakeSlice,
  GlassWater,
  Pizza,
  Sandwich,
  ShoppingBag,
  Tag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

const prices = [
  {
    name: "Rs. 500 to Rs. 1,500",
    Value: "500-1500",
  },
  {
    name: "Rs. 1,501 to Rs. 2,500",
    Value: "1501-2500",
  },
  {
    name: "Rs. 2,501 to Rs. 3,500",
    Value: "2501-3500",
  },
  {
    name: "Rs. 3,501 to Rs. 4,500",
    Value: "3501-4500",
  },
  {
    name: "Rs. 4,501 to Rs. 6,500",
    Value: "4501-6500",
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
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
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

  } else {
    return {
      title: "Search",
    };
  }
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

  //Construct filter URL
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

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-white/90 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <modeMeta.icon className="h-4 w-4" />
              {modeMeta.label} Mode
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-black tracking-tight">
              Order Now
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loc ? `Location: ${loc}` : "Set your location from the home page for local deals."}
            </p>
          </div>
          <Button asChild>
            <Link href="/">Change Mode or Location</Link>
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickOrderTabs.map((tab) => (
            <Button key={tab.label} asChild variant="outline" size="sm" className="rounded-full">
              <Link href={`${tab.href}${tab.href.includes("?") ? "&" : "?"}mode=${safeMode}${loc ? `&loc=${encodeURIComponent(loc)}` : ""}`}>
                {tab.icon ? (
                  <span className="inline-flex items-center gap-1.5">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                ) : (
                  tab.label
                )}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/*Category Links */}
        <div className="text-xl mb-2 mt-3">Pizza Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/*Price Links */}
        <div className="text-xl mb-2 mt-4">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.Value}>
                <Link
                  className={`${price === p.Value && "font-bold"}`}
                  href={getFilterUrl({ p: p.Value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/*Rating Links */}
        <div className="text-xl mb-2 mt-3">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flext-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && "Category: " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Rating: " + rating + " & up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* Sort */}
            Sort by{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort == s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length == 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SearchPage;
