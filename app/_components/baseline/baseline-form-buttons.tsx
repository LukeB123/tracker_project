"use client";

import { useFormStatus } from "react-dom";

import Button from "@/app/_components/buttons/button";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Icon from "@/app/_components/icons/icons";
import { useEffect } from "react";
import { formSatusActions } from "@/lib/formStatus";

export default function BaselineFormButtons() {
  const dispatch = useAppDispatch();

  const { pending } = useFormStatus();

  const project = useAppSelector((state) => state.projects.currentProject)!;

  useEffect(() => {
    dispatch(formSatusActions.setFormSatusIsPending(pending));
  }, [pending]);

  useEffect(() => {
    dispatch(formSatusActions.setFormSatusIsPending(false));
  }, []);

  return (
    <>
      {project && (
        <div className="mt-4 flex justify-center gap-8">
          <Button
            buttonStyle="secondary"
            disabled={pending}
            href={"/projects/" + project.slug}
            width={"w-20"}
          >
            Back
          </Button>
          <Button disabled={pending} type="submit" width={"w-32"}>
            {pending ? (
              <div className="flex justify-center items-center gap-2">
                <div className="animate-spin">
                  <Icon
                    iconName="loading"
                    color="#fafafa"
                    height="20px"
                    width="20px"
                  />
                </div>
                Submitting
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      )}
    </>
  );
}
