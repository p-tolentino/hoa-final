import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { Flex } from "@chakra-ui/react";
import { Sidebar } from "@/components/system/Sidebar";

import { UserRole } from "@prisma/client";
import { currentRole } from "@/lib/auth";
import Link from "next/link";

import { FaUserShield as Admin } from "react-icons/fa";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const role = await currentRole();

  return role === UserRole.USER ? (
    <div className="flex items-center justify-center min-h-full align-middle">
      <Card className="w-[600px] mt-10">
        <CardHeader>
          <p className="flex justify-center text-2xl font-semibold">
            <Admin className="mr-2 text-3xl" />
            Admin-only Access
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormError message="You do not have permission to view this page." />
          <div className="flex items-center justify-center">
            <Link href="/user">
              <Button className="text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600">
                ← Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <Flex>
      <Sidebar />
      <Flex flexDir={"column"} w="100%" className="p-10">
        {children}
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
