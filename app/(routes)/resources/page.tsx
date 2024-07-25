import { Suspense } from "react";

import LoadingResources from "@/app/_components/resources/loading-resources";
import Resources from "@/app/_components/resources/resources";

import { getResources } from "@/util/resources";

async function FetchedResources() {
  try {
    const resources = await getResources();

    return <Resources resources={resources} />;
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Resources.
      </p>
    );
  }
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingResources />}>
      <FetchedResources />
    </Suspense>
  );
}
