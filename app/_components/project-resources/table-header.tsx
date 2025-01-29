import SearchBar from "@/app/_components/ui/search-bar";

interface TableHeaderParams {
  search?: string;
  handleSearchChange?: (searchString: string) => void;
  disableSearchBar?: boolean;
  children: React.ReactNode;
  context: "project" | "resource";
}

export default function TableHeader({
  search = "",
  handleSearchChange,
  disableSearchBar = false,
  children,
  context,
}: TableHeaderParams) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-1/3 min-w-96">
        <div className="bg-white pt-6 fixed w-1/3 min-w-96">
          <div className="h-10 mb-4">
            <SearchBar
              label={context === "project" ? "Projects" : "Resources"}
              value={search}
              onChange={handleSearchChange}
              disabled={disableSearchBar}
            />
          </div>
          <div className="flex justify-between items-center bg-purple-600 text-grey-50 px-2 py-2 rounded-t-md text-lg font-semibold">
            <p>{context === "project" ? "Project Title:" : "Resource Name:"}</p>
            <p>{context === "project" ? "Last Updated:" : "Role:"}</p>
          </div>
        </div>
        <div className="h-32" />
        {children}
      </div>
    </div>
  );
}
