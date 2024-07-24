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
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Election {
  id: any
  term: string[]
  period: string[]
  report: string
}

interface ConcludeElectionButtonProps {
  election: Election
}

const ConcludeElectionButton: React.FC<ConcludeElectionButtonProps> = ({
  election
}) => {
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [selectedOption, setSelectedOption] = useState('')
  const [reasonToConclude, setReasonToConclude] = useState('')

  const router = useRouter()

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }

  const toast = useToast()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='orange'>
          Conclude Election
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Conclude Election</DialogTitle>
            <DialogDescription>
              Fill out the following fields to officially conclude the election.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack spacing='15px' my='1.5rem'>
            <Stack>
              <Text fontSize='sm' fontFamily='font.body'>
                What is the reason for concluding the{' '}
                <span className='font-semibold'>
                  {election.term[0]}-{election.term[1]} Elections{' '}
                </span>
                that officially began on{' '}
                <span className='font-semibold'>{election.period[0]}</span>?
              </Text>
              <RadioGroup
                defaultValue=''
                size='sm'
                value={selectedOption}
                onChange={handleRadioChange}
              >
                <Stack
                  direction='column'
                  fontFamily='font.body'
                  textAlign='justify'
                >
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'VALID' ? 'yellow.100' : ''}
                  >
                    <Radio value='VALID' colorScheme='yellow'>
                      <span className='font-bold'>VALID</span>: The election
                      period has ended, and the voter turnout is sufficient to
                      validate the election results.
                    </Radio>
                  </Box>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'INVALID' ? 'orange.100' : ''}
                  >
                    <Radio value='INVALID' colorScheme='red'>
                      <span className='font-bold'>INVALID</span>: The election
                      period has been extended long enough, and the voter
                      turnout remains insufficient to validate the election
                      results.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack>
              <Textarea
                fontSize='sm'
                fontFamily='font.body'
                placeholder={
                  'Write a brief description of concluding the election...'
                }
                height='10vh'
                resize='none'
                onChange={e => setReasonToConclude(e.target.value)}
              />
            </Stack>
          </Stack>
          <DialogFooter>
            <Button
              size='sm'
              colorScheme='orange'
              type='button'
              // onClick={() => onSubmit()}
            >
              Conclude Election
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ConcludeElectionButton
