import React from "react";
import { DisputeLettersAndNoticesClient } from "./_components/client";
import { currentUser } from "@/lib/auth";
import { getLetterByUserId } from "@/server/data/letter-notice";
import { getAllDisputeTypes } from "@/server/data/dispute-type";
import { getAllDisputes } from "@/server/data/dispute";
import { getAllViolationTypes } from "@/server/data/violation-type";
import { format } from "date-fns";
import { DisputeLettersAndNoticesColumn } from "./_components/columns";
import { LetterNoticeType } from "@prisma/client";

export default async function DisputeLettersAndNotices() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const letters = await getLetterByUserId(user.id);

  if (!letters) {
    return null;
  }

  const orderedLettersNotices = letters
    .filter((item) => item.type === LetterNoticeType.DISPUTE)
    .sort((a: any, b: any) => b.createdAt - a.createdAt);

  const violationTypes = await getAllViolationTypes();

  if (!violationTypes) {
    return null;
  }

  const disputes = await getAllDisputes();

  if (!disputes) {
    return null;
  }

  const disputeTypes = await getAllDisputeTypes();

  if (!disputeTypes) {
    return null;
  }

  const formattedData: DisputeLettersAndNoticesColumn[] =
    orderedLettersNotices.map((item) => {
      const dispute = disputes.find((dispute) => dispute.id === item.idToLink);
      const disputeType = disputeTypes.find(
        (type) => type.id === dispute?.type
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
        dispute: dispute!!,
        disputeType: disputeType!!,
      };
    });

  return (
    <div>
      <div className="flex-1 space-y-4">
        <DisputeLettersAndNoticesClient data={formattedData} />
      </div>
    </div>
  );
}
