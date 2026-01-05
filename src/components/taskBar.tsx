import SearchBar from "@/components/searchBar";
import Breadcrumbs from "@/components/breadcrumbs";
export default function TaskBar() {
  return (
    <div className="flex flex-row justify-between  items-center p-4 border-l border-[#cebaa1]">
      <Breadcrumbs />
      <SearchBar />
    </div>
  );
}
