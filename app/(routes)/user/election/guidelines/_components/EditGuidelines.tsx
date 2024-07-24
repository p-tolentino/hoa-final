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
import { updateElectionGuidelines } from "@/server/actions/election-guidelines";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface EditGuidelinesProps {
  guidelines: string[];
  guidelinesId: string;
}

function EditGuidelines({ guidelines, guidelinesId }: EditGuidelinesProps) {
  const [electionGuidelines, setElectionGuidelines] = useState(guidelines);
  const [newGuideline, setNewGuideline] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  const handleAddGuideline = () => {
    if (newGuideline) {
      setElectionGuidelines([...electionGuidelines, newGuideline]);
      setNewGuideline("");
    }
  };

  const handleEditGuideline = (index: number, value: string) => {
    const updatedGuidelines = [...electionGuidelines];
    updatedGuidelines[index] = value;
    setElectionGuidelines(updatedGuidelines);
  };

  const onSubmit = async () => {
    await updateElectionGuidelines(guidelinesId, {
      boardResolution: electionGuidelines,
      updatedResolutionDate: new Date(),
      updatedResolutionBy: user?.id,
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
            <DialogTitle>Edit Board Resolution</DialogTitle>
            <DialogDescription>
              You may edit the board resolution contents below.
            </DialogDescription>
          </DialogHeader>

          <Box h="50vh" overflowY="auto" pl={3}>
            <FormControl>
              <OrderedList fontFamily="font.body" fontSize="sm">
                {electionGuidelines.map((guideline, index) => (
                  <ListItem key={index}>
                    <Input
                      value={guideline}
                      onChange={(e) =>
                        handleEditGuideline(index, e.target.value)
                      }
                      mb={2}
                    />
                  </ListItem>
                ))}
                <ListItem>
                  <Input
                    placeholder="Add new guideline..."
                    value={newGuideline}
                    onChange={(e) => setNewGuideline(e.target.value)}
                    mb={2}
                  />
                  <Button
                    onClick={handleAddGuideline}
                    size="sm"
                    mt={2}
                    leftIcon={<AddIcon />}
                  >
                    Add Guideline
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

export default EditGuidelines;
