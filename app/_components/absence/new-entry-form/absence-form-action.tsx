"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";

import { TResourceProps } from "@/server/actions/data-fetches";
import { absenceRequestAction } from "@/server/actions/absence-request-action";

import BasicFormButtons from "@/app/_components/ui/basic-form/basic-form-buttons";

import { useAppDispatch } from "@/app/lib/hooks";
import { uiActions } from "@/app/lib/features/ui/uiSlice";

import sendEmail from "@/app/_hooks/sendEmail";

interface AbsenceFormActionProps {
  numberOfEntries: number[];
  resources: TResourceProps[];
  handleSuccess: () => void;
}

export default function AbsenceFormAction({
  numberOfEntries,
  resources,
  handleSuccess,
}: AbsenceFormActionProps) {
  const dispatch = useAppDispatch();

  const [formState, formAction] = useFormState(absenceRequestAction, {
    numberOfEntries,
    resources,
    requests: [],
    notification: null,
  });

  // Handle formAction response
  useEffect(() => {
    if (formState.notification) {
      dispatch(uiActions.showNotification(formState.notification));

      if (formState.notification.status === "success") {
        formState.requests.forEach((request) => {
          const requesterEmail = {
            // to: request.resource_email,
            to: "luke.barnett@dxc.com",
            subject: "Absence Request Submitted",
            text: `Your absence request for ${request.start_of_absence} till ${request.end_of_absence} has been successfully submitted to ${request.approver_email} for approval.`,
          };

          const approverEmail = {
            // to: request.approver_email,
            to: "luke.barnett@dxc.com",
            subject: "Absence Request Awaiting Approval",
            text: `A new absence request from ${request.resource_email} for ${request.start_of_absence} till ${request.end_of_absence} is awaiting your approval.`,
          };

          sendEmail(requesterEmail);
          sendEmail(approverEmail);
        });

        handleSuccess();
      }
    }
  }, [formState]);

  return (
    <form id="absence_entries_form" action={formAction}>
      <BasicFormButtons hrefBack="/absence" />
    </form>
  );
}
