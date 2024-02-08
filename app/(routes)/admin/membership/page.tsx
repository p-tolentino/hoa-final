import { Flex } from "@chakra-ui/react";

import { Card } from "@/components/ui/card";

const Membership = () => {
  const userManagementMenuCard = [
    {
      category: "User Management",
      category_buttons: ["Homeowners Directory", "Admin Officers Directory"],
      category_hrefs: [
        "/admin/membership/user-management/homeowners-directory",
        "/admin/membership/user-management/admin-officers-directory",
      ],
      category_descriptions: [
        "1Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, quo veritatis repudiandae amet deserunt pariatur?",
        "2Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, quo veritatis repudiandae amet deserunt pariatur?",
      ],
    },
  ];

  const propertyManagementMenuCard = [
    {
      category: "Property Management",
      category_buttons: [
        "Browse House Lots (Maps)",
        "Property Information Form",
      ],
      category_hrefs: [
        "/admin/membership/property-management/browse-house-lots",
        "/admin/membership/property-management/property-information-form",
      ],
      category_descriptions: [
        "1Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, quo veritatis repudiandae amet deserunt pariatur?",
        "2Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, quo veritatis repudiandae amet deserunt pariatur?",
      ],
    },
  ];

  const userRegistrationMenuCard = [
    {
      category: "User Registration",
      category_buttons: ["Membership Form"],
      category_hrefs: ["/admin/membership/user-registration/membership-form"],
      category_descriptions: [
        "1Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi, quo veritatis repudiandae amet deserunt pariatur?",
      ],
    },
  ];
  {
    /* <Flex gap="2.5rem">
        {userManagementMenuCard.map((categoryData, index) => (
          <ModuleMenuCard key={index} data={categoryData}></ModuleMenuCard>
        ))}

        {propertyManagementMenuCard.map((categoryData, index) => (
          <ModuleMenuCard key={index} data={categoryData}></ModuleMenuCard>
        ))}

        {userRegistrationMenuCard.map((categoryData, index) => (
          <ModuleMenuCard key={index} data={categoryData}></ModuleMenuCard>
        ))}
      </Flex> */
  }
  return <>Todo: Membership Dashboard Module Cards</>;
};

export default Membership;
