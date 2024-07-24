import { currentUser } from "@/lib/auth";
import ReportForm from "./_components/report-form";
import { getAllViolationTypes } from "@/server/data/violation-type";
import { getAllInfo } from "@/server/data/user-info";

const ViolationForm = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const allUsers = await getAllInfo();

  if (!allUsers) {
    return null;
  }

  const types = await getAllViolationTypes();

  if (!types) {
    return null;
  }

  return (
    <>
      <ReportForm violationTypes={types} users={allUsers || null} />
    </>
  );
};

export default ViolationForm;
