import Icon from "@/app/_components/icons/icons";
import TimeEntriesDeleteProjectResourceModal from "@/app/_components/time-entries/time-entries-delete-project-resource-modal";
import { useState } from "react";

interface TimeEntriesDeleteProjectResourceButtonsProps {
  label: string;
  uniqueId: string;
  isDelete: boolean;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setChangesMade: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled: boolean;
}

export default function TimeEntriesDeleteProjectResourceButtons({
  label,
  uniqueId,
  isDelete,
  setIsDelete,
  setChangesMade,
  isDisabled,
}: TimeEntriesDeleteProjectResourceButtonsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleDeleteClick() {
    if (isDelete) {
      setIsDelete(false);
    } else if (label.trim() === "") {
      setIsDelete(true);
    } else {
      setShowDeleteModal(true);
    }
  }

  return (
    <>
      <TimeEntriesDeleteProjectResourceModal
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
        <input
          name={uniqueId + "_delete"}
          value={isDelete ? 1 : 0}
          onChange={() => {}}
          className="hidden"
          readOnly
          form="time_entries_form"
        />
      </button>
    </>
  );
}
