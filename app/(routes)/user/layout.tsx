import { Sidebar } from "@/components/system/Sidebar";
import { Flex } from "@chakra-ui/react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Flex>
        <Sidebar />
        <Flex flexDir={"column"} w="100%">
          <div className="flex min-h-full p-10">{children}</div>
        </Flex>
      </Flex>
    </>
  );
};
export default UserLayout;
