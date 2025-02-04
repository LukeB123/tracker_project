import Button from "@/app/_components/ui/buttons/button";
import { useFormStatus } from "react-dom";
import Icon from "@/app/_components/ui/icons";
import { useEffect, useState } from "react";
import AbsenceModal from "@/app/_components/absence/absence-modal";

interface AbsenceEntryButtonProps {
  type: "Approve" | "Decline" | "Cancel";
  id: number;
  pendingId: number | undefined;
  setPendingId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function AbsenceEntryButton({
  type,
  id,
  pendingId,
  setPendingId,
}: AbsenceEntryButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (pending) {
      setPendingId(id);
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
        disabled={pendingId !== undefined}
        // type="submit"
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
