import { Suspense } from "react";

import {
  getProjectResourcesByProjectSlugFromServer,
  getResourcesAbsenceTimeEntriesFromServer,
  getResourcesTimeEntriesFromServer,
  getWeeksFromServer,
  TAbsenceTimeEntriesProps,
  TProjectResourcesProps,
  TTimeEntriesProps,
  TWeekProps,
} from "@/server/actions/data-fetches";

import TimeEntries from "@/app/_components/time-entries/time-entries";
import Icon from "@/app/_components/ui/icons";

interface ParamsProp {
  params: { projectSlug: string };
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

  let absenceTimeEntries: TAbsenceTimeEntriesProps[] = [];

  try {
    if (resourceIds.length > 0) {
      initialTimeEntries = await getResourcesTimeEntriesFromServer(
        resourceIds,
        weeks.map((week) => week.week_commencing)
      );

      absenceTimeEntries = await getResourcesAbsenceTimeEntriesFromServer(
        resourceIds,
        weeks.map((week) => week.week_commencing)
      );
    }

    return (
      <TimeEntries
        context="project"
        initialProjectResources={initialProjectResources}
        weeks={weeks}
        initialTimeEntries={initialTimeEntries}
        absenceTimeEntries={absenceTimeEntries}
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
    const initialProjectResources =
      await getProjectResourcesByProjectSlugFromServer(params.projectSlug);

    const weeks = await getWeeksFromServer();

    return (
      <Suspense
        fallback={
          <TimeEntries
            context="project"
            initialProjectResources={initialProjectResources}
            weeks={weeks}
            initialTimeEntries={[]}
            absenceTimeEntries={[]}
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

export default function ProjectTimeEntries({ params }: ParamsProp) {
  return (
    <Suspense fallback={<LoadingProjectResources />}>
      <FetchedProjectResources params={params} />
    </Suspense>
  );
}
