'use client'

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react'

export default function EditProfileForm ({
  biography,
  contactNumber
}: {
  biography: string
  contactNumber: string
}) {
  return (
    <>
      <FormControl fontFamily={'font.body'}>
        {/* Biography */}
        <FormLabel>Biography</FormLabel>
        <Textarea
          placeholder='Enter your biography here'
          maxLength={1300}
          rows={15}
          resize={'none'}
          defaultValue={biography}
        ></Textarea>
        <FormHelperText>Maximum of 1300 characters only.</FormHelperText>

        {/* Contact Number */}
        <FormLabel mt='25px'>Contact Number</FormLabel>
        <Input type='tel' defaultValue={contactNumber}></Input>
      </FormControl>

      {/* Update Profile Button */}
      <Box textAlign={'center'} mt='25px'>
        <Button colorScheme='yellow' mt='2rem' fontFamily={'font.heading'}>
          Update Profile
        </Button>
      </Box>
    </>
  )
}
