// SearchBar.tsx
import { BsSearch } from "react-icons/bs";

const SearchBar = () => (
  <div className="search-bar rounded-full">
    <BsSearch />
    <input
      type="text"
      placeholder="Search for chat or user"
      className="bg-white w-full"
    />
  </div>
);

export default SearchBar;
