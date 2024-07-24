"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  VStack,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { FormField, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { NewBudgetPlanSchema } from "@/server/schemas";
import * as z from "zod";

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numericAmount);
};

export const RevenueTable = () => {
  const form = useFormContext<z.infer<typeof NewBudgetPlanSchema>>();
  const [total, setTotal] = useState<number | null>(null);
  const selectedYear = form.watch("forYear"); // This watches the `forYear` field

  const cybAssocDues = form.watch("cybAssocDues");
  const cybToll = form.watch("cybToll");
  const cybFacility = form.watch("cybFacility");
  const cybConstruction = form.watch("cybConstruction");
  const cybCarSticker = form.watch("cybCarSticker");
  const cybOtherRev = form.watch("cybOtherRev");

  useEffect(() => {
    const assocDues = parseFloat(cybAssocDues.toString()) || 0;
    const tollFees = parseFloat(cybToll.toString()) || 0;
    const facilityRent = parseFloat(cybFacility.toString()) || 0;
    const constructFees = parseFloat(cybConstruction.toString()) || 0;
    const carStickers = parseFloat(cybCarSticker.toString()) || 0;
    const otherRev = parseFloat(cybOtherRev.toString()) || 0;

    const totalRev =
      assocDues +
      tollFees +
      facilityRent +
      constructFees +
      carStickers +
      otherRev;

    setTotal(totalRev);
    form.setValue("cybTotalYearlyRev", totalRev);
  }, [
    form,
    cybAssocDues,
    cybToll,
    cybFacility,
    cybConstruction,
    cybCarSticker,
    cybOtherRev,
  ]);

  return (
    <Box w="95%" mx={3}>
      <Table variant="simple" size="xs">
        <Thead bgColor="gray.100">
          <Tr h="3rem" fontSize="xs">
            <Th
              p="1rem"
              w="max-content"
              textTransform="uppercase"
              fontSize="lg"
              fontWeight="extrabold"
              fontFamily="font.heading"
              color="brand.500"
            >
              Revenue
            </Th>
            <Th
              p="1rem"
              fontFamily="font.heading"
              w="300px"
              textAlign="right"
              fontSize="sm"
            >
              Year Budget for {selectedYear}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr fontFamily="font.body">
            <Td px="1rem">Association Dues</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybAssocDues"
                  render={({ field }) => (
                    <>
                      <Input
                        size="sm"
                        type="number"
                        min="0" // Ensures that the browser enforces a minimum value of 0
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value >= 0) {
                            field.onChange(value);
                          }
                        }}
                        value={field.value}
                        textAlign="right"
                      />
                      <FormMessage />
                    </>
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily="font.body">
            <Td px="1rem">Toll Fees</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybToll"
                  render={({ field }) => (
                    <Input
                      size="sm"
                      type="number"
                      min="0" // Ensures that the browser enforces a minimum value of 0
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      textAlign="right"
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily="font.body">
            <Td px="1rem">Facility Rentals</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybFacility"
                  render={({ field }) => (
                    <Input
                      size="sm"
                      type="number"
                      min="0" // Ensures that the browser enforces a minimum value of 0
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      textAlign="right"
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily="font.body">
            <Td px="1rem">Renovation and Demolition Fees</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybConstruction"
                  render={({ field }) => (
                    <Input
                      size="sm"
                      type="number"
                      min="0" // Ensures that the browser enforces a minimum value of 0
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      textAlign="right"
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily="font.body">
            <Td px="1rem">Car Sticker Receipts</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybCarSticker"
                  render={({ field }) => (
                    <Input
                      size="sm"
                      type="number"
                      min="0" // Ensures that the browser enforces a minimum value of 0
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      textAlign="right"
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily="font.body">
            <Td px="1rem">Other Revenues</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱{" "}
                <FormField
                  control={form.control}
                  name="cybOtherRev"
                  render={({ field }) => (
                    <Input
                      size="sm"
                      type="number"
                      min="0" // Ensures that the browser enforces a minimum value of 0
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      textAlign="right"
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr h="3rem" key="total" fontFamily="font.body" bg="brand.400">
            <Td px="1rem" textTransform="uppercase" fontWeight="bold">
              Total Yearly Revenue
            </Td>
            <Td px="3rem" textAlign="right" fontSize="lg" fontWeight="bold">
              {total !== null ? `${formatCurrency(total)}` : ""}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default RevenueTable;
