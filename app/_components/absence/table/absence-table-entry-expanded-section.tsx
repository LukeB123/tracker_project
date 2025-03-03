import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceTableEntryApproverButtons from "@/app/_components/absence/table/absence-table-entry-approver-buttons";
import AbsenceTableEntryCancelButton from "@/app/_components/absence/table/absence-table-entry-cancel-button";

interface AbsenceTableEntryExpandedSectionProps {
  request: TAbsenceRequestProps;
}

const todayDate = new Date().toISOString().slice(0, 10);

export default function AbsenceTableEntryExpandedSection({
  request,
}: AbsenceTableEntryExpandedSectionProps) {
  const approverClass = request.status === "Pending" ? "" : "hidden";

  const cancelClass =
    request.status === "Pending" ||
    (request.status === "Approved" && request.start_of_absence >= todayDate)
      ? ""
      : "hidden";

  return (
    <div className="py-2">
      <p className="text-sm text-left">
        Duration Type :{" "}
        <span className="text-purple-700 font-semibold">
          {request.absence_duration}
        </span>
      </p>
      <p className="text-sm text-left">
        Absence Type :{" "}
        <span className="text-purple-700 font-semibold">
          {request.absence_type}
        </span>
      </p>
      <div className={approverClass}>
        <AbsenceTableEntryApproverButtons request={request} />
      </div>
      <div className={cancelClass}>
        <AbsenceTableEntryCancelButton request={request} />
      </div>
    </div>
  );
}
