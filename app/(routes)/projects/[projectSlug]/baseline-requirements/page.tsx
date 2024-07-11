import Icon from "@/app/_components/icons/icons";
import BaselineInput from "@/app/_components/baseline/baseline";
import { getWeeks } from "@/util/date";
import { getResources } from "@/util/people";
import { Suspense } from "react";

async function FetchedResources() {
  try {
    const resources = await getResources();

    const weeks = await getWeeks();

    return <BaselineInput resources={resources} weeks={weeks} />;
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

export default function ProjectTimeEntries() {
  return (
    <Suspense fallback={<LoadingProjectResources />}>
      <FetchedResources />
    </Suspense>
  );
}
