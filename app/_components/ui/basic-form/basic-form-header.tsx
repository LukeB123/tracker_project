import React from "react";

import AddEntryButton from "@/app/_components/ui/buttons/add-entry-button";

interface BasicFormHeaderProps {
  title: string;
  primaryFields: { name: string; length: number | undefined }[];
  secondaryFields: { name: string; length: number | undefined }[];
  addEntryButton: boolean;
  onAdd?: () => void;
  onAddDisabled?: boolean;
  children: React.ReactNode;
}

export default function BasicFormHeader({
  title,
  primaryFields,
  secondaryFields,
  addEntryButton,
  onAdd,
  onAddDisabled,
  children,
}: BasicFormHeaderProps) {
  return (
    <>
      <h1 className="text-center mt-10 text-xl font-semibold">{title}</h1>
      <div className="flex lg:justify-center my-5">
        <table className="border-separate border-spacing border-spacing-1">
          <thead>
            <tr>
              {primaryFields.map((field) => {
                let style =
                  "font-medium border-b-2 border-purple-600 px-2 py-1";

                if (field.length) style += " min-w-" + field.length;
                return (
                  <th key={field.name} className={style}>
                    {field.name}
                  </th>
                );
              })}
              {secondaryFields.map((field) => {
                let style = "font-medium border-b-2 border-blue-500 px-2 py-1";

                if (field.length) style += " min-w-" + field.length;
                return (
                  <th key={field.name} className={style}>
                    {field.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          {children}
          {addEntryButton && (
            <tfoot>
              <tr>
                <td colSpan={primaryFields.length}>
                  <button
                    type="button"
                    className="w-full h-8"
                    onClick={onAdd}
                    disabled={onAddDisabled}
                  >
                    <AddEntryButton isDisabled={onAddDisabled} />
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}
