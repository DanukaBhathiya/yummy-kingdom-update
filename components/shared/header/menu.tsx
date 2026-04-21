import CartButton from "./cart-button";
import UserButton from "./user-button";

const Menu = () => {
  return (
    <div className="flex items-center">
      <nav className="hidden md:flex items-center justify-end gap-2">
        <CartButton />
        <UserButton />
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <CartButton />
        <UserButton />
      </div>
    </div>
  );
};

export default Menu;
