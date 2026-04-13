import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProduct,
} from "@/lib/actions/product.actions";
import HomePromoBanner from "@/components/shared/home/home-promo-banner";
import HomeOffersGrid from "@/components/shared/home/home-offers-grid";

const Homepage = async () => {
  const latestProducts = await getLatestProduct();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <HomePromoBanner />
      </div>
      <HomeOffersGrid />
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title="Popular Pizza Picks" />
      <ViewAllProductButton />
    </>
  );
};

export default Homepage;
