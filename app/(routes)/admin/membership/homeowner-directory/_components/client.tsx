"use client";

import * as z from "zod";
import React from "react";
import { Heading } from "@/components/ui/heading";
import BackButton from "@/components/system/BackButton";

import { HomeownerColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import PDFTable from "@/components/system/PDFTable";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Hoa, Property } from "@prisma/client";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { VscRefresh as Refresh } from "react-icons/vsc";
import GeneratePDFButton from "@/components/system/GeneratePDFButton";

interface HomeownersClientProps {
  data: HomeownerColumn[];
  properties: Property[];
  hoaInfo: Hoa;
}
const SelectSchema = z.object({
  address: z.string(),
});

interface TableColumn {
  header: string;
  accessor: string;
}

export const HomeownersClient: React.FC<HomeownersClientProps> = ({
  data,
  properties,
  hoaInfo,
}) => {
  // Page Title and Description
  const pageTitle = `Homeowners (${data.length})`;
  const pageDescription = `Manage all registered system users in the Homeowners' Association.`;

  // Report Title and Description
  const reportTitle = `Homeowners Directory`;
  const reportSubtitle = `The consolidated list of registered system users in the Homeowners' Association.`;

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: "Status", accessor: "status" },
    { header: "Position", accessor: "position" },
    { header: "Committee", accessor: "committee" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  const { update } = useSession();

  const sortDataByPosition = (data: HomeownerColumn[]) => {
    return [...data].sort((a, b) => {
      // Prioritize any position not "Member" to appear first
      if (a.position !== "Member" && b.position === "Member") return -1;
      if (a.position === "Member" && b.position !== "Member") return 1;
      // Further sorting logic if needed, e.g., alphabetically by position
      return a.position.localeCompare(b.position);
    });
  };

  const [occupants, setOccupants] = useState<HomeownerColumn[]>(() =>
    sortDataByPosition(data)
  );

  const form = useForm<z.infer<typeof SelectSchema>>({
    defaultValues: {
      address: "",
    },
  });

  const address = form.watch("address");

  useEffect(() => {
    if (address) {
      properties.filter((property) => {
        if (property.id === address) {
          const houseMembers = data.filter(
            (dataItem) => property.id === dataItem?.address
          );
          const sortedMembers = sortDataByPosition(houseMembers);
          setOccupants(sortedMembers);
        }
      });
    } else {
      // Apply sorting whenever the address selection is cleared or data changes
      setOccupants(sortDataByPosition(data));
    }
  }, [address, data, properties]);

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
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

      {/* House Address Selection */}
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-3/5 mb-5">
                <FormLabel className="font-semibold">Homeowners of:</FormLabel>
                <div className="flex">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select a house address..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => {
                        return (
                          <SelectItem
                            key={property.id}
                            value={property.id || ""}
                          >
                            {property.address}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => form.reset()} ml={2}>
                    <Refresh fontSize="xl" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={form.watch("address") !== "" ? occupants : data}
        searchKey="name"
        height="44vh"
      />
    </>
  );
};
