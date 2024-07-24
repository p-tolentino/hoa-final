import BackButton from "@/components/system/BackButton";
import ContactsList from "./_components/contacts-list";
import AddContactButton from "./_components/AddContactButton";
import { Heading } from "@/components/ui/heading";
import { getContacts } from "@/server/data/external-contact";
import { ButtonGroup } from "@chakra-ui/react";
import { currentUser } from "@/lib/auth";

export default async function ExternalContacts() {
  const user = await currentUser();
  // Page Title and Description
  const pageTitle = `List of External Maintainers Contact Details`;
  const pageDescription = `View the contact details of external maintainers of the Homeowners' Association.`;

  const contacts = await getContacts();

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {user?.info.committee === "Environment & Sanitation Committee" && (
              <AddContactButton />
            )}
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Contact List */}
      <ContactsList contacts={contacts} />
    </>
  );
}
