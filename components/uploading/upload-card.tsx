'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Upload from './image-upload'
import { Box, Button, Center, Image } from '@chakra-ui/react'
import { useState } from 'react'

interface UploadCardProps {
  title: string
  description: string
  idUrl: string
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  idUrl
}) => {
  const [isUpdateButtonClicked, setUpdateButtonClick] = useState(false)

  return (
    <div>
      <Card className='w-full h-full border-gray-300 shadow-md pb-3'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Center>
            {idUrl.length ? (
              <Image
                src={idUrl}
                alt='Government ID'
                objectFit='contain'
                height={isUpdateButtonClicked ? 50 : 350}
              />
            ) : (
              <div className='text-gray-400 mb-5'>
                No government ID uploaded yet.
              </div>
            )}
          </Center>
          {!isUpdateButtonClicked ? (
            <div className='text-center'>
              <Button
                size='sm'
                colorScheme='yellow'
                mt={5}
                onClick={() => setUpdateButtonClick(true)}
              >
                Upload New
              </Button>
            </div>
          ) : (
            <Box textAlign='right'>
              {isUpdateButtonClicked && (
                <Button
                  size='xs'
                  ml={5}
                  onClick={() => setUpdateButtonClick(false)}
                >
                  Cancel Upload
                </Button>
              )}
              <Upload />
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadCard
