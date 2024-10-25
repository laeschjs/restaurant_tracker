import { useParams } from "@remix-run/react";

export default function VisitInProgress() {
  const { visitId } = useParams();
  return (
    <div>
      <h1>TODO: Kickoff {visitId}</h1>
    </div>
  );
}
