import { TAbsenceRequestProps } from "@/util/absence";
import Icon from "@/app/_components/ui/icons";
import Button from "@/app/_components/ui/buttons/button";
import { useFormState } from "react-dom";
import {
  acceptAbsenceRequestAction,
  cancelAbsenceRequestAction,
  declineAbsenceRequestAction,
} from "@/app/actions/absence-request-action";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { uiActions } from "@/lib/features/ui/uiSlice";
import AbsenceEntryButton from "@/app/_components/absence/absence-entry-button";

interface AbsenceTableEntryProps {
  request: TAbsenceRequestProps;
  openRequestIds: number[];
  setOpenRequestIds: React.Dispatch<React.SetStateAction<number[]>>;
  pendingId: number | undefined;
  setPendingId: React.Dispatch<React.SetStateAction<number | undefined>>;
  hidden: boolean;
}

export default function AbsenceTableEntry({
  request,
  openRequestIds,
  setOpenRequestIds,
  pendingId,
  setPendingId,
  hidden,
}: AbsenceTableEntryProps) {
  const dispatch = useAppDispatch();

  const [delineFormState, delineFormAction] = useFormState(
    declineAbsenceRequestAction,
    {
      id: request.id,
      notification: null,
      newStatus: undefined,
    }
  );

  const [approveFormState, approveFormAction] = useFormState(
    acceptAbsenceRequestAction,
    {
      id: request.id,
      notification: null,
      newStatus: undefined,
    }
  );

  const [cancelFormState, cancelFormAction] = useFormState(
    cancelAbsenceRequestAction,
    {
      id: request.id,
      notification: null,
      newStatus: undefined,
    }
  );

  // Handle formAction response
  useEffect(() => {
    setPendingId(undefined);

    if (delineFormState.notification) {
      dispatch(uiActions.showNotification(delineFormState.notification));
    }

    if (approveFormState.notification) {
      dispatch(uiActions.showNotification(approveFormState.notification));
    }

    if (cancelFormState.notification) {
      dispatch(uiActions.showNotification(cancelFormState.notification));
    }
  }, [delineFormState, approveFormState, cancelFormState]);

  function handleClick() {
    if (pendingId !== request.id)
      setOpenRequestIds((prevState) =>
        prevState.includes(request.id)
          ? prevState.filter((entry) => entry !== request.id)
          : [...prevState, request.id]
      );
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
        {openRequestIds.includes(request.id) && (
          <div className="py-2">
            <p className="text-sm text-left">
              Duration Type :{" "}
              <span className="text-purple-700 font-semibold">
                {request.absence_duration}
              </span>
            </p>
            <p className="italic">
              TODO: Only see below if you are set as approver or its your own
              request
            </p>
            <p className="text-sm text-left">
              Absence Type :{" "}
              <span className="text-purple-700 font-semibold">
                {request.absence_type}
              </span>
            </p>
            {request.status === "Pending" && (
              <>
                <p className="italic">
                  TODO: Only see below if you are set as approver
                </p>
                <div className="my-4 flex justify-center gap-8">
                  <form
                    id={"decline_absence_request_" + request.id}
                    action={delineFormAction}
                  >
                    <AbsenceEntryButton
                      type="Decline"
                      id={request.id}
                      pendingId={pendingId}
                      setPendingId={setPendingId}
                    />
                  </form>
                  <form
                    id={"accept_absence_request_" + request.id}
                    action={approveFormAction}
                  >
                    <AbsenceEntryButton
                      type="Approve"
                      id={request.id}
                      pendingId={pendingId}
                      setPendingId={setPendingId}
                    />
                  </form>
                </div>
              </>
            )}
            {request.status === "Approved" && (
              <>
                <p className="italic">
                  TODO: Only see below if this is your request
                </p>
                <div className="my-4 flex justify-center gap-8">
                  <form
                    id={"cancel_absence_request_" + request.id}
                    action={cancelFormAction}
                  >
                    <AbsenceEntryButton
                      type="Cancel"
                      id={request.id}
                      pendingId={pendingId}
                      setPendingId={setPendingId}
                    />
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {pendingId !== request.id && (
        <button
          onClick={handleClick}
          className="absolute bottom-1 right-1 text-xs text-grey-500 flex justify-between gap-1 items-center "
        >
          {openRequestIds.includes(request.id) ? "Collapse" : "Expand"}

          {!openRequestIds.includes(request.id) && (
            <div className={"animate-dropDownClosed"}>
              <Icon
                iconName="downArrow"
                width="10px"
                height="10px"
                color="#5f249f"
              />
            </div>
          )}
          {openRequestIds.includes(request.id) && (
            <div className={"animate-dropDownOpened"}>
              <Icon
                iconName="upArrow"
                width="10px"
                height="10px"
                color="#5f249f"
              />
            </div>
          )}
        </button>
      )}
    </li>
  );
}
