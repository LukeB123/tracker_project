import { useFormState } from "react-dom";
import { useEffect } from "react";

import {
  acceptAbsenceRequestAction,
  declineAbsenceRequestAction,
} from "@/server/actions/absence-request-action";
import { TAbsenceRequestProps } from "@/server/actions/data-fetches";

import AbsenceEntryButton from "@/app/_components/absence/table/absence-entry-button";

import { useAppDispatch } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";
import { formSatusActions } from "@/app/lib/features/formStatus/formStatusSlice";

import sendEmail from "@/app/_hooks/sendEmail";
import { EmailRequest } from "@/app/api/sendEmail/route";

export default function AbsenceTableEntryApproverButtons({
  request,
}: {
  request: TAbsenceRequestProps;
}) {
  const dispatch = useAppDispatch();

  const [delineFormState, delineFormAction] = useFormState(
    declineAbsenceRequestAction,
    {
      request,
      notification: null,
    }
  );

  const [approveFormState, approveFormAction] = useFormState(
    acceptAbsenceRequestAction,
    {
      request,
      notification: null,
    }
  );

  // Handle formAction response
  useEffect(() => {
    if (delineFormState.notification) {
      dispatch(uiActions.showNotification(delineFormState.notification));

      if (delineFormState.notification.status === "success") {
        const requesterEmail: EmailRequest = {
          // to: request.resource_email,
          to: process.env.EMAIL_TEST as string,
          subject: "Absence Request Declined",
          text: `Your absence request for ${request.start_of_absence} till ${request.end_of_absence} has been declined.`,
        };

        sendEmail(requesterEmail);
      }

      dispatch(formSatusActions.setFormSatusIsPending(false));
    }

    if (approveFormState.notification) {
      dispatch(uiActions.showNotification(approveFormState.notification));

      if (approveFormState.notification.status === "success") {
        const startDate = request.start_of_absence.replaceAll("-", "");
        let endDate: Date | string = new Date(request.end_of_absence);

        endDate.setDate(endDate.getDate() + 1);

        const endDateMonthString =
          endDate.getMonth() + 1 < 10
            ? "0" + (endDate.getMonth() + 1).toString()
            : (endDate.getMonth() + 1).toString();
        const endDateDayString =
          endDate.getDate() < 10
            ? "0" + endDate.getDate().toString()
            : endDate.getDate().toString();

        endDate =
          endDate.getFullYear().toString() +
          endDateMonthString +
          endDateDayString;

        const formatDate = (date: Date) =>
          date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Wolfpack/Calendar//EN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTAMP:${formatDate(new Date())}
UID:absence-${request.id}@wolfpackabsence.com
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
SEQUENCE:0
SUMMARY:${request.resource_name} Absence
DESCRIPTION:${request.resource_name} will be away from ${
          request.start_of_absence
        } to ${request.end_of_absence} (${request.absence_duration})
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`.trim();

        const requesterEmail: EmailRequest = {
          // to: request.resource_email,
          to: process.env.EMAIL_TEST as string,
          subject: "Absence Request Approved",
          text: `Your absence request for ${request.start_of_absence} till ${request.end_of_absence} has been approved.`,
          icalEvent: {
            filename: `${request.resource_name} absence.ics`,
            content: icsContent,
          },
        };

        sendEmail(requesterEmail);
      }

      dispatch(formSatusActions.setFormSatusIsPending(false));
    }
  }, [delineFormState, approveFormState]);

  return (
    <>
      <p className="italic">TODO: Only see below if you are set as approver</p>
      <div className="my-4 flex justify-center gap-8">
        <form
          id={"decline_absence_request_" + request.id}
          action={delineFormAction}
        >
          <AbsenceEntryButton type="Decline" />
        </form>
        <form
          id={"accept_absence_request_" + request.id}
          action={approveFormAction}
        >
          <AbsenceEntryButton type="Approve" />
        </form>
      </div>
    </>
  );
}
