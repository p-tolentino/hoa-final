import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";

const UserPage = async () => {
  const user = await currentUser();

  return (
    <div className="flex">
      <div>User: {JSON.stringify(user)}</div>
      <LogoutButton>
        <Button className="ml-10">Logout</Button>
      </LogoutButton>
    </div>
  );
};

export default UserPage;
