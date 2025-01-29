"use client";

import Modal from "@/app/_components/ui/modal";
import Button from "@/app/_components/ui/buttons/button";

interface DeleteModalProps {
  label?: string;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setChangesMade?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteModal({
  label,
  showDeleteModal,
  setShowDeleteModal,
  setIsDelete,
  setChangesMade,
}: DeleteModalProps) {
  async function handleDelete() {
    setShowDeleteModal(false);
    setIsDelete(true);
    setChangesMade && setChangesMade(true);
  }

  return (
    <Modal
      open={showDeleteModal}
      onClose={() => {
        setShowDeleteModal(false);
      }}
    >
      <div className="w-full text-center p-10">
        Are you sure you want to delete{" "}
        {label !== undefined && (
          <span className="text-purple-700 font-semibold">{label}</span>
        )}
        {label === undefined && <span>this entry</span>}?
        <div className="flex justify-center items-center gap-4 pt-10">
          <Button
            buttonStyle="secondary"
            onClick={() => setShowDeleteModal(false)}
            width="w-20"
          >
            No
          </Button>
          <Button onClick={handleDelete} width="w-20">
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
