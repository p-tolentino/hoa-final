import { currentUser } from "@/lib/auth";

const UserPage = async () => {
  const user = await currentUser();

  return (
    <div className="flex">
      <div>User: {JSON.stringify(user)}</div>
    </div>
  );
};

export default UserPage;
