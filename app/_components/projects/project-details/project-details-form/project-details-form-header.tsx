"use client";

import { useFormStatus } from "react-dom";

interface ProjectDetailsFormHeaderParams {
  title: string | undefined;
}

export default function ProjectDetailsFormHeader({
  title,
}: ProjectDetailsFormHeaderParams) {
  const { pending } = useFormStatus();

  return (
    <header className="text-2xl text-center bg-white w-full">
      <h1 className="py-4">
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
    </header>
  );
}
