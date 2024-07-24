"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SmallAddIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";

import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";

import React from "react";

export default function AddRelatives() {
  return (
    <Box w="40vw">
      <Text fontSize="xl" fontWeight="semibold">
        Relatives
      </Text>
      <FormControl>
        <Flex gap="1" mb="5px">
          <Input type="text" />
          <Select w="180px">
            <option value="child">Child</option>
            <option value="parent">Parent</option>
          </Select>
          <Button size="md" colorScheme="yellow">
            <SmallAddIcon /> Add
          </Button>
        </Flex>
      </FormControl>
      <ScrollArea className="h-40 border rounded-md">
        <div className="p-4">
          <div className="flex">
            <FaUser />
            <Text className="w-5 h-5 pt-1 mr-2" />
            Relative
          </div>
          <Separator className="my-2" />
        </div>
      </ScrollArea>
    </Box>
  );
}
