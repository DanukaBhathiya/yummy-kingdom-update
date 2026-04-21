import HomePromoBanner from "@/components/shared/home/home-promo-banner";
import StartOrder from "@/components/shared/home/start-order";

const Homepage = async () => {
  return (
    <>
      <div className="relative left-1/2 right-1/2 -mt-5 -ml-[50vw] -mr-[50vw] w-screen">
        <HomePromoBanner />
      </div>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <StartOrder />
      </div>
    </>
  );
};

export default Homepage;
