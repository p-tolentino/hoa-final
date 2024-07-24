import { MdBuild } from "react-icons/md";
import { Heading } from "@/components/ui/heading";
import { getAllUsers } from "@/server/data/user";
import { currentUser } from "@/lib/auth";
import { MapViewInfo } from "../../../../user/membership/properties/map/_components/map-view-info";
import { getAllProperties } from "@/server/data/property";
import { Button, ButtonGroup } from "@chakra-ui/react";
import BackButton from "@/components/system/BackButton";
import Link from "next/link";
import { UserRole } from "@prisma/client";

const Map = async () => {
  // Page Title and Description
  const pageTitle = `HOA Properties`;
  const pageDescription = `Browse properties owned by the Homeowners' Association and access their information.`;

  const user = await currentUser();
  const properties = await getAllProperties();
  const allUsers = await getAllUsers();

  if (!user || !properties || !allUsers) {
    return null;
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          (user?.role === UserRole.ADMIN ||
            user?.role === UserRole.SUPERUSER) && (
            <ButtonGroup>
              <Button
                colorScheme="yellow"
                size="sm"
                leftIcon={<MdBuild />}
                as={Link}
                href="/user/membership/properties"
              >
                Manage Properties
              </Button>
              <BackButton />
            </ButtonGroup>
          )
        }
      />

      {/* Browse Properties Content */}
      <div className="space-y-4">
        <MapViewInfo user={user} properties={properties} users={allUsers} />
      </div>
    </>
  );
};

export default Map;
