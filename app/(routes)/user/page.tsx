import { currentUser } from "@/lib/auth";

import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";
import Link from "next/link";

const UserPage = async () => {
  const user = await currentUser();
  const now = new Date();

  return (
    <div className="flex flex-col p-10 gap-8">
      {/* <div>
        <NextImage
          src={SystemLogo}
          alt="HOAs.is Logo"
          width={100}
          height={100}
          className="bg-[#355E3B]"
        />
      </div> */}
      <div>
        Today is {now.toDateString()}, {now.toLocaleTimeString()}
      </div>
      <div>
        <div>
          Welcome back,{" "}
          <span className="font-semibold">{user?.info.firstName}</span>!
        </div>
        <div>
          Your email address is:{" "}
          <span className="font-semibold">{user?.email}</span>
        </div>
      </div>

      <div>((DESCRIPTION))</div>
      <div>
        <Link
          href={`/user/dashboard`}
          className="text-blue-500 hover:underline focus:text-violet-800"
        >
          {" "}
          <span className="font-medium">Proceed to Dashboard →</span>
        </Link>
      </div>
    </div>
  );
};

export default UserPage;
