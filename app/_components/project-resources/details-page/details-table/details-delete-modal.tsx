"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Modal from "@/app/_components/modal";
import Button from "@/app/_components/buttons/button";
import Icon from "@/app/_components/icons/icons";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { uiActions } from "@/lib/ui";

import { deleteProjectResourceAction } from "@/util/details-form-actions";

interface TProjectDetailsDeleteModalProps {
  id: number;
  title: string;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  context: "project" | "resource";
}

export default function DetailsDeleteModal({
  id,
  title,
  showDeleteModal,
  setShowDeleteModal,
  context,
}: TProjectDetailsDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);

    let responce = await deleteProjectResourceAction(id, context);

    setIsDeleting(false);

    if (responce && responce.notification) {
      dispatch(uiActions.showNotification(responce.notification));

      if (responce.notification.status === "success") {
        setShowDeleteModal(false);
      }
    }

    if (responce && responce.redirect) {
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
