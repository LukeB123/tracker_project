import { Suspense } from "react";

import {
  getResourcesFromServer,
  getRolesFromServer,
  getWeeksFromServer,
} from "@/server/actions/data-fetches";

import BaselineInput from "@/app/_components/baseline/baseline-form";
import Icon from "@/app/_components/ui/icons";
async function FetchedResources() {
  try {
    const resources = await getResourcesFromServer();

    const weeks = await getWeeksFromServer();

    const roles = await getRolesFromServer();

    return <BaselineInput resources={resources} roles={roles} weeks={weeks} />;
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

export default function BaselinePage() {
  return (
    <Suspense fallback={<LoadingProjectResources />}>
      <FetchedResources />
    </Suspense>
  );
}
