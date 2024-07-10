import { useState } from "react";

export default function TestChild({
  count,
  setCount,
  stringValue,
}: {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  stringValue: string;
}) {
  const [string, setString] = useState(stringValue);

  return (
    <>
      <button
        onClick={() => {
          setCount((prevValue) => prevValue + 1);
        }}
      >
        Click Me! I'm a sub component
      </button>
      <p>The Count is: {count}</p>
      <input
        className="bg-blue-200"
        value={string}
        onChange={(event) => {
          setCount((prevValue) => prevValue + 1);
          setString(event.target.value);
        }}
      />
    </>
  );
}
