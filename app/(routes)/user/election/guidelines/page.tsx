import { getElectionGuidelines } from "@/server/data/election-guidelines";
import Guidelines from "./_components/guidelines";
import { generateEmptyGuidelines } from "@/server/actions/election-guidelines";
import { getAllInfo } from "@/server/data/user-info";

export default async function ElectionGuidelines() {
  const existingGuidelines = await getElectionGuidelines();

  if (!existingGuidelines) {
    generateEmptyGuidelines();
  }

  const guidelines = await getElectionGuidelines();

  const infos = await getAllInfo();

  const guidelineDetails = {
    guidelines: guidelines,
    updatedResolutionBy: infos?.find(
      (user) => user.userId === guidelines?.updatedResolutionBy
    ),
    updatedQualificationsBy: infos?.find(
      (user) => user.userId === guidelines?.updatedQualificationsBy
    ),
    updatedFormBy: infos?.find(
      (user) => user.userId === guidelines?.updatedFormBy
    ),
  };

  return <Guidelines guidelineDetails={guidelineDetails} />;
}
