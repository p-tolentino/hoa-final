import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { extendElection, concludeElection, markElectionAsInvalid } from '@/server/actions/election-settings'

interface Election {
  electionId: string
  termOfOffice: string | null
  period: string
  requiredVotes: number
  voterTurnout: number
  status: string
  committee: string
  endDate: Date
}

interface ConcludeElectionButtonProps {
  election: Election
}

const ManageElectionButton: React.FC<ConcludeElectionButtonProps> = ({
  election
}) => {
  const [open, setOpen] = useState(false)
  const [endDate, setEndDate] = useState(
    election.endDate.toISOString().slice(0, 10)
  )
  const [reason, setReason] = useState('')
  const [isPastEndDate, setIsPastEndDate] = useState(false)
  const [canConcludeElection, setCanConcludeElection] = useState(false)
  const [canMarkElectionInvalid, setCanMarkElectionInvalid] = useState(false)

  const toast = useToast()

  useEffect(() => {
    const currentDate = new Date()
    const endDate = new Date(election.endDate)
    setIsPastEndDate(currentDate > endDate)
    setCanConcludeElection(currentDate > endDate && election.voterTurnout >= election.requiredVotes)
    setCanMarkElectionInvalid(currentDate > endDate && election.voterTurnout < election.requiredVotes)
  }, [election.endDate, election.voterTurnout, election.requiredVotes])

  const handleExtendElection = async () => {
    const currentEndDate = new Date(election.endDate)
    currentEndDate.setHours(0, 0, 0, 0) // Reset time part for accurate comparison
    const newEndDate = new Date(endDate)
    newEndDate.setHours(0, 0, 0, 0) // Ensure time is reset here as well

    console.log('Current End Date:', currentEndDate)
    console.log('New End Date:', newEndDate)

    // Check if the new end date is not later than the current end date
    if (newEndDate <= currentEndDate) {
      toast({
        title: 'Invalid Date',
        description:
          'The new end date must be later than the current end date.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return // Stop the function if the date is not valid
    }

    const response = await extendElection(election.electionId, endDate)
    if (response.error) {
      toast({
        title: 'Error',
        description: response.error,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      setOpen(false) // Optionally close the dialog or navigate away on error as well
    } else {
      toast({
        title: 'Success',
        description: response.success,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      setOpen(false) // Close the dialog on success
    }
  }

  const concludeElectionSettings = async () => {
    if (election.voterTurnout >= election.requiredVotes) {
      try {
        const response = await concludeElection(election.electionId)
        if (response.success) {
          toast({
            title: 'Election Concluded',
            description: 'The election has been concluded as VALID.',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
          setOpen(false) // Close the dialog
        } else {
          toast({
            title: 'Error',
            description: response.error,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to conclude the election.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }
  }

  const markElectionAsInvalidSettings = async () => {
    try {
      const response = await markElectionAsInvalid(election.electionId)
      if (response.success) {
        toast({
          title: 'Election Marked as Invalid',
          description: 'The election has been marked as INVALID.',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
        setOpen(false) // Close the dialog
      } else {
        toast({
          title: 'Error',
          description: response.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark the election as invalid.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='solid'
          ml={5}
          size='sm'
          colorScheme='orange'
          fontFamily='font.heading'
          onClick={() => setOpen(true)}
        >
          Manage Election
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Election</DialogTitle>
          <DialogDescription>
            Update election details or conclude the{' '}
            <span className='font-semibold'>
              {election.termOfOffice?.replace(/ /g, '')} Elections
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <Box fontFamily='font.body' fontSize='sm'>
          <Flex justifyContent='space-between' align='end'>
            <Box>
              <Text>Election End Date:</Text>
              <Input
                type='date'
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </Box>
            <Button
              mt='4'
              variant='outline'
              size='sm'
              colorScheme='yellow'
              fontFamily='font.heading'
              onClick={handleExtendElection}
            >
              Extend Election
            </Button>
          </Flex>
          <Textarea
            mt={5}
            h='200px'
            resize='none'
            placeholder='Please provide a brief overview of the reasons for concluding the election...'
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </Box>
        <DialogFooter>
          {canConcludeElection && (
            <Button
              mt='4'
              variant='solid'
              size='sm'
              colorScheme='yellow'
              fontFamily='font.heading'
              onClick={concludeElectionSettings}
            >
              Conclude Election
            </Button>
          )}
          {canMarkElectionInvalid && (
            <Button
              mt='4'
              variant='solid'
              size='sm'
              colorScheme='red'
              fontFamily='font.heading'
              onClick={markElectionAsInvalidSettings}
            >
              Mark Election as Invalid
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ManageElectionButton
