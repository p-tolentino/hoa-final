import { db } from "@/lib/db";
import { Heading } from "@/components/ui/heading";
import { ButtonGroup } from "@chakra-ui/react";
import { currentUser } from "@/lib/auth";
import { getElectionGuidelines } from "@/server/data/election-guidelines";
import { getAllCandidates } from "@/server/data/candidates";
import BackButton from "@/components/system/BackButton";
import CandidateFormUpload from "./_components/upload-form";

import { getAllViolations } from "@/server/data/violation";
import { getHoaInfo } from "@/server/data/hoa-info";
import { getTransactionByAddress } from "@/server/data/user-transactions";
import { Status } from "@prisma/client";

export default async function NominationForm() {
  // Page Title and Description
  const pageTitle = `Application for Candidacy`;
  const pageDescription = `Fill out the Application Form to formally apply for candidacy within the Homeowners' Association.`;

  const user = await currentUser();
  const dateToday = new Date();

  const allCandidates = await getAllCandidates();
  const electionGuidelines = await getElectionGuidelines();
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
            to run for this current election period.
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

  const filteredCandidates = await allCandidates?.filter(
    (app) => app.electionId === existingActiveElection.id
  );

  const existingApplication = await filteredCandidates?.find(
    (app) => app.userId === user?.info.userId
  );

  if (existingApplication) {
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
          You have already submitted an application. Please contact the HOA if
          you have any concerns.
        </div>
      </>
    );
  }

  if (dateToday >= existingActiveElection.endApplyDate) {
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
          It is not the candidacy period for this term&apos;s election.
        </div>
      </>
    );
  }

  const withinCandidacyPeriod =
    dateToday >= existingActiveElection.startApplyDate &&
    dateToday <= existingActiveElection.endApplyDate;

  if (!withinCandidacyPeriod) {
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
          The candidacy period has not started yet. (START:{" "}
          {existingActiveElection.startApplyDate.toLocaleString()} | END:{" "}
          {existingActiveElection.endApplyDate.toLocaleString()})
        </div>
      </>
    );
  }

  return (
    <CandidateFormUpload
      activeElection={existingActiveElection}
      formLink={electionGuidelines?.candidacyFormLink}
    />
  );
}
