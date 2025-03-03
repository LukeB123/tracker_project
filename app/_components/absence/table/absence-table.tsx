"use client";

import { useState } from "react";

import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceTableEntry from "@/app/_components/absence/table/absence-table-entry";
import AbsenceTableHeader from "@/app/_components/absence/table/absence-table-header";

interface AbsenceTableProps {
  absenceRequests: TAbsenceRequestProps[];
}

export default function AbsenceTable({ absenceRequests }: AbsenceTableProps) {
  const [openRequestId, setOpenRequestId] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<
    ("Pending" | "Approved" | "Declined" | "Cancelled")[]
  >(["Pending", "Approved"]);

  const filteredAbsenceRequests = absenceRequests.filter((request) =>
    statusFilter.includes(request.status)
  );

  return (
    <div className="flex justify-center">
      <AbsenceTableHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      >
        <ul className="w-full">
          {absenceRequests.map((request) => (
            <AbsenceTableEntry
              key={request.id}
              request={request}
              expanded={openRequestId === request.id}
              setOpenRequestId={setOpenRequestId}
              hidden={
                !filteredAbsenceRequests
                  .map((filteredRequest) => filteredRequest.id)
                  .includes(request.id)
              }
            />
          ))}
        </ul>
      </AbsenceTableHeader>
    </div>
  );
}
