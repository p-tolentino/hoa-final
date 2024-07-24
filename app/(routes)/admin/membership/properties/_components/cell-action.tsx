'use client'

import { AlertModal } from '@/components/modals/alert-modal'
import { useSession } from 'next-auth/react'
import { IconButton, useToast } from '@chakra-ui/react'
import { FaEllipsis } from 'react-icons/fa6'
import { DeleteIcon } from '@chakra-ui/icons'
import { deleteProperty } from '@/server/actions/property'
import { LuCopy as Copy } from 'react-icons/lu'
import { PropertyColumn } from './columns'
import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'

interface CellActionProps {
  data: PropertyColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const user = useCurrentUser()
  const router = useRouter()
  const toast = useToast()
  const selectedProperty = data.address

  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    console.log('Property ID copied to the clipboard.')
  }

  const onDelete = async (id: string) => {
    startTransition(() => {
      deleteProperty(id)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            update()
            toast({
              title: `Property Deleted`,
              description: <div>Property: {selectedProperty}</div>,
              status: 'success',
              position: 'bottom-right',
              isClosable: true
            })

            setOpen(false)
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
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={isPending}
        title='Confirm Delete Property'
        description={
          <>
            Are you sure you want to delete <strong>{data.address}</strong> from
            the system? This action cannot be undone.
          </>
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={''}
            icon={<FaEllipsis />}
            color='grey'
            variant='unstyled'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Copy ID */}
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onCopy(data.id)}
          >
            <Copy className='w-4 h-4 mr-2' />
            Copy ID
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() =>
              // router.push(`/${params.storeId}/products/${data.id}`)
              console.log("TRIGGER GO TO EDIT")
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem> */}

          {/* Delete */}
          {}

          {(user?.info.position === 'Admin' ||
            user?.info.position === 'Superuser') && (
            <DropdownMenuItem
              className='cursor-pointer  text-red-600 font-semibold'
              onClick={() => setOpen(true)}
            >
              <div className=' text-red-600 font-semibold'>
                <DeleteIcon mr={2} />
                Delete
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
