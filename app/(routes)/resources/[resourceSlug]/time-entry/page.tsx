import { Suspense } from "react";

import TimeEntries from "@/app/_components/time-entries/time-entries";
import Icon from "@/app/_components/icons/icons";

import {
  TProjectResourcesProps,
  TTimeEntriesProps,
  getProjectResourcesByResource,
  getResourcesTimeEntries,
} from "@/util/time-entries";
import { TWeekProps, getWeeks } from "@/util/date";

interface ParamsProp {
  params: { resourceSlug: string };
  // children: React.ReactNode;
}

interface FetchedTimeEntriesProps {
  initialProjectResources: TProjectResourcesProps[];
  weeks: TWeekProps[];
}

async function FetchedTimeEntries({
  initialProjectResources,
  weeks,
}: FetchedTimeEntriesProps) {
  const resourceIds = initialProjectResources.map((entry) => entry.resource_id);

  let initialTimeEntries: TTimeEntriesProps[] = [];

  try {
    if (resourceIds.length > 0) {
      initialTimeEntries = await getResourcesTimeEntries(
        resourceIds,
        weeks.map((week) => week.week_commencing)
      );
    }

    return (
      <TimeEntries
        context="resource"
        initialProjectResources={initialProjectResources}
        weeks={weeks}
        initialTimeEntries={initialTimeEntries}
        initialTimeEntriesIsLoading={false}
      />
    );
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Time Entries.
      </p>
    );
  }
}

async function FetchedProjectResources({ params }: ParamsProp) {
  try {
    const initialProjectResources = await getProjectResourcesByResource(
      +params.resourceSlug
    );

    const weeks = await getWeeks();

    return (
      <Suspense
        fallback={
          <TimeEntries
            context="resource"
            initialProjectResources={initialProjectResources}
            weeks={weeks}
            initialTimeEntries={[]}
            initialTimeEntriesIsLoading={true}
          />
        }
      >
        <FetchedTimeEntries
          initialProjectResources={initialProjectResources}
          weeks={weeks}
        />
      </Suspense>
    );
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Project Resource Details
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
        Fetching Project Resource Details...
      </p>
    </div>
  );
}

export default function ResourceTimeEntries({ params }: ParamsProp) {
  return (
    <Suspense fallback={<LoadingProjectResources />}>
      <FetchedProjectResources params={params} />
    </Suspense>
  );
}
