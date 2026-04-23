import HomePromoBanner from "@/components/shared/home/home-promo-banner";
import StartOrder from "@/components/shared/home/start-order";

const Homepage = async () => {
  return (
    <>
      <div className="relative left-1/2 right-1/2 -mt-5 -ml-[50vw] -mr-[50vw] w-screen">
        <HomePromoBanner />
      </div>
      <div className="relative left-1/2 right-1/2 z-20 -mt-20 -ml-[50vw] -mr-[50vw] w-screen px-4 pb-10 md:-mt-24 md:px-8 lg:-mt-28">
        <StartOrder variant="overlay" />
      </div>
    </>
  );
};

export default Homepage;
