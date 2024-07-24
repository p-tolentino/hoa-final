import React, { useState } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Image,
  Link,
  useToast,
  Flex,
  IconButton
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { UploadDropzone } from '@/lib/utils'
import { Json } from '@uploadthing/shared'
import { UploadThingError } from 'uploadthing/server'
import { RiCloseCircleFill } from 'react-icons/ri'

type FileUploadFieldProps = {
  isOptional?: boolean
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ isOptional }) => {
  const { setValue } = useFormContext()
  const toast = useToast()
  const [fileUrl, setFileUrl] = useState<string>('')

  const handleUploadComplete = (url: string) => {
    setValue('media', url, { shouldValidate: true })
    setFileUrl(url)
    toast({
      title: 'Upload successful',
      description: 'Your file has been uploaded successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true
    })
  }

  const handleUploadError = (error: UploadThingError<Json>) => {
    toast({
      title: 'Upload failed',
      description: `File upload failed: ${error.message}`,
      status: 'error',
      duration: 5000,
      isClosable: true
    })
  }

  return (
    <Box py='10px'>
      <FormControl>
        <FormLabel fontSize='sm' fontWeight='semibold'>
          Upload File{' '}
          {isOptional && <span className='font-normal'>(Optional)</span>}
        </FormLabel>

        {fileUrl === '' ? (
          <UploadDropzone
            appearance={{
              button:
                'ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]',
              label: { color: '#ffaa00' },
              uploadIcon: { color: '#355E3B' }
            }}
            endpoint='mixedUploader' // Adjust this endpoint as needed
            onClientUploadComplete={res => handleUploadComplete(res[0].url)}
            onUploadError={error => handleUploadError(error)}
          />
        ) : (
          <Flex>
            {fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <Box
                border='1px solid grey'
                borderRadius={5}
                p={5}
                w='max-content'
              >
                <Flex>
                  <Image
                    src={fileUrl}
                    alt='Uploaded file'
                    boxSize='300px'
                    objectFit='cover'
                    borderRadius='md'
                  />
                  <IconButton
                    aria-label='Remove File'
                    onClick={() => setFileUrl('')}
                    icon={<RiCloseCircleFill color='red' />}
                    bg='none'
                    boxSize='14px'
                    _hover={{ bg: 'none', transform: 'scale(1.1)' }}
                  />
                </Flex>
              </Box>
            ) : (
              <Link href={fileUrl} isExternal>
                View Uploaded File
              </Link>
            )}
          </Flex>
        )}
      </FormControl>
    </Box>
  )
}

export default FileUploadField
