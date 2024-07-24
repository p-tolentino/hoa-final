"use client";

import {
  Stack,
  Text,
  Box,
  Checkbox,
  CheckboxGroup,
  Button,
  HStack,
  Flex,
  useToast,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ElectionSettings, Candidates, VoteResponse } from "@prisma/client";
import ViewInfo from "./view-info";
import { createElectionVote } from "@/server/actions/election-vote";
import { useCurrentUser } from "@/hooks/use-current-user";
import { format } from "date-fns";

interface ElectionVoteProps {
  election: ElectionSettings;
  candidates: Candidates[];
  votes: VoteResponse[];
}

function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString(); // Format the date as needed
}

export default function AnswerElection({
  election,
  candidates,
  votes,
}: ElectionVoteProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isVotingPeriod, setIsVotingPeriod] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const userInfo = useCurrentUser();

  useEffect(() => {
    const now = new Date();
    const startElectDate = new Date(election.startElectDate);
    const endElectDate = new Date(election.endElectDate);

    setIsVotingPeriod(now >= startElectDate && now <= endElectDate);

    // Check if the user has already voted
    const userHasVoted = votes.some((vote) => vote.userId === userInfo?.id);
    setHasVoted(userHasVoted);
  }, [election.startElectDate, election.endElectDate, votes, userInfo?.id]);

  const handleSelectionChange = (selectedIds: string[]) => {
    if (selectedIds.length <= election.totalBoardMembers) {
      setSelectedCandidates(selectedIds);
    } else {
      alert(
        `You can only select up to ${election.totalBoardMembers} candidates.`
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const responsePromises = selectedCandidates.map((candidateId) =>
        createElectionVote(election.id, candidateId)
      );

      await Promise.all(responsePromises);
      toast({
        title: `Votes Submitted`,
        description: `Election Term: ${election.termOfOffice}`,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      router.push("/user/election/election-record"); // Redirect to the "thank you" page upon success
    } catch (error) {
      console.error("Failed to submit votes:", error);
      toast({
        title: `Votes Submission Failed`,
        description: `Election Term: ${election.termOfOffice}`,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <Box w="max-content">
        <Stack spacing="10px">
          <HStack spacing={5}>
            <Text fontSize="sm" fontWeight="semibold">
              Election Title:
            </Text>
            <Text fontSize="sm">
              {election.title
                ? election.title
                : `${election.termOfOffice} Elections`}
            </Text>
          </HStack>
          <HStack spacing={5}>
            <Text fontSize="sm" fontWeight="semibold">
              Voting Period
            </Text>
            <Text fontSize="sm">
              {format(election.startElectDate, "MMMM dd, yyyy")} -{" "}
              {format(election.endElectDate, "MMMM dd, yyyy")}
            </Text>
          </HStack>
          <HStack spacing={5}>
            <Text fontSize="sm" fontWeight="semibold">
              Total No. of Board Members to vote:
            </Text>
            <Text fontSize="sm">{election.totalBoardMembers}</Text>
          </HStack>
          <Stack spacing={3} my={5}>
            <Text fontSize="sm" fontWeight="semibold">
              Please select from the list of board member candidates below:
            </Text>
            <CheckboxGroup
              size="sm"
              value={selectedCandidates}
              colorScheme="yellow"
              onChange={handleSelectionChange}
            >
              <Stack spacing={2} fontFamily="font.body" ml={3}>
                {candidates.map((candidate) => (
                  <HStack key={candidate.id} spacing={2}>
                    <Checkbox value={candidate.id}>
                      {candidate.fullName}
                    </Checkbox>
                    <ViewInfo candidateInfo={candidate} />
                  </HStack>
                ))}
              </Stack>
            </CheckboxGroup>
          </Stack>
        </Stack>
      </Box>

      <Box my={5}>
        <Flex justifyContent="left" w="100%" gap={3} flexDirection="column">
          {isVotingPeriod && !hasVoted && (
            <Button
              size="sm"
              colorScheme="yellow"
              type="submit"
              w="max-content"
              onClick={handleSubmit}
              disabled={!isVotingPeriod}
            >
              Submit Votes
            </Button>
          )}
          {!isVotingPeriod && (
            <Text fontSize="sm" color="red.500" mt={2}>
              It is not yet the voting period.
            </Text>
          )}
          {hasVoted && (
            <Box p="10px" mt={5}>
              <Text fontSize="sm" fontWeight="semibold" color="red.500">
                You have already voted in this election.
              </Text>
            </Box>
          )}
        </Flex>
      </Box>
    </>
  );
}
