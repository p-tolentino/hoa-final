import { db } from "@/lib/db";
import ElectionReport from "./_components/reports-page";
import { getApprovedCandidatesByElection } from "@/server/data/candidates";
import { getElection } from "@/server/data/election-settings";
import { getAllVotes } from "@/server/data/election-vote";
import { currentUser } from "@/lib/auth";
import { getHoaInfo } from "@/server/data/hoa-info";
import { getActiveUsers } from "@/server/data/user";

const ElectionReportPage = async ({
  params,
}: {
  params: { reportId: string };
}) => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const hoaInfo = await getHoaInfo();
  if (!hoaInfo) {
    return null;
  }

  const activeUsers = await getActiveUsers();
  if (!activeUsers) {
    return null;
  }

  const candidates = await getApprovedCandidatesByElection(params.reportId);
  if (!candidates) {
    return null;
  }

  const election = await getElection(params.reportId);
  if (!election) {
    return null;
  }

  const votes = await getAllVotes(params.reportId);
  if (!votes) {
    return null;
  }

  return (
    <div>
      <ElectionReport
        candidates={candidates}
        responses={votes}
        electionInfo={election}
        activeUsers={activeUsers.length}
        hoaInfo={hoaInfo}
      />
    </div>
  );
};

export default ElectionReportPage;
