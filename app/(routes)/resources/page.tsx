"use client";

import Dropdown from "@/app/_components/dropdown";
import TEST from "@/app/_components/test";

export default function TrackerPage() {
  const data = [
    {
      id: 1,
      name: "Luke",
    },
    {
      id: 2,
      name: "Ashley",
    },
    {
      id: 3,
      name: "Matt",
    },
    {
      id: 4,
      name: "Sam",
    },
    {
      id: 5,
      name: "Karim",
    },
  ];
  return (
    <>
      <h1>WELCOME TO RESOURCES</h1>
      <div className="w-40">
        <Dropdown
          id="kbk"
          title="PLEASE SELECT SOMETHING"
          data={data}
          parentSelectedItem={data[2]}
        />
      </div>
      <TEST />
    </>
  );
}
