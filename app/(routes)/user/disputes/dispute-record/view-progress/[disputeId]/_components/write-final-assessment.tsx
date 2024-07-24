"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateDispute } from "@/server/actions/dispute";
import { createNotification } from "@/server/actions/notification";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ReportStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WriteFinalAssessment({
  reportDetails,
}: {
  reportDetails: any;
}) {
  const [isOpen, setIsOpen] = useState(false); // Dialog open state
  const [selectedOption, setSelectedOption] = useState("");
  const [finalReview, setFinalReview] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const router = useRouter();

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const toast = useToast();

  const onSubmit = async () => {
    setIsButtonClicked(true);
    const formData = {
      status: ReportStatus.CLOSED,
      finalReview: finalReview,
      finalReviewDate: new Date(),
      reasonToClose: `${
        selectedOption === "RESOLVED" ? "Resolved" : "Unresolved"
      }`,
    };

    await updateDispute(reportDetails.dispute.id, formData).then((data) => {
      console.log(data.success);
      setIsOpen(false);

      toast({
        title: `Dispute Case marked as ${selectedOption}`,
        description: `Dispute No.: #D${reportDetails.dispute.number
          .toString()
          .padStart(4, "0")}`,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
    });

    const notifNoticeData = {
      type: "dispute",
      title: `#D${reportDetails.dispute.number
        .toString()
        .padStart(4, "0")} Dispute Case: ${selectedOption}`,
      description: `The ${reportDetails.disputeType.title} dispute case has been concluded. Click here to view its progress details.`,
      linkToView: `/user/disputes/dispute-record/view-progress/${reportDetails.dispute.id}`,
    };
    await createNotification({
      ...notifNoticeData,
      recipient: reportDetails.dispute.personComplained,
    }).then((data) => {
      if (data.success) {
        console.log(data.success);
      }
    });

    await createNotification({
      ...notifNoticeData,
      recipient: reportDetails.dispute.submittedBy,
    }).then((data) => {
      if (data.success) {
        console.log(data.success);
      }
    });

    window.location.reload();
    router.refresh();
    router.push(
      `/user/disputes/dispute-record/view-progress/${reportDetails.dispute.id}`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" colorScheme="yellow">
          Write Final Assessment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Final Assessment</DialogTitle>
            <DialogDescription>
              Fill out the following fields to write the final assessment
              formulated by the committee for the dispute case.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack
            spacing="15px"
            my="1.5rem"
            h="300px"
            pr={3}
            overflowY="auto"
            fontFamily="font.body"
          >
            <Stack>
              <Text fontSize="sm" fontFamily="font.body">
                What is the committee&apos;s final verdict for this dispute
                case?
              </Text>
              <RadioGroup
                defaultValue=""
                size="sm"
                value={selectedOption}
                onChange={handleRadioChange}
              >
                <Stack
                  direction="column"
                  fontFamily="font.body"
                  textAlign="justify"
                >
                  <Box
                    pl="0.5rem"
                    bg={selectedOption === "RESOLVED" ? "yellow.100" : ""}
                  >
                    <Radio value="RESOLVED" colorScheme="yellow">
                      The dispute case has been formally{" "}
                      <span className="font-bold">RESOLVED</span> in accordance
                      with the committee&apos;s evaluation.
                    </Radio>
                  </Box>
                  <Box
                    pl="0.5rem"
                    bg={selectedOption === "UNRESOLVED" ? "red.100" : ""}
                  >
                    <Radio value="UNRESOLVED" colorScheme="red">
                      The dispute case has been formally concluded and marked as{" "}
                      <span className="font-bold">UNRESOLVED</span>. Further
                      action regarding the dispute shall be outside of the
                      committee&apos;s handling.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack>
              <Textarea
                fontSize="sm"
                fontFamily="font.body"
                placeholder={
                  "Provide a brief summary of the committee's final assessment in this dispute case..."
                }
                height="20vh"
                resize="none"
                onChange={(e) => setFinalReview(e.target.value)}
              />
            </Stack>
          </Stack>
          <DialogFooter>
            <Button
              size="sm"
              colorScheme="yellow"
              type="button"
              isLoading={isButtonClicked}
              loadingText="Closing"
              onClick={() => onSubmit()}
            >
              Finish Assessment and Close Dispute Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
