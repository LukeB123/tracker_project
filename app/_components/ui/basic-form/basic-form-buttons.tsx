"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";

import Button from "@/app/_components/ui/buttons/button";
import Icon from "@/app/_components/ui/icons";

import { useAppDispatch } from "@/app/lib/hooks";
import { formSatusActions } from "@/app/lib/features/formStatus/formStatusSlice";

export default function BasicFormButtons({ hrefBack }: { hrefBack: string }) {
  const dispatch = useAppDispatch();

  const { pending } = useFormStatus();

  useEffect(() => {
    dispatch(formSatusActions.setFormSatusIsPending(pending));

    return () => {
      dispatch(formSatusActions.setFormSatusIsPending(false));
    };
  }, [pending]);

  return (
    <div className="mt-4 flex justify-center gap-8">
      <Button
        buttonStyle="secondary"
        disabled={pending}
        href={hrefBack}
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
  );
}
