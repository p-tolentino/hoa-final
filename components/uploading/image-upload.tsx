'use client'

import { UploadDropzone } from '@/lib/utils'
import { updateGovtId } from '@/server/actions/user-info'
import { useToast } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export const Upload = () => {
  const router = useRouter()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const onSubmit = async (imageUrl: string) => {
    startTransition(() => {
      updateGovtId(imageUrl)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            update()
            toast({
              title: `Government ID updated`,
              status: 'success',
              position: 'bottom-right',
              isClosable: true
            })

            router.refresh()
            console.log(data.success)
          }
        })
        .catch(() => {
          console.log('Something went wrong.')
        })
    })
  }

  return (
    <div>
      <UploadDropzone
        appearance={{
          button:
            'ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]',
          label: {
            color: '#ffaa00'
          },
          uploadIcon: {
            color: '#355E3B'
          }
        }}
        endpoint='imageUploader'
        onClientUploadComplete={(res: any) => {
          onSubmit(res[0].url)
          toast({
            title: `Upload Completed`,
            status: 'success',
            isClosable: true
          })
        }}
        onUploadError={(error: Error) => {
          toast({
            title: `Upload failed`,
            status: 'error',
            isClosable: true
          })
        }}
      />
    </div>
  )
}

export default Upload
