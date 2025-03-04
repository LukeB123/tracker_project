"use client";

import { useState } from "react";

import { redirect } from "next/navigation";

import { TResourceProps } from "@/server/actions/data-fetches";

import BasicFormHeader from "@/app/_components/ui/basic-form/basic-form-header";
import AbsenceEntry from "@/app/_components/absence/new-entry-form/absence-entry";
import AbsenceFormAction from "@/app/_components/absence/new-entry-form/absence-form-action";

import { useAppSelector } from "@/app/lib/hooks";

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
    redirect("/absence");
  }

  const primaryFields = [
    { name: "Resource", length: 40 },
    { name: "Approver", length: 40 },
  ];

  const secondaryFields = [
    { name: "Absence Type", length: 28 },
    { name: "Duration", length: 28 },
    { name: "First Day of Leave", length: 40 },
    { name: "Last Day of Leave", length: 40 },
  ];

  return (
    <>
      <BasicFormHeader
        title="Absence Request Input Form"
        primaryFields={primaryFields}
        secondaryFields={secondaryFields}
        addEntryButton={true}
        onAdd={() => {
          setNumberOfEntries((prevValue) => {
            return [...prevValue, prevValue[prevValue.length - 1] + 1];
          });
        }}
        onAddDisabled={formStatusIsPending}
      >
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
      </BasicFormHeader>
      <AbsenceFormAction
        key={numberOfEntries.length}
        numberOfEntries={numberOfEntries}
        resources={resources}
        handleSuccess={handleSuccess}
      />
    </>
  );
}
