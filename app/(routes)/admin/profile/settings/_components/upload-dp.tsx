'use client'

import { Modal } from '@/components/ui/modal'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ExtendedUser } from '@/next-auth'

import { UploadDropzone } from '@/lib/utils'
import { updateDp } from '@/server/actions/user-info'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  user: ExtendedUser
}

export const UploadDp: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter()
  const { update } = useSession()

  const onSubmit = async (imageUrl: string) => {
    try {
      await updateDp(user.id, imageUrl).then(data => {
        console.log(data.success)
        onClose()
        router.refresh()
        update()
      })
    } catch (error) {
      throw new Error()
    }
  }

  return (
    <>
      <Modal
        title='Upload New Profile Picture'
        description='Upload your new profile picture in the system.'
        isOpen={isOpen}
        onClose={onClose}
      >
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
            router.refresh()
            update()
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`)
          }}
        />
      </Modal>
    </>
  )
}
