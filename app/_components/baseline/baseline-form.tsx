"use client";
import { useState } from "react";

import {
  TResourceProps,
  TRole,
  TWeekProps,
} from "@/server/actions/data-fetches";

import BasicFormHeader from "@/app/_components/ui/basic-form/basic-form-header";
import BaselineEntry from "@/app/_components/baseline/baseline-entry";
import BaselineForm from "@/app/_components/baseline/baseline-form-action";

import { useAppSelector } from "@/app/lib/hooks";

interface BaselineInputProps {
  resources: TResourceProps[];
  weeks: TWeekProps[];
  roles: TRole[];
}

const grades = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
];

export default function BaselineInput({
  resources,
  weeks,
  roles,
}: BaselineInputProps) {
  const [numberOfEntries, setNumberOfEntries] = useState([0]);
  const [tableBodyKey, setTableBodyKey] = useState(0);

  const formStatusIsPending = useAppSelector(
    (state) => state.formStatus.formStatusIsPending
  )!;

  const primaryFields = [
    { name: "Resource", length: 40 },
    { name: "Role", length: 40 },
    { name: "Grade", length: 28 },
  ];

  const secondaryFields = [
    { name: "Initial Week", length: 40 },
    { name: "Days Per Week", length: 40 },
    { name: "No. Of Weeks", length: 40 },
  ];

  const resourceOptions = resources.map((resource) => {
    return {
      id: resource.id,
      name: resource.name,
    };
  });

  const weekOptions = weeks.map((week) => {
    let monthIndexString = week.month_index.toString();
    if (week.month_index < 10) monthIndexString = "0" + monthIndexString;
    return {
      id: +(
        week.year.toString() +
        monthIndexString +
        week.week_index.toString()
      ),
      name: week.week_commencing,
    };
  });

  function handleSuccess() {
    setNumberOfEntries([0]);
    setTableBodyKey((prevState) => prevState + 1);
  }

  return (
    <>
      <BasicFormHeader
        title="Quick Time Entry Input Form"
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
        <tbody key={tableBodyKey}>
          {numberOfEntries.map((entry) => (
            <BaselineEntry
              key={entry}
              resources={resourceOptions}
              roles={roles}
              weeks={[{ id: 0, name: "" }, ...weekOptions]}
              grades={grades}
              setNumberOfEntries={setNumberOfEntries}
              entryIndex={entry}
            />
          ))}
        </tbody>
      </BasicFormHeader>
      <BaselineForm
        key={numberOfEntries.length}
        numberOfEntries={numberOfEntries}
        handleSuccess={handleSuccess}
        weeks={weeks}
      />
    </>
  );
}
