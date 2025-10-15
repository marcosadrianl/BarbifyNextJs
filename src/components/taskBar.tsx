import SearchBar from "@/components/searchBar";
import Breadcrumbs from "@/components/breadcrumbs";
export default function TaskBar() {
  return (
    <div className="flex flex-col justify-between items-center p-2">
      <div className="flex w-fit">
        <SearchBar />
      </div>
      <div className="z-10 w-96 self-start">
        <Breadcrumbs />
      </div>
    </div>
  );
}
