"use client";

import { Sidebar } from "@/components/system/Sidebar";
import { Flex } from "@chakra-ui/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import InfoGate from "./_components/info-gate";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  if (user?.role === UserRole.ADMIN) {
    router.replace("/admin");
  }

  return user?.role !== UserRole.ADMIN &&
    !user?.info &&
    pathname !== "/user/settings" ? (
    <InfoGate />
  ) : (
    <Flex>
      <Sidebar />
      <Flex flexDir={"column"} w="100%" className="p-10">
        {children}
      </Flex>
    </Flex>
  );
};
export default UserLayout;
