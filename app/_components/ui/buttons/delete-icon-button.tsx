import Icon from "@/app/_components/ui/icons";
import DeleteModal from "@/app/_components/ui/delete-modal";
import { useState } from "react";

interface DeleteIconButtonProps {
  label?: string;
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setChangesMade?: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled?: boolean;
  showModal?: boolean;
}

export default function DeleteIconButton({
  label,
  isDelete,
  setIsDelete,
  setChangesMade,
  isDisabled = false,
  showModal = true,
}: DeleteIconButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleDeleteClick() {
    if (isDelete) {
      setIsDelete(false);
      setChangesMade && setChangesMade(true);
    } else if (showModal) {
      setShowDeleteModal(true);
    } else {
      setIsDelete(true);
      setChangesMade && setChangesMade(true);
    }
  }

  return (
    <>
      <DeleteModal
        label={label}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        setIsDelete={setIsDelete}
        setChangesMade={setChangesMade}
      />
      <button
        type="button"
        className={"w-max"}
        onClick={handleDeleteClick}
        disabled={isDisabled}
      >
        {!isDelete && (
          <Icon
            iconName="delete"
            color={isDisabled ? "#cccccc" : "#5f249f"}
            height="20px"
            width="20px"
          />
        )}
        {isDelete && (
          <Icon
            iconName="undo"
            color={isDisabled ? "#cccccc" : "#66bfff"}
            height="20px"
            width="20px"
          />
        )}
      </button>
    </>
  );
}
