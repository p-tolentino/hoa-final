import { Heading } from "@/components/ui/heading";
import { ButtonGroup } from "@chakra-ui/react";
import { getAllVotes } from "@/server/data/election-vote";
import { getActiveElection } from "@/server/data/election-settings";
import { getApprovedCandidates } from "@/server/data/candidates";
import React from "react";
import BackButton from "@/components/system/BackButton";
import AnswerElection from "./_components/client";

import { currentUser } from "@/lib/auth";

import { getAllViolations } from "@/server/data/violation";
import { getHoaInfo } from "@/server/data/hoa-info";
import { getTransactionByAddress } from "@/server/data/user-transactions";
import { Status } from "@prisma/client";
import { db } from "@/lib/db";

export default async function ElectionVoting() {
  const activeElection = await getActiveElection();

  // Page Title and Description
  const pageTitle = `${
    activeElection?.termOfOffice || ""
  } Election Voting Form`;
  const pageDescription = `Vote the following elibigble candidates for the position of Board Member for the upcoming elections.`;

  if (!activeElection) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={
            <ButtonGroup>
              <BackButton />
            </ButtonGroup>
          }
        />

        <div className="text-center text-red-500 font-bold">
          There is currently no active election.
        </div>
      </>
    );
  }

  const user = await currentUser();
  const dateToday = new Date();

  const existingActiveElection = await db.electionSettings.findFirst({
    where: {
      status: "ON-GOING",
    },
  });

  const hoaInfo = await getHoaInfo();

  if (!user || !hoaInfo) {
    return null;
  }

  if (user.status === Status.DELINQUENT) {
    const violations = await getAllViolations();
    const userViolations = await violations?.filter(
      (violation) =>
        violation.personsInvolved.includes(user?.id) && violation.feeToIncur
    );

    const transactions = await getTransactionByAddress(user.info.address);
    const now = new Date();

    const isViolationDelinquent =
      userViolations &&
      hoaInfo.violationDelinquent !== 0 &&
      userViolations.length >= hoaInfo.violationDelinquent;
    const isOverdueDelinquent = transactions?.some((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const monthsOverdue =
        (now.getFullYear() - transactionDate.getFullYear()) * 12 +
        now.getMonth() -
        transactionDate.getMonth();
      return (
        transaction.status != "PAID" &&
        monthsOverdue >= hoaInfo.overdueDelinquent
      );
    });

    if (isViolationDelinquent) {
      return (
        <>
          <Heading
            title={pageTitle}
            description={pageDescription}
            rightElements={
              <ButtonGroup>
                <BackButton />
              </ButtonGroup>
            }
          />

          <div className="text-center text-red-500 font-bold flex flex-col">
            Dear Homeowner, you have been marked as delinquent due to having{" "}
            {userViolations.length} violations, therefore you are not eligible
            to vote for this current election period.
            <span className="text-xs mt-10 italic">
              The HOA kindly advises everyone that {hoaInfo.violationDelinquent}{" "}
              or more violations will mark you as a delinquent member.
            </span>
          </div>
        </>
      );
    }

    if (isOverdueDelinquent) {
      return (
        <>
          <Heading
            title={pageTitle}
            description={pageDescription}
            rightElements={
              <ButtonGroup>
                <BackButton />
              </ButtonGroup>
            }
          />

          <div className="text-center text-red-500 font-bold">
            <p>
              Dear Homeowner, you have been marked as delinquent due to at least
              one transaction being more than {hoaInfo.overdueDelinquent} months
              overdue. Please address your outstanding payments promptly for you
              to be eligible in this election period and to avoid further
              penalties.
            </p>
          </div>
        </>
      );
    }
  }

  const approvedCandidates = await getApprovedCandidates(activeElection.id);
  if (!approvedCandidates) {
    return null;
  }

  const votes = await getAllVotes(activeElection.id);
  if (!votes) {
    return null;
  }

  if (!existingActiveElection) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={
            <ButtonGroup>
              <BackButton />
            </ButtonGroup>
          }
        />

        <div className="text-center text-red-500 font-bold">
          There are currently no ongoing elections.
        </div>
      </>
    );
  }

  if (dateToday >= existingActiveElection.endElectDate) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={
            <ButtonGroup>
              <BackButton />
            </ButtonGroup>
          }
        />

        <div className="text-center text-red-500 font-bold">
          The voting period for this term&apos;s election has ended.
        </div>
      </>
    );
  }

  const withinVotingPeriod =
    dateToday >= existingActiveElection.startElectDate &&
    dateToday <= existingActiveElection.endElectDate;

  if (!withinVotingPeriod) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={
            <ButtonGroup>
              <BackButton />
            </ButtonGroup>
          }
        />

        <div className="text-center text-red-500 font-bold">
          It is not yet the voting period for this term&apos;s election. (START:{" "}
          {existingActiveElection.startElectDate.toLocaleString()} | END:{" "}
          {existingActiveElection.endElectDate.toLocaleString()})
        </div>
      </>
    );
  }

  const existingVotes = await db.voteResponse.findFirst({
    where: {
      electionId: activeElection.id,
      userId: user.id,
    },
  });

  if (existingVotes) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={
            <ButtonGroup>
              <BackButton />
            </ButtonGroup>
          }
        />

        <div className="text-center text-red-500 font-bold">
          You have already submitted your votes for this election term. Please
          contact the HOA if you have any concerns.
        </div>
      </>
    );
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <AnswerElection
        election={activeElection}
        candidates={approvedCandidates}
        votes={votes}
      />
    </>
  );
}
