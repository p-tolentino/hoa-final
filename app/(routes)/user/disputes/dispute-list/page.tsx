import { currentUser } from "@/lib/auth";
import DisputeList from "./_components/dispute-list";
import { getAllDisputeTypes } from "@/server/data/dispute-type";

export default async function ListOfViolations() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const types = await getAllDisputeTypes();

  if (!types) {
    return null;
  }

  return (
    <>
      <DisputeList disputes={types || null}/>
    </>
  );
}
