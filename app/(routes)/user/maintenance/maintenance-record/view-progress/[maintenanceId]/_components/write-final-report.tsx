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
import { db } from "@/lib/db";
import {
  createTransaction,
  updateFunds,
} from "@/server/actions/hoa-transaction";
import { updateMaintenanceRequest } from "@/server/actions/maintenance-request";
import { createNotification } from "@/server/actions/notification";
import { newUserTransaction } from "@/server/actions/user-transactions";
import { getSoaByDate } from "@/server/data/soa";
import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { HoaTransactionType, PersonalInfo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WriteFinalReport({
  reportDetails,
}: {
  reportDetails: any;
}) {
  const [isOpen, setIsOpen] = useState(false); // Dialog open state
  const [selectedOption, setSelectedOption] = useState("");
  const [feeToIncur, setFeeToIncur] = useState("N/A");
  const [finalReport, setFinalReport] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const onSubmit = async () => {
    setIsButtonClicked(true);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const formData = {
      finalReview: finalReport,
      status: "Completed",
      feeToIncur: feeToIncur,
      finalReviewDate: new Date(),
    };

    await updateMaintenanceRequest(reportDetails.maintenance.id, formData).then(
      (data) => {
        console.log(data.success);
        toast({
          title: `Maintenance ticket marked as COMPLETE`,
          description: `Maintenance Ticket  No.: #M${reportDetails.maintenance.number
            .toString()
            .padStart(4, "0")}`,
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });
      }
    );

    if (feeToIncur !== "N/A") {
      const feeData = {
        type: HoaTransactionType.EXPENSE,
        purpose: "Repair and Maintenance",
        description: reportDetails.maintenanceType.title,
        amount: feeToIncur,
        dateIssued: new Date().toLocaleDateString(),
      };

      await createTransaction(feeData).then(async (data) => {
        if (data.success) {
          console.log(data.success);
          const hoa = await db.hoa.findFirst();
          await updateFunds(hoa!!.funds - parseInt(feeToIncur, 10)).then(
            (data) => {
              if (data.success) {
                console.log(data.success);
              }
            }
          );
        }
      });

      // // Send Notifications
      // const notifPaymentData = {
      //   type: "finance",
      //   recipient: reportDetails.maintenance.submittedBy,
      //   title: "Urgent: Payment Required (Maintenance Fees)",
      //   description: "Click here to proceed to payment",
      //   linkToView: `/user/finance/statement-of-account`,
      // };

      // await createNotification(notifPaymentData).then((data) => {
      //   if (data.success) {
      //     console.log(data.success);
      //   }
      // });
    }

    setIsOpen(false);
    router.refresh();
    router.push(
      `/user/maintenance/maintenance-record/view-progress/${reportDetails.maintenance.id}`
    );
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" colorScheme="yellow">
          Write Final Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Final Report</DialogTitle>
            <DialogDescription>
              Fill out the following fields as a guide to write the final report
              for the maintenance ticket.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack spacing="15px" my="1.5rem">
            <Stack>
              <Text fontSize="sm" fontFamily="font.body">
                What is the committee&apos;s final verdict for this maintenance
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
                    bg={selectedOption === "COMPLETED" ? "yellow.100" : ""}
                  >
                    <Radio value="COMPLETED" colorScheme="yellow">
                      The maintenance ticket has been officially{" "}
                      <span className="font-bold">COMPLETED</span>.
                    </Radio>
                  </Box>
                  <Box
                    pl="0.5rem"
                    bg={selectedOption === "COMPLETED_FEE" ? "orange.100" : ""}
                  >
                    <Radio value="COMPLETED_FEE" colorScheme="red">
                      The maintenance ticket has been officially{" "}
                      <span className="font-bold">COMPLETED</span> with an{" "}
                      <span className="font-semibold text-orange-700">
                        external fee incurred
                      </span>{" "}
                      to accomplish the maintenance service.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack>
              {selectedOption === "COMPLETED_FEE" && (
                <Flex
                  gap={2}
                  fontFamily="font.body"
                  fontSize="sm"
                  align="center"
                  justifyContent="center"
                  mt={2}
                >
                  <Text>External Maintenance Fee:</Text>
                  <Box>
                    <span>₱ </span>
                    <Input
                      type="number"
                      textAlign="right"
                      w="8rem"
                      size="sm"
                      placeholder="XXX"
                      onChange={(e) => setFeeToIncur(e.target.value)}
                    />
                  </Box>
                </Flex>
              )}
              <Textarea
                fontSize="sm"
                fontFamily="font.body"
                placeholder={
                  "Write the final report for this maintenance ticket..."
                }
                height="10vh"
                resize="none"
                onChange={(e) => setFinalReport(e.target.value)}
              />
            </Stack>
          </Stack>
          <DialogFooter>
            <Button
              size="sm"
              colorScheme="yellow"
              type="button"
              isLoading={isButtonClicked}
              loadingText="Submitting"
              onClick={() => onSubmit()}
            >
              Submit Final Report and Mark Ticket as Complete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
