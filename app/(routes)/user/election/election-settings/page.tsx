import { db } from '@/lib/db'
import ElectionSetup from './_components/election-setup-form'
import { getHoaInfo } from '@/server/data/hoa-info'
import { getAllInfo } from '@/server/data/user-info'
import { Heading } from '@/components/ui/heading'
import BackButton from '@/components/system/BackButton'

// Page Title and Description
const pageTitle = `Election Setup`
const pageDescription = `Fill up the following fields to set up an election.`

async function CreateElectionPoll () {
  const userInfos = await getAllInfo()
  const existingActiveElection = await db.electionSettings.findFirst({
    where: {
      status: 'ON-GOING'
    }
  })

  const electionRecord = await db.electionSettings.findMany({})

  const hoaInfo = await getHoaInfo()

  if (!hoaInfo || !userInfos) {
    return null
  }

  if (existingActiveElection) {
    return (
      <>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={<BackButton />}
        />

        <div className='text-center text-red-500 font-bold'>
          There is currently an active election running.
        </div>
      </>
    )
  }

  return (
    <>
      <ElectionSetup
        hoaInfo={hoaInfo}
        electionRecord={electionRecord}
        userInfos={userInfos}
      />
    </>
  )
}
export default CreateElectionPoll
