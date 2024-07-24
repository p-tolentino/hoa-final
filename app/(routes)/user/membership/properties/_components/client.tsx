"use client";

import { Hoa, UserRole } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";
import { AddProperty } from "./add-property";
import { PropertyColumn, columns } from "./columns";
import { Box, ButtonGroup, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/system/BackButton";
import GeneratePDFButton from "@/components/system/GeneratePDFButton";
import { useCurrentUser } from "@/hooks/use-current-user";

interface PropertyClientProps {
  data: PropertyColumn[];
  hoaInfo: Hoa;
}

export const PropertyClient: React.FC<PropertyClientProps> = ({
  data,
  hoaInfo,
}: PropertyClientProps) => {
  // Page Title and Description
  const pageTitle = `HOA Properties `;
  const pageDescription = `Manage properties in the Homeowners' Association.`;

  // Report Title and Description
  const reportTitle = `HOA Properties`;
  const reportSubtitle = `The consolidated list of properties in the Homeowners' Association.`;

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: "Address", accessor: "address" },
    { header: "Lot Number", accessor: "lotNumber" },
    { header: "Lot Size", accessor: "lotSize" },
    { header: "Purchase Date", accessor: "purchaseDate" },
  ];

  const user = useCurrentUser();
  const [sortedData, setSortedData] = useState<PropertyColumn[]>([]);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => a.address.localeCompare(b.address));
    setSortedData(sorted);
  }, [data]);

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup dir="column">
            <GeneratePDFButton
              reportTitle={reportTitle}
              reportSubtitle={reportSubtitle}
              columns={reportTableColumns}
              data={data}
              hoaInfo={hoaInfo}
            />
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Top Section */}
      <Flex justifyContent="space-between">
        <Box>
          {/* Section Title */}
          <Text fontSize="xl" fontFamily="font.heading" fontWeight="bold">
            Properties ({data.length})
          </Text>
        </Box>
        {(user?.role === UserRole.ADMIN ||
          user?.role === UserRole.SUPERUSER) && <AddProperty />}
      </Flex>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedData}
        searchKey="address"
        height="50vh"
      />
    </>
  );
};
