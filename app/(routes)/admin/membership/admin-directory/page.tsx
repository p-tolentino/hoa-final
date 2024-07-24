import { format } from "date-fns";

import { AdminsClient } from "./_components/client";
import { AdminColumn } from "./_components/columns";
import { currentUser } from "@/lib/auth";
import { getAllUsers } from "@/server/data/user";
import { UserRole } from "@prisma/client";
import { getHoaInfo } from "@/server/data/hoa-info";

const Admins = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const users = await getAllUsers();

  if (!users) {
    return null;
  }

  const hoaInfo = await getHoaInfo();
  if (!hoaInfo) {
    return null;
  }

  const formattedUsers: AdminColumn[] = users.map((item) => ({
    id: item.id || "",
    name:
      `${item.info?.firstName || "-"} ${
        item.info?.middleName ? `${`${item.info?.middleName}`[0]}.` : ""
      } ${item.info?.lastName || ""}` || "",
    email: item.email || "",
    status: item.status || "",
    type: item.info?.type || "",
    position: item.info?.position || "",
    committee: item.info?.committee || "",
    phoneNumber: item.info?.phoneNumber || "",
    birthDay: item.info?.birthDay
      ? format(
          new Date(item.info?.birthDay)?.toISOString().split("T")[0],
          "MMMM dd, yyyy"
        )
      : "",
    address: item.info?.address || "",
    role: item.role || "",
    bio: item.info?.bio || "",
    image: item.image || "",
  }));

  const admins = formattedUsers.filter(
    (admin) =>
      admin.role === UserRole.SUPERUSER ||
      admin.role === UserRole.ADMIN ||
      admin.position !== "Member"
  );

  return (
    <div className="flex">
      <div className="flex-1 space-y-4">
        <AdminsClient data={admins} hoaInfo={hoaInfo} />
      </div>
    </div>
  );
};

export default Admins;
