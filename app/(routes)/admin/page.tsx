import { currentUser } from "@/lib/auth";

const AdminPage = async () => {
  const user = await currentUser();

  return (
    <div className="flex p-10">
      <div>Admin: {JSON.stringify(user)}</div>
    </div>
  );
};

export default AdminPage;
