import { format } from "date-fns";

import { PaymentHistoryClient } from "./_components/client";
import { PaymentHistoryColumn } from "./_components/columns";
import { currentUser } from "@/lib/auth";
import { getInfoById } from "@/server/data/user-info";
import { getTransactionByAddress } from "@/server/data/user-transactions";
import { getHoaInfo } from "@/server/data/hoa-info";

const PaymentHistory = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const info = await getInfoById(user.id);
  if (!info?.address) {
    return null;
  }

  const hoaInfo = await getHoaInfo();
  if (!hoaInfo) {
    return null;
  }

  const transactions = await getTransactionByAddress(info.address);
  if (!transactions) {
    return null;
  }

  const formattedHistoryPromises: Promise<PaymentHistoryColumn>[] = transactions
    .filter((item) => (item.status === "PAID") || (item.status =="UNSETTLED"))
    .map(async (item) => {
      let personal;
      if (item.paidBy) {
        personal = await getInfoById(item.paidBy);
      }

      return {
        id: item.id,
        status: item.status || "",
        amount: item.amount.toString() || "",
        purpose: item.purpose || "",
        description: item.description || "",
        createdAt: item.createdAt
          ? format(
              new Date(item.createdAt + "Z")?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        datePaid: item.datePaid
          ? format(
              new Date(item.datePaid + "Z")?.toISOString().split("T")[0],
              "MMMM dd, yyyy"
            )
          : "",
        paidBy:
          `${personal?.lastName || "-"} ${
            personal?.middleName ? `${`${personal.middleName}`[0]}.` : ""
          } ${personal?.firstName || ""}` || "",
      };
    });

  const formattedRecords = await Promise.all(formattedHistoryPromises);

  return (
    <div className="flex">
      <div className="flex-1 space-y-4">
        <PaymentHistoryClient data={formattedRecords} hoaInfo={hoaInfo} />
      </div>
    </div>
  );
};

export default PaymentHistory;
