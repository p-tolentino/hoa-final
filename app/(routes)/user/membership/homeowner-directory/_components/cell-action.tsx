'use client'

import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { AlertModal } from '@/components/modals/alert-modal'
import { useSession } from 'next-auth/react'
import { IconButton } from '@chakra-ui/react'
import { FaEllipsis } from 'react-icons/fa6'
import { DeleteIcon } from '@chakra-ui/icons'
import { useCurrentRole } from '@/hooks/use-current-role'
import { HomeownerColumn } from './columns'
import { updateUserStatus } from '@/server/actions/user-info'
import { useState, useTransition } from 'react'
import { Status, UserRole } from '@prisma/client'
import { ChangePositionCommittee } from './change-position-committee'
import { MdOutlineAssignmentInd as Assign } from 'react-icons/md'
import { LuCopy as Copy, LuCheckCheck as Check } from 'react-icons/lu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'

interface CellActionProps {
  data: HomeownerColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const user = useCurrentUser()
  const role = useCurrentRole()
  const router = useRouter()

  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const [open, setOpen] = useState(false)
  const [posCommOpen, setPosCommOpen] = useState(false)

  const onApprove = async (id: string) => {
    startTransition(() => {
      updateUserStatus(id)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            update()
            router.refresh()
            console.log(data.success)
          }
        })
        .catch(() => {
          console.log('Something went wrong.')
        })
    })
  }

  const onAssign = async (id: string) => {}

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    console.log('Property ID copied to the clipboard.')
  }

  const onDelete = async (id: string) => {
    startTransition(() => {
      console.log('TODO: Delete user')
      setOpen(false)
      // deleteProperty(id)
      //   .then((data) => {
      //     if (data.error) {
      //       console.log(data.error);
      //     }

      //     if (data.success) {
      //       update();
      //       setOpen(false);
      //       router.refresh();
      //       console.log(data.success);
      //     }
      //   })
      //   .catch(() => {
      //     console.log("Something went wrong.");
      //   });
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete(data.id)}
        loading={isPending}
        title='Confirm Member Deletion'
        description={
          <>
            Are you sure you want to delete <strong>{data.name}</strong> from
            the system? This action cannot be undone.
          </>
        }
      />

      <ChangePositionCommittee
        isOpen={posCommOpen}
        onClose={() => setPosCommOpen(false)}
        data={data}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className='align-center' asChild>
          <IconButton
            aria-label={''}
            icon={<FaEllipsis />}
            color='grey'
            variant='unstyled'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Approve Membership */}
          {data.status === Status.PENDING && (
            <>
              <DropdownMenuItem
                className='cursor-pointer'
                disabled={!data.govtId || !data.address}
                onClick={() => onApprove(data.id)}
              >
                {' '}
                {!data.address ? (
                  '(User has not set up account yet)'
                ) : !data.govtId ? (
                  '(No Government ID Uploaded Yet)'
                ) : (
                  <>
                    <Check className='w-4 h-4 mr-2' />
                    Approve Membership
                  </>
                )}
              </DropdownMenuItem>
              <Separator />
            </>
          )}

          {/* Assign Position & Committee */}
          {data.status === Status.ACTIVE &&
            (user?.info.committee === 'Board of Directors' ||
              role === UserRole.ADMIN ||
              role === UserRole.SUPERUSER) && (
              <>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => setPosCommOpen(true)}
                >
                  <Assign className='w-4 h-4 mr-2' />
                  Assign Position & Committee
                </DropdownMenuItem>
                <Separator />
              </>
            )}

          {/* Copy ID */}
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onCopy(data.id)}
          >
            <Copy className='w-4 h-4 mr-2' />
            Copy ID
          </DropdownMenuItem>
          {/* 
          
          // !! EDIT USER NOT AVAILABLE FOR ADMIN (wouldn't be logical for someone else to edit your information through the system)
          
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
              console.log("TRIGGER GO TO EDIT")
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem> 
          
          */}

          {/* Delete */}
          <DropdownMenuItem
            className='font-semibold text-red-500 cursor-pointer'
            onClick={() => setOpen(true)}
          >
            <div className='font-semibold text-red-500'>
              <DeleteIcon mr={2} />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
