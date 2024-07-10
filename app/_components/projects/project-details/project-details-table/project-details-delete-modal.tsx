"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Modal from "@/app/_components/modal";
import Button from "@/app/_components/buttons/button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uiActions } from "@/lib/ui";

import { deleteProjectAction } from "@/util/project-actions";
import Icon from "@/app/_components/icons/icons";

interface TProjectDetailsDeleteModalProps {
  id: number;
  title: string;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProjectDetailsDeleteModal({
  id,
  title,
  showDeleteModal,
  setShowDeleteModal,
}: TProjectDetailsDeleteModalProps) {
  const project = useAppSelector((state) => state.projects.currentProject);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    const responce = await deleteProjectAction(id);

    setIsDeleting(false);

    dispatch(uiActions.showNotification(responce.notification));

    if (responce.notification.status === "success") {
      setShowDeleteModal(false);
      // remove project from redux store allProjects
    }

    if (responce.redirect) {
      router.push(responce.redirect);
    }
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
        <span className="text-purple-700 font-semibold">{title}</span>?
        <div className="flex justify-center items-center gap-4 pt-10">
          <Button
            buttonStyle="secondary"
            disabled={isDeleting}
            onClick={() => setShowDeleteModal(false)}
            width="w-20"
          >
            No
          </Button>
          <Button onClick={handleDelete} disabled={isDeleting} width="w-20">
            <div className="flex justify-center items-center gap-2">
              {isDeleting && (
                <div className="animate-spin">
                  <Icon
                    iconName="loading"
                    color="#fafafa"
                    height="20px"
                    width="20px"
                  />
                </div>
              )}
              Yes
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
