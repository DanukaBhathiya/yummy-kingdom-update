export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Yummy Kingdom";
export const APP_LOGO = "/images/logo.png";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "We deliver a wide range of Delicious Italian food with the Hidden secrets in the kingdom.";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const AUTH_SIDE_IMAGE =
  process.env.NEXT_PUBLIC_AUTH_SIDE_IMAGE || "/images/img1.jpg";
export const AUTH_SIDE_IMAGE_ALT =
  process.env.NEXT_PUBLIC_AUTH_SIDE_IMAGE_ALT || `${APP_NAME} promo`;
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const SHOP_TAGLINE =
  "We deliver a wide range of Delicious Italian food with the Hidden secrets in the kingdom.";
export const SHOP_ADDRESS =
  "220/C Batagama north, Ja-Ela, Ja-Ela, Sri Lanka, 11350";
export const SHOP_CONTACT = "076 644 1569";
export const SHOP_WHATSAPP = "076 644 1569";
export const SHOP_EMAIL = "yummykingdom21@gmail.com";
export const SHOP_FACEBOOK = "https://web.facebook.com/yummykingdom.lk";
export const SHOP_CITY = "Ja-Ela";
export const SHOP_COUNTRY = "Sri Lanka";
export const SHOP_MAP_EMBED_URL =
  "https://www.google.com/maps?q=220/C%20Batagama%20north%2C%20Ja-Ela%2C%20Sri%20Lanka%2C%2011350&output=embed";
export const SHOP_GOOGLE_MAPS_URL =
  "https://maps.google.com/?q=220/C%20Batagama%20north%2C%20Ja-Ela%2C%20Sri%20Lanka%2C%2011350";
export const DELIVERY_ZONES = [
  {
    name: "Ja-Ela Inner Zone",
    cities: ["ja-ela", "ja ela", "batagama", "ekala", "kandana"],
    fee: 250,
    eta: "25-40 mins",
  },
  {
    name: "Nearby Zone",
    cities: ["seeduwa", "ragama", "wattala", "negombo"],
    fee: 450,
    eta: "40-55 mins",
  },
  {
    name: "Extended Zone",
    cities: ["gampaha", "minuwangoda", "katunayake", "kelaniya"],
    fee: 650,
    eta: "55-75 mins",
  },
] as const;
export const DEFAULT_DELIVERY_FEE = 850;
export const TAX_RATE = 0.08;
export const FREE_DELIVERY_ORDER_THRESHOLD = 10000;
export const PIZZA_CATEGORIES = [
  "Classic Pizza",
  "Signature Pizza",
  "Chicken Pizza",
  "Veggie Pizza",
  "Pasta",
  "Sides",
  "Desserts",
  "Beverages",
] as const;

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefultValues = {
  fullName: "",
  streetAddress: "",
  city: SHOP_CITY,
  postalCode: "",
  country: SHOP_COUNTRY,
};

const SUPPORTED_PAYMENT_METHODS = ["PayPal", "Stripe", "CashOnDelivery"];

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ").filter((method) =>
      SUPPORTED_PAYMENT_METHODS.includes(method)
    )
  : SUPPORTED_PAYMENT_METHODS;
export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS.includes(
  process.env.DEFAULT_PAYMENT_METHOD || ""
)
  ? (process.env.DEFAULT_PAYMENT_METHOD as string)
  : "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 6;

export const productDefualtValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: APP_NAME,
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = ["admin", "user"];

export const reviewForDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};
