import ViolationList from "./_components/violation-list";
import { currentUser } from "@/lib/auth";
import { getAllViolationTypes } from "@/server/data/violation-type";

export default async function ListOfViolations() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const types = await getAllViolationTypes();

  if (!types) {
    return null;
  }

  return (
    <>
      <ViolationList violations={types} />
    </>
  );
}
