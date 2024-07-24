'use client'

import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { Button, useDisclosure } from '@chakra-ui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import NewTransactionForm from './NewTransactionForm'

interface NewTransactionButtonProps {
  currentFunds: number
}

export default function NewTransactionButton ({
  currentFunds
}: NewTransactionButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSuccess = () => {
    onClose() // Close the modal on success
  }

  return (
    <>
      <Button
        size='sm'
        colorScheme='yellow'
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Add Transaction
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={open => (open ? onOpen() : onClose())}
      >
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className='md:min-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Fill out the following fields to add a transaction made by the
              HOA.
            </DialogDescription>
          </DialogHeader>

          <NewTransactionForm
            onSuccess={handleSuccess}
            currentFunds={currentFunds}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
