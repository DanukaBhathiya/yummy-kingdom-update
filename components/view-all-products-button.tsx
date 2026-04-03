import Link from "next/link";
import { Button } from "./ui/button";

const ViewAllProductButton = () => {
    return ( 
        <div className="flex justify-center items-center my-8">
            <Button asChild className="px-8 py-4 text-lg font-semibold animate-glow-pulse">
                <Link href="/search">View Full Menu 🍽️</Link>
            </Button>
        </div>
     );
}
 
export default ViewAllProductButton;
