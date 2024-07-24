import { format } from "date-fns";
import { ListOfDisputesColumn } from "./_components/columns";
import { getAllDisputeTypes } from "@/server/data/dispute-type";
import { currentUser } from "@/lib/auth";
import { getAllDisputes } from "@/server/data/dispute";
import { ListOfDisputesClient } from "./_components/client";
import { getAllInfo } from "@/server/data/user-info";
import { getHoaInfo } from "@/server/data/hoa-info";

export default async function Disputes() {
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

  const disputes = await getAllDisputes();

  if (!disputes) {
    return null;
  }

  const disputeTypes = await getAllDisputeTypes();

  if (!disputeTypes) {
    return null;
  }

  let formattedDisputes: ListOfDisputesColumn[] = disputes.map((item) => {
    const officer = users.find((user) => user.userId === item.officerAssigned);
    const submittedBy = users.find((user) => user.userId === item.submittedBy);
    const dispute = disputeTypes.find((type) => type.id === item.type);

    const status = {
      FOR_REVIEW: "For Review",
      FOR_ASSIGNMENT: "For Officer Assignment",
      PENDING_LETTER_TO_BE_SENT: "Pending Letter To Be Sent",
      NEGOTIATING: "Negotiating (Letter Sent)",
      FOR_FINAL_REVIEW: "For Final Review",
      CLOSED: "Closed",
    };

    const personComplained = users.find(
      (info) => info.userId === item.personComplained
    );

    return {
      id: item.id || "",
      number: item.number || 0,
      status: status[item.status] || "",
      type: dispute?.title || "",
      createdAt: item.createdAt
        ? format(
            new Date(item.createdAt + "Z")?.toISOString().split("T")[0],
            "MMMM dd, yyyy"
          )
        : "",
      disputeDate: item.disputeDate
        ? format(
            new Date(item.disputeDate)?.toISOString().split("T")[0],
            "MMMM dd, yyyy"
          )
        : "",
      personComplained: personComplained,
      officerAssigned: officer,
      description: item.description || "",
      submittedBy: submittedBy,
      step: item.step || 0,
      progress: item.progress || "Step 0",
      documents: item.documents || [],
      priority: item.priority || "",
      letterSent: item.letterSent || false,
      reasonToClose: item.reasonToClose || "",
      updatedAt: item.updatedAt
        ? format(
            new Date(item.updatedAt + "Z")?.toISOString(),
            "MMMM dd, yyyy h:mm:ss a"
          )
        : "",
    };
  });
  
  formattedDisputes = formattedDisputes.sort((a, b) => b.number - a.number);

  return (
    <div>
      <div className="flex-1 space-y-4">
        <ListOfDisputesClient data={formattedDisputes} hoaInfo={hoaInfo} />
      </div>
    </div>
  );
}
