import { Suspense } from "react";
import Results from "./results";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Results />
    </Suspense>
  );
}
