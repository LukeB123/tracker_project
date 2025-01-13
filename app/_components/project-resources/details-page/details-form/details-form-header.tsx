"use client";

import { useFormStatus } from "react-dom";

interface DetailsFormHeaderParams {
  title: string | undefined;
  context: "project" | "resource";
}

export default function DetailsFormHeader({
  title,
  context,
}: DetailsFormHeaderParams) {
  const { pending } = useFormStatus();

  return (
    <header className="text-2xl text-center bg-white w-full">
      <h1 className="py-4">
        <span>
          <input
            className="bg-grey-50 text-purple-600 rounded-md border-2 border-grey-600 px-2 disabled:border-grey-400 disabled:text-purple-500"
            id="title"
            name="title"
            type="text"
            placeholder={
              context === "project" ? "Project Title" : "Resource Name"
            }
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
