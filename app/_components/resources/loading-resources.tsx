import Icon from "@/app/_components/icons/icons";
import ResourcesTableHeader from "@/app/_components/resources/resources-table-header";

export default function LoadingResources() {
  return (
    <>
      <ResourcesTableHeader disableSearchBar>
        <div className="mt-1 flex justify-center items-center gap-2">
          <div className="animate-spin">
            <Icon
              iconName="loading"
              color="#5f249f"
              height="20px"
              width="20px"
            />
          </div>
          <p className="text-purple-700 font-semibold">Fetching Resources...</p>
        </div>
      </ResourcesTableHeader>
    </>
  );
}
