import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { updateCandidacy } from '@/server/actions/candidate-form'
import {
  Box,
  Button,
  ListItem,
  Text,
  UnorderedList,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { Candidates } from '@prisma/client'

interface Application {
  id: string
  term: string
  status: string
  applicant: string
  application: Candidates
}

interface ApproveApplicationButtonProps {
  application: Application
}

const ApproveApplicationButton: React.FC<ApproveApplicationButtonProps> = ({
  application
}) => {
  const candidateCriteria = [
    {
      title: 'Eligibility',
      description:
        "The candidate must be a homeowner within the association's jurisdiction."
    },
    {
      title: 'Dues',
      description:
        'The candidate must be current on all association dues and assessments.'
    },
    {
      title: 'Background Check',
      description:
        'The candidate must pass a background check conducted by the association.'
    },
    {
      title: 'Experience',
      description:
        'The candidate should have relevant experience or skills beneficial to the board’s responsibilities.'
    },
    {
      title: 'Commitment',
      description:
        'The candidate must demonstrate a willingness to commit the time and effort required to fulfill board member duties.'
    },
    {
      title: 'Good Standing',
      description:
        'The candidate must be in good standing with the association, with no ongoing violations of community rules or regulations.'
    }
  ]

  const toast = useToast()
  const route = useRouter()
  const onSubmit = async () => {
    await updateCandidacy(application.id, { status: 'APPROVED' }).then(data => {
      console.log(data)
      route.refresh()
    })
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button key={application.id} colorScheme='green'>
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Candidate Application</DialogTitle>
            <DialogDescription>
              By approving the candidate application of{' '}
              <span className='font-semibold'>{application.applicant}</span>,{' '}
              <br />
              you are allowing them to run for a board member position in the
              Homeowners' Association for the{' '}
              <span className='font-semibold'>
                {application.term} Elections
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <Box my={3} mx={5} fontSize='sm' fontFamily='font.body'>
            <Text>
              Make sure the following criteria is met before confirming your
              approval:
            </Text>
            <UnorderedList pl={3}>
              {candidateCriteria.map(criteria => (
                <ListItem key={criteria.title}>
                  <span className='font-semibold'>{criteria.title}</span>:{' '}
                  {criteria.description}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>

          <DialogFooter>
            <Button colorScheme='green' onClick={() => onSubmit()}>
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApproveApplicationButton
