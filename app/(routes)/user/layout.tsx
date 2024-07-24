import { Sidebar } from "@/components/system/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import { Status, UserRole } from "@prisma/client";
import InfoGate from "./_components/info-gate";
import ApprovalGate from "./_components/approval-gate";
import { getNotificationsByUserId } from "@/server/data/notification";
import { getHoaInfo } from "@/server/data/hoa-info";
import SysSetupGate from "./_components/system-setup-gate";
import { currentUser } from "@/lib/auth";
import AdminGate from "./_components/admin-gate";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const existingHoaInfo = getHoaInfo();

  const isAdmin = user?.role === UserRole.ADMIN;
  const existingUserInfo = user?.info;
  const uploadedGovId = user?.info.govtId;
  const isApproved = user?.status != Status.PENDING;

  if (isAdmin) {
    return <AdminGate />;
  }

  const notifications = await getNotificationsByUserId(user?.id);

  // check if user/settings
  return !existingHoaInfo ? (
    <SysSetupGate />
  ) : !isAdmin && !existingUserInfo && !uploadedGovId ? (
    <InfoGate />
  ) : !isAdmin && existingUserInfo && uploadedGovId && !isApproved ? (
    <ApprovalGate />
  ) : (
    <>
      <Flex>
        <Sidebar
          notifications={
            notifications
              ?.filter((notif) => notif.isArchived === false)
              .sort((a: any, b: any) => b.createdAt - a.createdAt) || null
          }
        />
        <Box className="p-10" w="100%">
          {children}
        </Box>
      </Flex>
    </>
  );
};
export default UserLayout;
