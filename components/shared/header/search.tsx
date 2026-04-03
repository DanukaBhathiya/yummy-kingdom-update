import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-[460px] items-center gap-2">
        <Select name="category">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              All
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="w-[200px]"
        />
        <Button size="icon" aria-label="Search">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
