import SearchBar from "@/app/_components/search-bar";

interface ProjectsTableHeaderParams {
  search?: string;
  handleSearchChange?: any;
  disableSearchBar?: boolean;
  children: React.ReactNode;
}

export default function ProjectsTableHeader({
  search = "",
  handleSearchChange = null,
  disableSearchBar = false,
  children,
}: ProjectsTableHeaderParams) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-1/3 min-w-96">
        <div className="bg-white pt-6 fixed w-1/3 min-w-96">
          <div className="h-10 mb-4">
            <SearchBar
              label="Projects"
              value={search}
              onChange={handleSearchChange}
              disabled={disableSearchBar}
            />
          </div>
          <div className="flex justify-between items-center bg-purple-600 text-grey-50 px-2 py-2 rounded-t-md text-lg font-semibold">
            <p>Project Title:</p>
            <p>Last Updated:</p>
          </div>
        </div>
        <div className="h-32" />
        {children}
      </div>
    </div>
  );
}
