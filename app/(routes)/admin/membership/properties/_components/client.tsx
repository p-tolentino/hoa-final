"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PropertyColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { AddProperty } from "./add-property";

interface PropertyClientProps {
  data: PropertyColumn[];
}

export const PropertyClient: React.FC<PropertyClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Properties (${data.length})`}
          description="Manage properties within your area"
        />
        <AddProperty />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="address" />
    </>
  );
};
