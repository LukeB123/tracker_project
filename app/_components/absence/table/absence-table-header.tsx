import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceTableFilters from "@/app/_components/absence/table/absence-table-filters";

interface AbsenceTableHeaderProps {
  statusFilter: ("Pending" | "Approved" | "Declined" | "Cancelled")[];
  setStatusFilter: React.Dispatch<
    React.SetStateAction<("Pending" | "Approved" | "Declined" | "Cancelled")[]>
  >;
  children: React.ReactNode;
}

export default function AbsenceTableHeader({
  statusFilter,
  setStatusFilter,
  children,
}: AbsenceTableHeaderProps) {
  return (
    <div className="flex flex-col w-1/3 min-w-96">
      <div className="bg-white fixed w-1/3 min-w-96 z-10">
        <AbsenceTableFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex justify-between items-center bg-purple-600 text-grey-50 px-2 py-2 rounded-t-md text-lg font-semibold">
          <p>Request:</p>
          <p>Status:</p>
        </div>
      </div>
      <div className="h-18" />
      {children}
    </div>
  );
}
