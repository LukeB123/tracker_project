"use client";
import { useState } from "react";
import AddEntryButton from "@/app/_components/ui/buttons/add-entry-button";
import { useAppSelector } from "@/app/lib/hooks";
import AbsenceEntry from "@/app/_components/absence/absence-entry";
import AbsenceFormAction from "@/app/_components/absence/absence-form-action";
import { redirect } from "next/navigation";
import { TResourceProps } from "@/server/actions/data-fetches";

interface AbsenceFormProps {
  resources: TResourceProps[];
}

export default function AbsenceForm({ resources }: AbsenceFormProps) {
  const [numberOfEntries, setNumberOfEntries] = useState([0]);

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  const resourceOptions = resources.map((resource) => {
    return {
      id: resource.id,
      name: resource.name,
    };
  });

  function handleSuccess() {
    // setNumberOfEntries([0]);
    // setTableBodyKey((prevState) => prevState + 1);
    redirect("/absence");
  }

  return (
    <>
      <h1 className="text-center mt-10 text-xl font-semibold">
        Absence Request Input Form
      </h1>
      <div className="flex lg:justify-center my-5">
        <table className="border-separate border-spacing border-spacing-1">
          <thead>
            <tr>
              <th className="min-w-40 font-medium border-b-2 border-purple-600 px-2 py-1">
                Resource
              </th>
              <th className="min-w-40 font-medium border-b-2 border-purple-600 px-2 py-1">
                Approver
              </th>
              <th className="min-w-28 font-medium border-b-2 border-purple-600 px-2 py-1">
                Absence Type
              </th>
              <th className="min-w-40 font-medium border-b-2 border-purple-600 px-2 py-1">
                Duration
              </th>
              <th className="min-w-40 font-medium border-b-2 border-blue-500 px-2 py-1">
                First Day of Leave
              </th>
              <th className="min-w-40 font-medium border-b-2 border-blue-500 px-2 py-1">
                Last Day of Leave
              </th>
            </tr>
          </thead>
          <tbody>
            {numberOfEntries.map((entry) => (
              <AbsenceEntry
                key={entry}
                resources={resourceOptions}
                setNumberOfEntries={setNumberOfEntries}
                entryIndex={entry}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
                <button
                  type="button"
                  className="w-full h-8"
                  onClick={() => {
                    setNumberOfEntries((prevValue) => {
                      return [
                        ...prevValue,
                        prevValue[prevValue.length - 1] + 1,
                      ];
                    });
                  }}
                  disabled={formStatusIsPending}
                >
                  <AddEntryButton isDisabled={formStatusIsPending} />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AbsenceFormAction
        key={numberOfEntries.length}
        numberOfEntries={numberOfEntries}
        handleSuccess={handleSuccess}
      />
    </>
  );
}
