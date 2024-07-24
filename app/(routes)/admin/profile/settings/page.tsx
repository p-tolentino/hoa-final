import { currentUser } from '@/lib/auth'
import { SettingsForm } from './_components/settings-form'
import { getVehicleById } from '@/server/data/user-info'
import { getAllProperties } from '@/server/data/property'
import AddVehicle from './_components/add-vehicle'
import UploadCard from '@/components/uploading/upload-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
  Flex,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@chakra-ui/react'
import BackButton from '@/components/system/BackButton'

const Settings = async () => {
  // Page Title and Description
  const pageTitle = `Settings`
  const pageDescription = `Manage your account settings in the system.`

  const user = await currentUser()
  const properties = await getAllProperties()

  if (!user || !properties) {
    return null
  }

  const vehicles = await getVehicleById(user?.id)

  if (!vehicles) {
    return null
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={<BackButton />}
      />

      {/* Notification Settings */}
      <Card className='mb-5'>
        <CardHeader>
          <CardTitle className='font-semibold'>
            Notifications Settings
          </CardTitle>
          <CardDescription>Configure your system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Email notifications */}
          <FormControl>
            <Text mb={1} fontSize='sm' fontWeight='semibold'>
              Receive notifications via email:
            </Text>
            <Flex ml='1rem' gap={10}>
              <Flex gap={3}>
                <Text fontSize='sm'>Form Submission Confirmation</Text>
                <RadioGroup defaultValue='on' colorScheme='yellow'>
                  <Stack direction={'row'} spacing={2}>
                    <Radio value='on' size='sm'>
                      On
                    </Radio>
                    <Radio value='off' size='sm'>
                      Off
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
              <Flex gap={3}>
                <Text fontSize='sm'>Payment Alerts and Reminders</Text>
                <RadioGroup defaultValue='on' colorScheme='yellow'>
                  <Stack direction={'row'} spacing={2}>
                    <Radio value='on' size='sm'>
                      On
                    </Radio>
                    <Radio value='off' size='sm'>
                      Off
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </Flex>
          </FormControl>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card className='mb-5'>
        <CardHeader>
          <CardTitle className='font-semibold'>Membership Form</CardTitle>
          <CardDescription>Update your membership form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex-row p-3'>
            <SettingsForm properties={properties} />
            <Separator className='my-5' />
            <Flex justifyContent='space-between' gap={10}>
              <AddVehicle initialData={user} vehicles={vehicles} />
              <UploadCard
                title='Government-Issued ID'
                description='Upload a valid ID to validate your identity and proof of ownership for the property selected.'
                idUrl={user?.info?.govtId || ''}
              />
            </Flex>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Settings
