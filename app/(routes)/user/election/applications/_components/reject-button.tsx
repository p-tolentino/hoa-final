import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateCandidacy } from "@/server/actions/candidate-form";
import { Button, Textarea, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Candidates } from "@prisma/client";

interface Application {
  id: string;
  term: string;
  status: string;
  applicant: string;
  application: Candidates;
}

interface RejectApplicationButtonProps {
  application: Application;
}

const RejectApplicationButton: React.FC<RejectApplicationButtonProps> = ({
  application,
}) => {
  const [reasonOfRejection, setReasonOfRejection] = useState("");
  const toast = useToast();
  const route = useRouter();

  const onSubmit = async () => {
    await updateCandidacy(application.id, {
      status: "REJECTED",
      reasonToReject: reasonOfRejection,
    }).then((data) => {
      console.log(data);
      route.refresh();
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button key={application.id} colorScheme="red">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Candidate Application</DialogTitle>
            <DialogDescription>
              By rejecting the candidate application of{" "}
              <span className="font-semibold">{application.applicant}</span>,{" "}
              <br />
              you are preventing them from running for a board member position
              in the Homeowners&apos; Association for the{" "}
              <span className="font-semibold">
                {application.term} Elections
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <Textarea
            fontSize="sm"
            fontFamily="font.body"
            placeholder={
              "Write a brief description of why this candidate application has been rejected..."
            }
            height="15vh"
            resize="none"
            my={3}
            onChange={(e) => setReasonOfRejection(e.target.value)}
          />
          <DialogFooter>
            <Button colorScheme="red" onClick={() => onSubmit()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RejectApplicationButton;
