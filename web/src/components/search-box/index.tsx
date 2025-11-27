import { SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "../ui/input";

export default function SearchBox() {
  const [search, setSearch] = useQueryState("search");
  const [value, setValue] = useState(search ?? "");
  const [debounced] = useDebounceValue(value, 500);

  useEffect(() => {
    setSearch(debounced || null); // avoid empty string in query
  }, [debounced, setSearch]);

  return (
    <div className="flex items-center w-full rounded-full bg-input/50 px-4 py-1 min-w-md">
      <SearchIcon className="text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="border-none focus-visible:ring-0 bg-transparent! w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
