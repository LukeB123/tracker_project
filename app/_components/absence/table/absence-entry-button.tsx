import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import AbsenceModal from "@/app/_components/absence/table/absence-modal";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { formSatusActions } from "@/app/lib/features/formStatus/formStatusSlice";

import Icon from "@/app/_components/ui/icons";
import Button from "@/app/_components/ui/buttons/button";

interface AbsenceEntryButtonProps {
  type: "Approve" | "Decline" | "Cancel";
}

export default function AbsenceEntryButton({ type }: AbsenceEntryButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const { pending } = useFormStatus();

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(formSatusActions.setFormSatusIsPending(pending));

    if (pending) {
      setShowModal(false);
    }
  }, [pending]);

  let buttonType: "positive" | "negative" = "positive";

  if (type === "Approve") buttonType = "positive";
  if (type === "Decline" || type === "Cancel") buttonType = "negative";

  return (
    <>
      <AbsenceModal
        showModal={showModal}
        setShowModal={setShowModal}
        type={type}
      />
      <Button
        buttonStyle={buttonType}
        disabled={formStatusIsPending}
        onClick={() => setShowModal(true)}
        width={"w-28"}
      >
        <div className="flex justify-center items-center gap-2">
          {pending && (
            <div className="animate-spin">
              <Icon
                iconName="loading"
                color="#33aaff"
                height="20px"
                width="20px"
              />
            </div>
          )}
          {type}
        </div>
      </Button>
    </>
  );
}
