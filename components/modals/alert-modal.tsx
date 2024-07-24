'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button, ButtonGroup } from '@chakra-ui/react'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  title?: string
  description?: React.ReactNode
  action?: string
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  action
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [buttonLoad, setButtonLoad] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleButtonClick = () => {
    setButtonLoad(true)
    onConfirm()
  }

  return (
    <Modal
      title={title ? title : 'Are you absolutely sure?'}
      description={description ? description : 'This action cannot be undone.'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='text-right'>
        <ButtonGroup>
          <Button disabled={loading} size='sm' onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            loadingText={
              action === 'Delete'
                ? 'Deleting'
                : action === 'Create'
                ? 'Creating'
                : action === 'Cancel'
                ? 'Cancelling'
                : 'Please wait'
            }
            isLoading={buttonLoad}
            size='sm'
            colorScheme='red'
            onClick={handleButtonClick}
          >
            {action ? action : 'Continue'}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  )
}
