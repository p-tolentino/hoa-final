import { db } from "@/lib/db";
import ProgressDetails from "./_components/progress-details";
import { getAllInfo } from "@/server/data/user-info";
import {
  getAllProgressReports,
  getViolationOfficerActivitiesById,
} from "@/server/data/violation";

type ViolationRecords = {
  [userId: string]: number;
};

const ViolationProgressPage = async ({
  params,
}: {
  params: { violationId: string };
}) => {
  const violation = await db.violation.findUnique({
    where: {
      id: params.violationId,
    },
  });

  if (!violation) {
    return null;
  }

  const violationType = await db.violationType.findFirst({
    where: {
      id: violation?.type,
    },
  });

  const officerAssigned = await db.personalInfo.findFirst({
    where: {
      userId: violation?.officerAssigned || "",
    },
  });

  const submittedBy = await db.personalInfo.findFirst({
    where: {
      userId: violation?.submittedBy,
    },
  });

  const infos = await getAllInfo();

  if (!infos) {
    return null;
  }

  const updatedPersons = infos.filter((info) =>
    violation.personsInvolved.some((person) => person === info.userId)
  );

  const committeeMembers = infos.filter(
    (info) => info.committee === "Security Committee"
  );

  const officerActivities = await getViolationOfficerActivitiesById(
    violation?.id
  );

  const progressReports = await getAllProgressReports();

  const allViolations = await db.violation.findMany();

  const violationRecords: ViolationRecords = {};

  allViolations.forEach((violationItem) => {
    const includesPersonInvolved = violationItem.personsInvolved.some(
      (person) => violation.personsInvolved.includes(person)
    );

    const penaltyFeeCharged =
      violationItem.reasonToClose === "Penalty Fee Charged to SOA";

    const isSameType = violationItem.type === violation.type;

    violationItem.personsInvolved.forEach((person) => {
      if (!violation.personsInvolved.includes(person)) {
        return;
      }

      if (!violationRecords[person]) {
        violationRecords[person] = 0;
      }

      if (includesPersonInvolved && penaltyFeeCharged && isSameType) {
        violationRecords[person]++;
      }
    });
  });

  const status = {
    FOR_REVIEW: "For Review",
    FOR_ASSIGNMENT: "For Officer Assignment",
    PENDING_LETTER_TO_BE_SENT: "Pending Letter To Be Sent",
    NEGOTIATING: "Negotiating (Letter Sent)",
    FOR_FINAL_REVIEW: "For Final Review",
    CLOSED: "Closed",
  };

  const reportDetails = {
    violation: { ...violation, status: status[violation.status] },
    violationType: violationType,
    officerAssigned: officerAssigned,
    submittedBy: submittedBy,
    personsInvolved: updatedPersons,
    committee: committeeMembers,
    officerActivities: officerActivities?.sort(
      (a: any, b: any) => a.deadline - b.deadline
    ),
    progressReports: progressReports,
    userInfos: infos,
    violationRecord: violationRecords,
  };

  console.log(violationRecords);

  return (
    <div>
      <ProgressDetails reportDetails={reportDetails} />
    </div>
  );
};

export default ViolationProgressPage;
