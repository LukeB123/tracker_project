"use client";

import Modal from "@/app/_components/ui/modal";
import Button from "@/app/_components/ui/buttons/button";

interface DeleteModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: "Approve" | "Decline" | "Cancel";
}

export default function AbsenceModal({
  showModal,
  setShowModal,
  type,
}: DeleteModalProps) {
  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <div className="w-full text-center p-10">
        Are you sure you want to {type} this request?
        <div className="flex justify-center items-center gap-4 pt-10">
          <Button
            buttonStyle="secondary"
            onClick={() => setShowModal(false)}
            width="w-20"
          >
            No
          </Button>
          <Button type="submit" width="w-20">
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
