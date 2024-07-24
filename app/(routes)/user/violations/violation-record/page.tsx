import React from "react";
import { ListOfViolationsClient } from "./_components/client";
import { currentUser } from "@/lib/auth";
import { getAllViolations } from "@/server/data/violation";
import { ListOfViolationsColumn } from "./_components/columns";
import { format } from "date-fns";
import { getAllViolationTypes } from "@/server/data/violation-type";
import { getAllInfo } from "@/server/data/user-info";
import { getHoaInfo } from "@/server/data/hoa-info";

export default async function Violations() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const users = await getAllInfo();

  if (!users) {
    return null;
  }

  const hoaInfo = await getHoaInfo();
  if (!hoaInfo) {
    return null;
  }

  const violations = await getAllViolations();

  if (!violations) {
    return null;
  }

  const violationTypes = await getAllViolationTypes();

  if (!violationTypes) {
    return null;
  }

  let formattedViolations: ListOfViolationsColumn[] = violations.map(
    (item) => {
      const officer = users.find(
        (info) => info.userId === item.officerAssigned
      );
      const submittedBy = users.find(
        (info) => info.userId === item.submittedBy
      );
      const violation = violationTypes.find((type) => type.id === item.type);
      const status = {
        FOR_REVIEW: "For Review",
        FOR_ASSIGNMENT: "For Officer Assignment",
        PENDING_LETTER_TO_BE_SENT: "Pending Letter To Be Sent",
        NEGOTIATING: "Negotiating (Letter Sent)",
        FOR_FINAL_REVIEW: "For Final Review",
        CLOSED: "Closed",
      };

      const violators = users.filter((info) =>
        item?.personsInvolved.some((person) => person === info.userId)
      );

      return {
        id: item.id || "",
        number: item.number || 0,
        status: status[item.status] || "",
        type: violation?.title || "",
        createdAt: item.createdAt
          ? format(
              new Date(item.createdAt + "Z")?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        violationDate: item.violationDate
          ? format(
              new Date(item.violationDate)?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        updatedAt: item.updatedAt
          ? format(
              new Date(item.updatedAt + "Z")?.toISOString(),
              "MMMM dd, yyyy h:mm:ss a"
            )
          : "",
        personsInvolved: violators || [],
        officerAssigned: officer,
        description: item.description || "",
        submittedBy: submittedBy,
        step: item.step || 0,
        progress: item.progress || "Step 0",
        documents: item.documents || [],
        priority: item.priority || "",
        letterSent: item.letterSent || false,
        reasonToClose: item.reasonToClose || "",
      };
    }
  );

  formattedViolations = formattedViolations.sort((a, b) => b.number - a.number);

  return (
    <div>
      <div className="flex-1 space-y-4">
        <ListOfViolationsClient data={formattedViolations} hoaInfo={hoaInfo} />
      </div>
    </div>
  );
}
