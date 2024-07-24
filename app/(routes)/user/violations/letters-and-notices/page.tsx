import { ViolationLettersAndNoticesClient } from "./_components/client";
import { getLetterByUserId } from "@/server/data/letter-notice";
import { ViolationLettersAndNoticesColumn } from "./_components/columns";
import { getAllViolations } from "@/server/data/violation";
import { getAllViolationTypes } from "@/server/data/violation-type";
import { format } from "date-fns";
import { currentUser } from "@/lib/auth";
import { LetterNoticeType } from "@prisma/client";

export default async function ViolationLettersAndNotices() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const letters = await getLetterByUserId(user.id);

  if (!letters) {
    return null;
  }

  const orderedLetters = letters
    .filter((item) => item.type === LetterNoticeType.VIOLATION)
    .sort((a: any, b: any) => b.createdAt - a.createdAt);

  const violations = await getAllViolations();

  if (!violations) {
    return null;
  }

  const violationTypes = await getAllViolationTypes();

  if (!violationTypes) {
    return null;
  }

  const formattedData: ViolationLettersAndNoticesColumn[] = orderedLetters.map(
    (item) => {
      const violation = violations.find(
        (violation) => violation.id === item.idToLink
      );
      const violationType = violationTypes.find(
        (type) => type.id === violation?.type
      );

      return {
        id: item.id || "",
        type: item.type || "",
        recipient: item.recipient || "",
        meetDate: item.meetDate
          ? format(
              new Date(item.meetDate)?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        venue: item.venue ? item.venue : "",
        sender: item.sender || "",
        createdAt: item.createdAt
          ? format(
              new Date(item.createdAt + "Z")?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        violation: violation!!,
        violationType: violationType!!,
      };
    }
  );

  return (
    <div>
      <div className="flex-1 space-y-4">
        <ViolationLettersAndNoticesClient data={formattedData} />
      </div>
    </div>
  );
}
