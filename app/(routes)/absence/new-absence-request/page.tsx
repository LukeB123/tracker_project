import { Suspense } from "react";

import { getResourcesFromServer } from "@/server/actions/data-fetches";

import AbsenceForm from "@/app/_components/absence/new-entry-form/absence-form";
import Icon from "@/app/_components/ui/icons";

async function FetchedResources() {
  try {
    const resources = await getResourcesFromServer();

    return <AbsenceForm resources={resources} />;
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Resource Details
      </p>
    );
  }
}

function LoadingProjectResources() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="animate-spin">
        <Icon iconName="loading" color="#5f249f" height="20px" width="20px" />
      </div>
      <p className="text-center p-2 text-purple-700 font-semibold flex">
        Fetching Resource Details...
      </p>
    </div>
  );
}

export default function AbsencePage() {
  return (
    <Suspense fallback={<LoadingProjectResources />}>
      <FetchedResources />
    </Suspense>
  );
}
