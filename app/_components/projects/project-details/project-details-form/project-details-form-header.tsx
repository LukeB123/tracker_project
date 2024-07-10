"use client";

import { useFormStatus } from "react-dom";

interface ProjectDetailsFormHeaderParams {
  title: string | undefined;
  disableMessage: string;
  error: boolean;
}

export default function ProjectDetailsFormHeader({
  title,
  disableMessage,
  error,
}: ProjectDetailsFormHeaderParams) {
  const { pending } = useFormStatus();

  return (
    <>
      <header className="text-center fixed bg-white w-full">
        <h1 className="text-2xl pt-4">
          <span>
            <input
              className="bg-grey-50 text-purple-600 rounded-md border-2 border-grey-600 px-2"
              id="title"
              name="title"
              type="text"
              placeholder="Project Title"
              defaultValue={title ? title : ""}
              required
              disabled={pending}
            />
          </span>{" "}
          Details Page
        </h1>
        {disableMessage != "" && (
          <p
            className={
              error ? "italic text-red-600" : "italic text-purple-600 "
            }
          >
            {disableMessage}
          </p>
        )}
      </header>
      <div className="h-20" />
    </>
  );
}
