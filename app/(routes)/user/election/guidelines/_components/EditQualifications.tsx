"use client";

import {
  Button,
  FormControl,
  OrderedList,
  ListItem,
  Input,
  Box,
  Select,
  IconButton,
} from "@chakra-ui/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { updateElectionGuidelines } from "@/server/actions/election-guidelines";
import { useCurrentUser } from "@/hooks/use-current-user";

interface EditQualificationsProps {
  qualifications: string[];
  guidelinesId: string;
}

function EditQualifications({
  qualifications,
  guidelinesId,
}: EditQualificationsProps) {
  const [electionQualifications, setElectionQualifications] =
    useState(qualifications);
  const [newQualification, setNewQualification] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  const handleAddQualification = () => {
    if (newQualification) {
      setElectionQualifications([...electionQualifications, newQualification]);
      setNewQualification("");
    }
  };

  const handleEditQualification = (index: number, value: string) => {
    const updatedQualifications = [...electionQualifications];
    updatedQualifications[index] = value;
    setElectionQualifications(updatedQualifications);
  };

  const onSubmit = async () => {
    await updateElectionGuidelines(guidelinesId, {
      qualifications: electionQualifications,
      updatedQualificationsDate: new Date(),
      updatedQualificationsBy: user?.id,
    });
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <IconButton aria-label="Edit" size="xs" icon={<EditIcon />} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Qualifications</DialogTitle>
            <DialogDescription>
              You may edit the qualifications of board members below.
            </DialogDescription>
          </DialogHeader>

          <Box h="50vh" overflowY="auto" pl={3}>
            <FormControl>
              <OrderedList fontFamily="font.body" fontSize="sm">
                {electionQualifications.map((qualification, index) => (
                  <ListItem key={index}>
                    <Input
                      value={qualification}
                      onChange={(e) =>
                        handleEditQualification(index, e.target.value)
                      }
                      mb={2}
                    />
                  </ListItem>
                ))}
                <ListItem>
                  <Input
                    placeholder="Add new qualification..."
                    value={newQualification}
                    onChange={(e) => setNewQualification(e.target.value)}
                    mb={2}
                  />
                  <Button
                    onClick={handleAddQualification}
                    size="sm"
                    mt={2}
                    leftIcon={<AddIcon />}
                  >
                    Add Qualification
                  </Button>
                </ListItem>
              </OrderedList>
            </FormControl>
          </Box>

          <DialogFooter>
            <Button size="sm" colorScheme="yellow" onClick={onSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditQualifications;
