'use client'

import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createCandidacy } from '@/server/actions/candidate-form'
import { ElectionSettings } from '@prisma/client'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import BackButton from '@/components/system/BackButton'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  ButtonGroup
} from '@chakra-ui/react'
import { format } from 'date-fns'

const CandidateFormUpload = ({
  activeElection,
  formLink
}: {
  activeElection: ElectionSettings | null | undefined
  formLink: string | null | undefined
}) => {
  // Page Title and Description
  const pageTitle = `Application for Candidacy Form`
  const pageDescription = `Submit your application for candidacy to the Homeowners' Association.`

  const user = useCurrentUser()
  const toast = useToast()
  const [fileUploaded, setFileUploaded] = useState<string>()
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [homeownerSince, setHomeownerSince] = useState<string>('0')
  const [skills, setSkills] = useState([''])

  const handleAddSkill = () => {
    setSkills([...skills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills]
    updatedSkills.splice(index, 1)
    setSkills(updatedSkills)
  }

  const [platforms, setPlatforms] = useState([''])

  const handleAddPlatform = () => {
    setPlatforms([...platforms, ''])
  }

  const handleRemovePlatform = (index: number) => {
    const updatedPlatforms = [...platforms]
    updatedPlatforms.splice(index, 1)
    setPlatforms(updatedPlatforms)
  }

  const [educBackground, setEducBackground] = useState([
    { year: '', institution: '' }
  ])

  const handleAddEduc = () => {
    setEducBackground([...educBackground, { year: '', institution: '' }])
  }

  const handleRemoveEduc = (index: number) => {
    const updatedEducBackground = [...educBackground]
    updatedEducBackground.splice(index, 1)
    setEducBackground(updatedEducBackground)
  }

  const [workExperience, setWorkExperience] = useState([
    { year: '', company: '' }
  ])

  const handleAddWork = () => {
    setWorkExperience([...workExperience, { year: '', company: '' }])
  }

  const handleRemoveWork = (index: number) => {
    const updatedWorkExperience = [...workExperience]
    updatedWorkExperience.splice(index, 1)
    setWorkExperience(updatedWorkExperience)
  }

  const handleFileUploadChange = (url: string) => {
    setFileUploaded(url)
  }

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  }

  const handleSubmit = async () => {
    if (!isChecked) {
      toast({
        title: 'Submission Blocked',
        description: 'You must agree to the pledge before submitting.',
        status: 'error',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true
      })
      return
    }

    // Check for file upload if required
    // if (!fileUploaded) {
    //   toast({
    //     title: "No file uploaded",
    //     description: "Please upload the necessary documentation.",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    //   return;
    // }

    try {
      const filteredSkills = skills.filter(skill => skill.trim() !== '')
      const filteredPlatforms = platforms.filter(
        platform => platform.trim() !== ''
      )
      const filteredEducBackground = educBackground
        .filter(
          education =>
            education.year.trim() !== '' && education.institution.trim() !== ''
        )
        .map(education => JSON.stringify(education)) // Serialize to JSON
      const filteredWorkExperience = workExperience
        .filter(work => work.year.trim() !== '' && work.company.trim() !== '')
        .map(work => JSON.stringify(work)) // Serialize to JSON

      const formData = {
        userId: user?.id,
        fullName: `${user?.info?.firstName} ${user?.info?.lastName}`,
        educBackground: filteredEducBackground,
        workExperience: filteredWorkExperience,
        homeownerSince: parseFloat(homeownerSince),
        skills: filteredSkills,
        platforms: filteredPlatforms,
        electionId: activeElection?.id
        // applicationLink: fileUploaded,
      }

      if (
        filteredEducBackground.length === 0 ||
        filteredWorkExperience.length === 0 ||
        filteredPlatforms.length === 0 ||
        homeownerSince === ''
      ) {
        toast({
          title: 'Incomplete Form',
          description: 'Please make sure you fill up all required fields.',
          status: 'warning',
          duration: 5000,
          isClosable: true
        })
        return
      }

      await createCandidacy(formData)
      toast({
        title: 'Candidate Application Submitted',
        description: `Date submitted: ${format(new Date(), 'MMMM dd, yyy')}`,
        status: 'success',
        position: 'bottom-right',
        duration: 5000,
        isClosable: true
      })

      // Resetting form fields upon successful submission
      setSkills([''])
      setPlatforms([''])
      setEducBackground([{ year: '', institution: '' }])
      setWorkExperience([{ year: '', company: '' }])
      setHomeownerSince('0')
      setIsChecked(false)
      // Optionally reset fileUploaded if you uncomment the file upload logic
      // setFileUploaded(undefined);
    } catch (error) {
      toast({
        title: 'Submission Error',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <div>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Stack spacing={5} fontFamily='font.body'>
        {/* Submit Nomination Form */}
        <>
          <SimpleGrid columns={2} spacing={10} fontFamily='font.body'>
            {/* Full Name */}
            <FormControl isRequired>
              <FormLabel fontSize='sm' fontWeight='semibold'>
                Full Name:
              </FormLabel>
              <Input
                disabled
                value={`${user?.info?.firstName} ${user?.info?.lastName}`}
              />
            </FormControl>

            {/* Membership Duration */}
            <FormControl isRequired>
              <FormLabel fontSize='sm' fontWeight='semibold'>
                Homeowner Membership Duration (in Years):
              </FormLabel>
              <NumberInput
                value={homeownerSince}
                onChange={valueString => setHomeownerSince(valueString)}
                min={0}
                max={50}
                maxW={20}
                step={0.5}
                fontFamily='font.body'
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText fontSize='xs' fontFamily='font.body'>
                Please indicate 0 if less than a year.
              </FormHelperText>
            </FormControl>

            {/* Skills */}
            <FormControl>
              <Flex justifyContent='space-between'>
                <FormLabel fontSize='sm' fontWeight='semibold'>
                  Skills:
                </FormLabel>
                <Button
                  size='xs'
                  leftIcon={<AddIcon />}
                  onClick={handleAddSkill}
                >
                  Add Skill
                </Button>
              </Flex>
              {skills.map((skill, index) => (
                <HStack key={index} spacing={3}>
                  <Input
                    placeholder='Skill'
                    value={skill}
                    onChange={e => {
                      const newSkills = [...skills]
                      newSkills[index] = e.target.value
                      setSkills(newSkills)
                    }}
                  />
                  {index > 0 && (
                    <IconButton
                      aria-label='Remove Skill'
                      icon={<DeleteIcon />}
                      size='sm'
                      colorScheme='red'
                      onClick={() => handleRemoveSkill(index)}
                    />
                  )}
                </HStack>
              ))}
            </FormControl>

            {/* Platforms */}
            <FormControl>
              <Flex justifyContent='space-between'>
                <FormLabel fontSize='sm' fontWeight='semibold'>
                  Platforms:
                </FormLabel>
                <Button
                  size='xs'
                  leftIcon={<AddIcon />}
                  onClick={handleAddPlatform}
                >
                  Add Platform
                </Button>
              </Flex>
              {platforms.map((platform, index) => (
                <HStack key={index} spacing={3}>
                  <Input
                    placeholder='Platform'
                    value={platform}
                    onChange={e => {
                      const newPlatforms = [...platforms]
                      newPlatforms[index] = e.target.value
                      setPlatforms(newPlatforms)
                    }}
                  />
                  {index > 0 && (
                    <IconButton
                      aria-label='Remove Platform'
                      icon={<DeleteIcon />}
                      size='sm'
                      colorScheme='red'
                      onClick={() => handleRemovePlatform(index)}
                    />
                  )}
                </HStack>
              ))}
            </FormControl>

            {/* Educational Background */}
            <FormControl isRequired>
              <Flex justifyContent='space-between'>
                <FormLabel fontSize='sm' fontWeight='semibold'>
                  Educational Background:
                </FormLabel>
                {/* Add Education */}
                <Button
                  size='xs'
                  leftIcon={<AddIcon fontSize='xs' />}
                  onClick={handleAddEduc}
                >
                  Add Education
                </Button>
              </Flex>
              <Box maxH='16vh' overflowY='auto'>
                {educBackground.map((education, index) => (
                  <HStack key={index} spacing={3} mb={2}>
                    {/* Year */}
                    <Input
                      size='sm'
                      width='auto'
                      placeholder='Year'
                      value={education.year}
                      onChange={e => {
                        const newEducBackground = [...educBackground]
                        newEducBackground[index].year = e.target.value
                        setEducBackground(newEducBackground)
                      }}
                    />
                    {/* School or Institution */}
                    <Input
                      size='sm'
                      placeholder='School or Institution'
                      value={education.institution}
                      onChange={e => {
                        const newEducBackground = [...educBackground]
                        newEducBackground[index].institution = e.target.value
                        setEducBackground(newEducBackground)
                      }}
                    />
                    {/* Delete Row */}
                    {index > 0 && (
                      <IconButton
                        aria-label='Remove Education'
                        icon={<DeleteIcon />}
                        size='sm'
                        colorScheme='red'
                        onClick={() => handleRemoveEduc(index)}
                      />
                    )}
                  </HStack>
                ))}
              </Box>
            </FormControl>

            {/* Work Experience */}
            <FormControl>
              <Flex justifyContent='space-between'>
                <FormLabel fontSize='sm' fontWeight='semibold'>
                  Work Experience:
                </FormLabel>
                <Button
                  size='xs'
                  leftIcon={<AddIcon />}
                  onClick={handleAddWork}
                >
                  Add Experience
                </Button>
              </Flex>
              {workExperience.map((work, index) => (
                <HStack key={index} spacing={3}>
                  <Input
                    placeholder='Year'
                    value={work.year}
                    onChange={e => {
                      const newWorkExperience = [...workExperience]
                      newWorkExperience[index].year = e.target.value
                      setWorkExperience(newWorkExperience)
                    }}
                  />
                  <Input
                    placeholder='Company'
                    value={work.company}
                    onChange={e => {
                      const newWorkExperience = [...workExperience]
                      newWorkExperience[index].company = e.target.value
                      setWorkExperience(newWorkExperience)
                    }}
                  />
                  {index > 0 && (
                    <IconButton
                      aria-label='Remove Experience'
                      icon={<DeleteIcon />}
                      size='sm'
                      colorScheme='red'
                      onClick={() => handleRemoveWork(index)}
                    />
                  )}
                </HStack>
              ))}
            </FormControl>

            <Checkbox
              colorScheme='yellow'
              alignItems='baseline'
              onChange={handleCheckBoxChange}
            >
              I, whose name appears above, hereby run for the position of a
              Board Member. It is that I pledge not to clench for power but for
              the service to cater for the common good. I run for this position,
              unstrained but voluntarily and wholeheartedly. I am a symbol of
              responsiblity, not by name, but through works and deeds.
            </Checkbox>
            <Box textAlign='right'>
              <Button
                colorScheme='yellow'
                w='max-content'
                onClick={handleSubmit}
              >
                Submit Application Form
              </Button>
            </Box>
          </SimpleGrid>
        </>
      </Stack>
    </div>
  )
}

export default CandidateFormUpload
