import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import { useAppSelector } from "@/app/lib/hooks";

import ExpandCollapseButton from "@/app/_components/ui/buttons/expand-collapse";
import AbsenceTableEntryExpandedSection from "@/app/_components/absence/table/absence-table-entry-expanded-section";

interface AbsenceTableEntryProps {
  request: TAbsenceRequestProps;
  expanded: boolean;
  setOpenRequestId: React.Dispatch<React.SetStateAction<number | undefined>>;
  hidden: boolean;
}

export default function AbsenceTableEntry({
  request,
  expanded,
  setOpenRequestId,
  hidden,
}: AbsenceTableEntryProps) {
  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  function handleExpandClick(toExpand: boolean) {
    if (toExpand) setOpenRequestId(request.id);

    if (!toExpand) setOpenRequestId(undefined);
  }

  let elementClassName =
    "relative py-2 px-2 mb-2 rounded-md bg-grey-100 w-full";

  if (hidden) elementClassName += " hidden";

  let statusClass = "";

  if (request.status === "Pending") statusClass = "text-md text-blue-700";

  if (request.status === "Approved") statusClass = "text-md text-green-700";

  if (request.status === "Declined" || request.status === "Cancelled")
    statusClass = "text-md text-red-700";

  return (
    <li className={elementClassName}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-left font-medium truncate">
              {request.resource_name}
            </h2>
            <p className="text-sm text-left">
              {request.start_of_absence} - {request.end_of_absence}
            </p>
          </div>
          <p className={statusClass}>{request.status}</p>
        </div>
        {expanded && <AbsenceTableEntryExpandedSection request={request} />}
      </div>
      {!formStatusIsPending && (
        <ExpandCollapseButton
          expanded={expanded}
          handleExpandClick={() => {
            handleExpandClick(!expanded);
          }}
        />
      )}
    </li>
  );
}
