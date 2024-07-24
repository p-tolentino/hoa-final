import { ElectionContactsClient } from "./_components/client";
import { ElectionContactsColumn } from "./_components/columns";
import { currentUser } from "@/lib/auth";
import { getAllUsers } from "@/server/data/user";
import { getHoaInfo } from "@/server/data/hoa-info";

const ElectionContacts = async () => {
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

  const formattedUsers: ElectionContactsColumn[] = users.map((item) => ({
    id: item.id || "",
    name:
      `${item.info?.firstName || "-"} ${
        item.info?.middleName ? `${`${item.info?.middleName}`[0]}.` : ""
      } ${item.info?.lastName || ""}` || "",
    email: item.email || "",

    position: item.info?.position || "",
    committee: item.info?.committee || "",
    phoneNumber: item.info?.phoneNumber || "",
    role: item.role || "",
  }));

  const electionContacts = formattedUsers.filter(
    (user) => user?.committee === "Election Committee"
  );

  return (
    <div className="flex">
      <div className="flex-1 space-y-4">
        <ElectionContactsClient data={electionContacts} hoaInfo={hoaInfo} />
      </div>
    </div>
  );
};

export default ElectionContacts;
