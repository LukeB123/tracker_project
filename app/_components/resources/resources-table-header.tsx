import SearchBar from "@/app/_components/search-bar";

interface ResourcesTableHeaderParams {
  search?: string;
  handleSearchChange?: (searchString: string) => void;
  disableSearchBar?: boolean;
  children: React.ReactNode;
}

export default function ResourcesTableHeader({
  search = "",
  handleSearchChange,
  disableSearchBar = false,
  children,
}: ResourcesTableHeaderParams) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-1/3 min-w-96">
        <div className="bg-white pt-6 fixed w-1/3 min-w-96">
          <div className="h-10 mb-4">
            <SearchBar
              label="Resources"
              value={search}
              onChange={handleSearchChange}
              disabled={disableSearchBar}
            />
          </div>
          <div className="flex justify-between items-center bg-purple-600 text-grey-50 px-2 py-2 rounded-t-md text-lg font-semibold">
            <p>Resource Name:</p>
            <p>Role:</p>
          </div>
        </div>
        <div className="h-32" />
        {children}
      </div>
    </div>
  );
}
