import { useState } from "react";
import TestChild from "./test-child";

export default function TEST() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button
        onClick={() => {
          setCount((prevValue) => prevValue + 1);
        }}
      >
        Click Me!
      </button>
      <p>The Count is: {count}</p>
      <TestChild count={count} setCount={setCount} stringValue="starting" />
    </>
  );
}
