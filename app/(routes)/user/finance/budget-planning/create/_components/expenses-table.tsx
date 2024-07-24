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
import { useFormContext } from "react-hook-form";
import { NewBudgetPlanSchema } from "@/server/schemas";
import * as z from "zod";
import { FormField } from "@/components/ui/form";

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(numericAmount);
};

export const ExpenseTable = () => {
  const form = useFormContext<z.infer<typeof NewBudgetPlanSchema>>();
  const [total, setTotal] = useState<number | null>(null);
  const selectedYear = form.watch("forYear"); // This watches the `forYear` field

  const cybSalariesBenefits = form.watch("cybSalariesBenefits");
  const cybUtilities = form.watch("cybUtilities");
  const cybOfficeSupplies = form.watch("cybOfficeSupplies");
  const cybRepairMaintenance = form.watch("cybRepairMaintenance");
  const cybDonations = form.watch("cybDonations");
  const cybFurnituresFixtures = form.watch("cybFurnituresFixtures");
  const cybRepresentation = form.watch("cybRepresentation");
  const cybLegalProfessionalFees = form.watch("cybLegalProfessionalFees");
  const cybAdministrativeCosts = form.watch("cybAdministrativeCosts");
  const cybOtherExp = form.watch("cybOtherExp");

  useEffect(() => {
    const salaryBenefits = parseFloat(cybSalariesBenefits.toString()) || 0;
    const utilities = parseFloat(cybUtilities.toString()) || 0;

    const supplies = parseFloat(cybOfficeSupplies.toString()) || 0;
    const maintenance = parseFloat(cybRepairMaintenance.toString()) || 0;
    const donations = parseFloat(cybDonations.toString()) || 0;
    const furnitureFixtureFees =
      parseFloat(cybFurnituresFixtures.toString()) || 0;
    const repFee = parseFloat(cybRepresentation.toString()) || 0;
    const legalFees = parseFloat(cybLegalProfessionalFees.toString()) || 0;
    const adminCost = parseFloat(cybAdministrativeCosts.toString()) || 0;
    const otherExp = parseFloat(cybOtherExp.toString()) || 0;

    const totalExp =
      salaryBenefits +
      utilities +
      supplies +
      maintenance +
      donations +
      furnitureFixtureFees +
      repFee +
      legalFees +
      adminCost +
      otherExp;
    setTotal(totalExp);
    form.setValue("cybTotalYearlyExp", totalExp);
  }, [
    form,
    cybSalariesBenefits,
    cybUtilities,
    cybOfficeSupplies,
    cybRepairMaintenance,
    cybDonations,
    cybFurnituresFixtures,
    cybRepresentation,
    cybLegalProfessionalFees,
    cybAdministrativeCosts,
    cybOtherExp,
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
              Expenses
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
            <Td px="1rem">Salaries and Benefits</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybSalariesBenefits"
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
            <Td px="1rem">Utilities</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybUtilities"
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
            <Td px="1rem">Office Supplies</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybOfficeSupplies"
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
            <Td px="1rem">Repair and Maintenance</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybRepairMaintenance"
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
            <Td px="1rem">Donations</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybDonations"
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
            <Td px="1rem">Furnitures and Fixtures</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybFurnituresFixtures"
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
            <Td px="1rem">Representation Expenses</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybRepresentation"
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
            <Td px="1rem">Legal & Professional Fees</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybLegalProfessionalFees"
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
            <Td px="1rem">Administrative Costs</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybAdministrativeCosts"
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
            <Td px="1rem">Other Expenses</Td>
            <Td px="2rem">
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name="cybOtherExp"
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
              Total Yearly Expense
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

export default ExpenseTable;
