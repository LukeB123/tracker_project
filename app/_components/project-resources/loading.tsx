import TableHeader from "@/app/_components/project-resources/table-header";

import Icon from "@/app/_components/ui/icons";

interface LoadingParams {
  context: "project" | "resource";
}

export default function Loading({ context }: LoadingParams) {
  return (
    <>
      <TableHeader disableSearchBar context={context}>
        <div className="mt-1 flex justify-center items-center gap-2">
          <div className="animate-spin">
            <Icon
              iconName="loading"
              color="#5f249f"
              height="20px"
              width="20px"
            />
          </div>
          <p className="text-purple-700 font-semibold">
            Fetching {context === "project" ? "Projects" : "Resources"}...
          </p>
        </div>
      </TableHeader>
    </>
  );
}
