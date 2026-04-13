import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductButton from "@/components/view-all-products-button";
import {
  getFeaturedProducts,
  getLatestProduct,
} from "@/lib/actions/product.actions";
import HomePromoBanner from "@/components/shared/home/home-promo-banner";
import StartOrder from "@/components/shared/home/start-order";
import HomeOffersGrid from "@/components/shared/home/home-offers-grid";
import ReviewRedirectPopup from "@/components/shared/home/review-redirect-popup";

const Homepage = async () => {
  const latestProducts = await getLatestProduct();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <ReviewRedirectPopup />
      <div className="relative -mt-5 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <HomePromoBanner />
      </div>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-white">
        <StartOrder />
      </div>
      <HomeOffersGrid />
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title="Popular Pizza Picks" />
      <ViewAllProductButton />
    </>
  );
};

export default Homepage;
