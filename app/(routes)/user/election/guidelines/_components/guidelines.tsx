'use client'

import BackButton from '@/components/system/BackButton'
import { Heading } from '@/components/ui/heading'
import {
  Box,
  ButtonGroup,
  Flex,
  ListItem,
  OrderedList,
  SimpleGrid,
  Text
} from '@chakra-ui/react'
import EditGuidelines from './EditGuidelines'
import EditQualifications from './EditQualifications'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UserRole } from '@prisma/client'

export const Guidelines = ({ guidelineDetails }: { guidelineDetails: any }) => {
  // Page Title and Description

  const pageTitle = `Guidelines for HOA Elections`
  const pageDescription = `Read more about the guidelines for HOA Elections.`

  const user = useCurrentUser()

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={5}
        fontFamily='font.body'
        textAlign='justify'
      >
        {/* Board Resolution */}
        <Box border='1px solid grey' p={5}>
          <Flex justifyContent='space-between'>
            <Box lineHeight={1.15} mb={1}>
              <Text fontSize='lg' fontWeight='bold' fontFamily='font.heading'>
                BOARD RESOLUTION
              </Text>
              <Text fontSize='xs' color='gray' fontFamily='font.body' as='i'>
                {guidelineDetails.guidelines.updatedResolutionDate &&
                  `Last updated:
                ${guidelineDetails.guidelines.updatedResolutionDate.toLocaleString()}
                by (${guidelineDetails.updatedResolutionBy.firstName} ${
                    guidelineDetails.updatedResolutionBy.lastName
                  })`}
              </Text>
            </Box>
            {(user?.info.committee === 'Election Committee' ||
              user?.role === UserRole.SUPERUSER) && (
              <EditGuidelines
                guidelines={guidelineDetails.guidelines.boardResolution}
                guidelinesId={guidelineDetails.guidelines.id}
              />
            )}
          </Flex>

          <OrderedList>
            {guidelineDetails.guidelines.boardResolution.map(
              (guideline: string) => (
                <ListItem key={guideline}>{guideline}</ListItem>
              )
            )}
          </OrderedList>
        </Box>

        {/* Qualifications of Board Members */}
        <Box border='1px solid grey' p={5}>
          <Flex justifyContent='space-between'>
            <Box lineHeight={1.15} mb={1}>
              <Text fontSize='lg' fontWeight='bold' fontFamily='font.heading'>
                QUALIFICATIONS of BOARD MEMBERS
              </Text>
              <Text fontSize='xs' color='gray' fontFamily='font.body' as='i'>
                {guidelineDetails.guidelines.updatedQualificationsDate &&
                  `Last updated:
                ${guidelineDetails.guidelines.updatedQualificationsDate.toLocaleString()}
                by (${guidelineDetails.updatedQualificationsBy.firstName} ${
                    guidelineDetails.updatedQualificationsBy.lastName
                  })`}
              </Text>
            </Box>
            {(user?.info.committee === 'Election Committee' ||
              user?.role === UserRole.SUPERUSER) && (
              <EditQualifications
                qualifications={guidelineDetails.guidelines.qualifications}
                guidelinesId={guidelineDetails.guidelines.id}
              />
            )}
          </Flex>
          <OrderedList>
            {guidelineDetails.guidelines.qualifications.map(
              (qualification: string) => (
                <ListItem key={qualification}>{qualification}</ListItem>
              )
            )}
          </OrderedList>
        </Box>
      </SimpleGrid>

      {/* <Stack spacing={3} my={5} fontFamily="font.body">
        <Text>
          I hereby certify that {formattedMeetingDate}, at a board meeting, duly
          called for the purpose, the Board of Directors of the Homeowners'
          Association adopted the above resolution.
        </Text>

        <Text>
          ENACTED and APPROVED, at HOA Admin Office on the{" "}
          {formattedApprovalDate}
        </Text>
        <Text>BY THE AUTHORITY OF THE BOARD</Text>

        <Box lineHeight={1.15} mb={1} mt={5}>
          <Text fontSize="lg" fontWeight="bold" fontFamily="font.heading">
            APPLICATION FOR CANDIDACY FORM
          </Text>
          <Text fontSize="xs" color="gray" fontFamily="font.body" as="i">
            {guidelineDetails.guidelines.updatedFormDate &&
              `Last updated:
                ${guidelineDetails.guidelines.updatedFormDate.toLocaleString()}
                by (${guidelineDetails.updatedFormBy.firstName} ${
                guidelineDetails.updatedFormBy.lastName
              })`}
          </Text>
        </Box>
        <Flex justifyContent="space-between" gap={5}>
          {guidelineDetails.guidelines.candidacyFormLink && (
            <Center bg="lightgrey" w="full" h="500px">
              <iframe
                src={guidelineDetails.guidelines.candidacyFormLink}
                title="HOA Application for Candidacy Form"
                width="100%"
                height="500px"
              ></iframe>
            </Center>
          )}

          {user?.info.committee === "Election Committee" ||
          user?.role === UserRole.SUPERUSER ? (
            <FormControl w="700px">
              <FormLabel fontSize="md" fontFamily="font.body">
                Upload Updated Application for Candidacy Form:
              </FormLabel>

              <UploadDropzone
                appearance={{
                  button:
                    "ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]",
                  label: { color: "#ffaa00" },
                  uploadIcon: { color: "#355E3B" },
                }}
                endpoint="mixedUploader" // Adjust this endpoint as needed
                onClientUploadComplete={(res) =>
                  handleFileUploadChange(res[0].url)
                }
                onUploadError={(error) => console.log(error)}
              />
            </FormControl>
          ) : (
            <FormLabel fontSize="md" fontFamily="font.body">
              No PDF uploaded yet, please contact the HOA Admin.
            </FormLabel>
          )}
        </Flex>
      </Stack> */}
    </>
  )
}

export default Guidelines
