import Icon from "@/app/_components/ui/icons";
import { getResources } from "@/util/resources";
import { Suspense } from "react";
import AbsenceForm from "@/app/_components/absence/absence-form";
import { getAbsenceRequests } from "@/util/absence";
import Link from "next/link";
import NavButton from "@/app/_components/ui/buttons/nav-button";
import AbsenceTable from "@/app/_components/absence/absence-table";

async function FetchedResources() {
  try {
    const absenceRequests = await getAbsenceRequests();

    return <AbsenceTable absenceRequests={absenceRequests} />;
  } catch (error) {
    return (
      <p className="text-center p-2 text-purple-700 font-semibold">
        Error Fetching Resource Details
      </p>
    );
  }
}

function LoadingAbsenceRequests() {
  return (
    <div className="mt-10 flex items-center justify-center">
      <div className="animate-spin">
        <Icon iconName="loading" color="#5f249f" height="20px" width="20px" />
      </div>
      <p className="text-center p-2 text-purple-700 font-semibold flex">
        Fetching Absence Requests...
      </p>
    </div>
  );
}

export default function AbsencePage() {
  return (
    <>
      <div className="fixed w-full flex justify-center gap-4 pt-2 pb-4	font-dxc z-20 bg-white ">
        <NavButton
          href="/new-absence-request"
          path="/absence"
          label="New Absence Request"
        />
      </div>
      <div className="h-16" />
      <Suspense fallback={<LoadingAbsenceRequests />}>
        <FetchedResources />
      </Suspense>
    </>
  );
}
