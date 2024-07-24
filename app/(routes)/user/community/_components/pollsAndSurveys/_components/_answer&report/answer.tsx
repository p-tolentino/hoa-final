"use client";

import { db } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon } from "@chakra-ui/icons";
import {
  Stack,
  Text,
  Box,
  Divider,
  Radio,
  RadioGroup,
  Button,
  Spinner,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";

import { Polls, User } from "@prisma/client";
import {
  getQuestionsAndOptionsByPollId,
  hasUserAnsweredPoll,
} from "@/server/data/polls";
import { createResponse } from "@/server/actions/poll";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PollProps {
  poll: Polls;
  user: string;
}

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface PollDetails {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function Answer({ poll, user }: PollProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [pollDetails, setPollDetails] = useState<Question[] | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [hasAnswered, setHasAnswered] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPollDetails = async () => {
      const response = await getQuestionsAndOptionsByPollId(poll.id);
      console.log("the value queried is", response);

      setPollDetails(response);
    };
    console.log("poll details are now", pollDetails);

    fetchPollDetails();

    const checkAnswerStatus = async () => {
      const answered = await hasUserAnsweredPoll(poll.id);
      setHasAnswered(answered);
    };

    checkAnswerStatus();
  }, [pollDetails, poll.id, user]); // Dependency array ensures this effect runs once per poll ID

  if (!pollDetails) {
    return (
      <div>
        <Spinner size="sm" thickness="1px" />
      </div>
    ); // Handle loading state
  }

  const onSubmit = async () => {
    setIsButtonClicked(true);

    try {
      const responsePromises = Object.entries(responses).map(
        ([questionId, optionId]) =>
          createResponse(poll.id, questionId, optionId)
      );

      await Promise.all(responsePromises);
      alert("Responses submitted successfully!");
      setIsOpen(false); // Close dialog upon success
      router.refresh(); // Refresh the page or navigate as needed

      // Optionally, reset the responses state or navigate the user to another page
      setResponses({});
    } catch (error) {
      console.error("Failed to submit responses:", error);
      alert("Failed to submit responses.");
    }
  };

  const checkIfAnswered = async () => {
    if (hasAnswered) {
      alert("You have already answered this poll.");
    } else {
      setIsOpen(true); // Open the dialog if the user hasn't answered
    }
  };

  return (
    <>
      <Button
        size="sm"
        fontFamily="font.body"
        variant="outline"
        colorScheme="yellow"
        leftIcon={<EditIcon />}
        onClick={checkIfAnswered}
        disabled={hasAnswered === true} // Disable the button if the user has already answered
        display={isOpen ? "none" : "visible"}
      >
        Answer
      </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              fontFamily="font.body"
              variant="outline"
              colorScheme="yellow"
              leftIcon={<EditIcon />}
              disabled={true} // This button is hidden since the dialog is controlled by the state.
            >
              Answer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[500px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-left">{poll.title}</DialogTitle>
              <DialogDescription className="text-left">
                Answer Survey or Poll
              </DialogDescription>
            </DialogHeader>

            <Stack spacing="15px">
              {pollDetails &&
                pollDetails.map((question, questionIndex) => (
                  <React.Fragment key={question.id}>
                    <Box lineHeight={1.5}>
                      <Text fontSize="sm" fontWeight="semibold" mt={3}>
                        Question {questionIndex + 1}:
                      </Text>
                      <Text
                        fontSize="sm"
                        fontFamily="font.body"
                        textAlign="justify"
                      >
                        {question.text}
                      </Text>
                    </Box>
                    <RadioGroup
                      size="sm"
                      fontFamily="font.body"
                      ml={5}
                      colorScheme="yellow"
                      onChange={(selectedOption) =>
                        setResponses((prev) => ({
                          ...prev,
                          [question.id]: selectedOption,
                        }))
                      }
                      value={responses[question.id] || ""}
                    >
                      <Stack spacing={2}>
                        {question.options.map((option) => (
                          <Radio key={option.id} value={option.id}>
                            {option.text}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  </React.Fragment>
                ))}
            </Stack>

            <DialogFooter>
              <Button
                w="max-content"
                size="sm"
                colorScheme="yellow"
                type="submit"
                isLoading={isButtonClicked}
                loadingText="Submitting"
                onClick={onSubmit}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
