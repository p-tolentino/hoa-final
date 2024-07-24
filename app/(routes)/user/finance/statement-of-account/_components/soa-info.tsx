"use client";

import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Heading } from "@/components/ui/heading";
import { FaFilePdf } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useReactToPrint } from "react-to-print";
import { VscRefresh as Refresh } from "react-icons/vsc";
import React, { useState, useTransition } from "react";
import * as z from "zod";
import BackButton from "@/components/system/BackButton";
import SoaTableSummary from "./soa-table-summary";
import { Heading as HeadingChakra } from "@chakra-ui/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Spinner,
  ButtonGroup,
  Stack,
} from "@chakra-ui/react";
import {
  Hoa,
  MonthlySoa,
  Property,
  SoaPayment,
  UserTransaction,
} from "@prisma/client";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";

interface SoaInfoProps {
  property: Property;
  allTransactions: UserTransaction[];
  allSoas: MonthlySoa[] | null | undefined;
  allSoaPayments: SoaPayment[] | null | undefined;
  hoaInfo?: Hoa;
}

const SelectSchema = z.object({
  soaId: z.string(),
});

export const SoaInfo: React.FC<SoaInfoProps> = ({
  property,
  allTransactions,
  allSoas,
  allSoaPayments,
  hoaInfo,
}) => {
  // Page Title and Description
  const pageTitle = `Statement of Account`;
  const pageDescription =
    "Access your statement of account to the Homeowners' Association.";

  // Report Title and Description
  const reportTitle = `${pageTitle}`;
  const reportSubtitle = `${pageDescription}`;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const user = useCurrentUser();
  const [soa, setSoa] = useState<MonthlySoa | null | undefined>(null);
  const [transactions, setTransactions] = useState<UserTransaction[] | null>(
    []
  );
  const [payments, setPayments] = useState<SoaPayment[] | null | undefined>([]);
  const [isPending, startTransition] = useTransition();
  const [formResetting, resettingForm] = useTransition();

  const componentPDF = useRef<HTMLDivElement | null>(null);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: `${pageTitle}`,
  });

  const form = useForm<z.infer<typeof SelectSchema>>({
    defaultValues: {
      soaId: "",
    },
  });

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const assocDues = transactions?.filter((transaction) => {
    if (transaction.purpose === "Association Dues") {
      return transaction;
    }
  });

  const violationFees = transactions?.filter((transaction) => {
    if (transaction.purpose === "Violation Fines") {
      return transaction;
    }
  });

  const facilityFees = transactions?.filter((transaction) => {
    if (transaction.purpose === "Facility Reservation Fees") {
      return transaction;
    }
  });

  const summarySoa = [
    {
      purpose: "Association Dues",
      debit: (() => {
        let paidSum = 0;

        assocDues?.forEach((fee) => {
          paidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return paidSum;
      })(),
      credit: (() => {
        let unpaidSum = 0;

        assocDues?.forEach((fee) => {
          unpaidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return unpaidSum;
      })(),
    },
    {
      purpose: "Violation Fines",
      debit: (() => {
        let paidSum = 0;

        violationFees?.forEach((fee) => {
          paidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return paidSum;
      })(),
      credit: (() => {
        let unpaidSum = 0;

        violationFees?.forEach((fee) => {
          unpaidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return unpaidSum;
      })(),
    },
    {
      purpose: "Facility Reservation Fees",
      debit: (() => {
        let paidSum = 0;

        facilityFees?.forEach((fee) => {
          paidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return paidSum;
      })(),
      credit: (() => {
        let unpaidSum = 0;

        facilityFees?.forEach((fee) => {
          unpaidSum += parseFloat(fee.amount.toString().replace(/,/g, ""));
        });

        return unpaidSum;
      })(),
    },
  ];

  const soaId = form.watch("soaId");

  useEffect(() => {
    const fetchData = async () => {
      const transactions = await allTransactions.filter(
        (transaction) => transaction.soaId === soaId
      );
      const payments = await allSoaPayments
        ?.filter((payment) => payment.soaId === soaId)
        .sort((a: any, b: any) => a.datePaid - b.datePaid);
      const soa = await allSoas?.find((soa) => soa.id === soaId);
      setTransactions(transactions);
      setSoa(soa);
      setPayments(payments);
    };
    startTransition(() => {
      fetchData();
    });
  }, [soaId, allSoaPayments, allSoas, allTransactions]);

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <Button
              size="sm"
              variant="outline"
              colorScheme="orange"
              leftIcon={<FaFilePdf />}
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Homeowner Details */}
      <Box border="1px solid lightgray" borderRadius="md" p={5}>
        <div ref={componentPDF} style={{ width: "100%" }}>
          <Stack spacing={3}>
            {/* Report Header */}
            <Flex
              bg="brand.500"
              color="brand.400"
              h="70px"
              p={2}
              gap={3}
              className="report-header"
            >
              <NextImage
                src={SystemLogo}
                alt="HOAs.is Logo"
                width={100}
                height={70}
                className="m-2"
              />
              <Box m={2} lineHeight={1.1}>
                <Text fontSize="lg" fontFamily="font.heading" fontWeight="bold">
                  {hoaInfo?.name}
                </Text>
                <Flex gap={10}>
                  <Flex fontFamily="font.body" gap={3}>
                    <span>Contact Number: </span>
                    {hoaInfo?.contactNumber}
                  </Flex>
                </Flex>
              </Box>
            </Flex>
            <Box className="report-content" alignSelf="center">
              {/* Report Title, Subtitle, and Date */}
              <Box mt={5} mb={3}>
                <HeadingChakra
                  fontSize="xl"
                  textAlign="center"
                  fontFamily="font.heading"
                >
                  {reportTitle}
                </HeadingChakra>
                <Text
                  fontSize="xl"
                  textAlign="center"
                  color="gray.600"
                  fontFamily="font.body"
                >
                  {reportSubtitle}
                </Text>
                <Text
                  textAlign="center"
                  color="gray.500"
                  fontFamily="font.body"
                  mt={1}
                >
                  Date Generated: {currentDate}
                </Text>
                <Flex
                  justifyContent="space-between"
                  fontFamily="font.body"
                  m={5}
                >
                  <Flex>
                    {user?.info && property.address && (
                      <Box mr="30px" mb="30px">
                        <Text>Homeowner:</Text>
                        <Text>Address:</Text>
                      </Box>
                    )}
                    <Box>
                      {user?.info && property.address ? (
                        <>
                          <Text fontWeight="semibold">{`${user?.info.firstName} ${user?.info.lastName}`}</Text>
                          <Text fontWeight="semibold">{property.address}</Text>
                        </>
                      ) : (
                        <Text color="gray.300" as="i" ml={10}>
                          [Please refresh the page to display homeowner
                          information.]
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Flex>
                <VStack fontFamily="font.body" mx={5}>
                  {formResetting ? (
                    <Spinner />
                  ) : (
                    <Form {...form}>
                      <form>
                        <FormField
                          control={form.control}
                          name="soaId"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex">
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-[300px]">
                                      <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="overflow-y">
                                    {allSoas?.map((soa) => (
                                      <SelectItem
                                        key={soa.id}
                                        value={soa.id}
                                        className="flex items-center justify-between"
                                      >
                                        {`${month[soa.forMonth]} ${
                                          soa.forYear
                                        }`}
                                        {soa.total !== 0 && (
                                          <Badge
                                            className={`ml-8 mr-3 ${
                                              soa.status === "PAID"
                                                ? "bg-green-700"
                                                : soa.status === "OVERDUE"
                                                ? "bg-red-700"
                                                : "bg-yellow-600"
                                            }`}
                                          >
                                            {soa.status}
                                          </Badge>
                                        )}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    form.reset();
                                    resettingForm(() => {});
                                  }}
                                  ml={2}
                                >
                                  <Refresh fontSize="xl" />
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}
                  <Box mt="15px">
                    {isPending ? (
                      <Spinner />
                    ) : (
                      form.watch("soaId") !== "" && (
                        <SoaTableSummary
                          soa={soa}
                          payments={payments}
                          data={summarySoa}
                          transactionsToUpdate={allTransactions.filter(
                            (transaction) => transaction.soaId === soa?.id
                          )}
                        />
                      )
                    )}
                  </Box>
                </VStack>
              </Box>
            </Box>
          </Stack>
        </div>
      </Box>
    </>
  );
};

export default SoaInfo;
