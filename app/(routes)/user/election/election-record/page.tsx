import React from 'react'
import { getAllInfo } from '@/server/data/user-info'
import { getHoaInfo } from '@/server/data/hoa-info'
import { currentUser } from '@/lib/auth'
import { getAllElections } from '@/server/data/election-settings'
import { ElectionSettings } from '@prisma/client'
import { getActiveElection } from '@/server/data/election-settings'
import { ElectionRecordClient } from './_components/client'
import { getUniqueVotersCount } from '@/server/data/election-vote'
import { getCandidatesByElection } from '@/server/data/candidates'
import { getActiveUsers } from '@/server/data/user'

type ElectionRecordColumn = {
  electionId: string
  termOfOffice: string
  period: string
  voterTurnout: number
  requiredVotes: number
  status: string
  committee: string
  endDate: Date
}

export default async function ElectionRecord () {
  const user = await currentUser()
  if (!user) {
    return null
  }
  console.log(user)

  const users = await getAllInfo()

  if (!users) {
    return null
  }

  const activeUsers = await getActiveUsers()
  if (!activeUsers) {
    return null
  }

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const allElections = await getAllElections()
  if (!allElections) {
    return null
  }

  const tempData: ElectionRecordColumn[] = await Promise.all(
    allElections.map(async (election: ElectionSettings) => ({
      electionId: election.id,
      termOfOffice: election.termOfOffice ?? 'N/A',
      period: `${election.startElectDate
        .toISOString()
        .slice(0, 10)} - ${election.endElectDate.toISOString().slice(0, 10)}`,
      voterTurnout: await getUniqueVotersCount(election.id),
      requiredVotes: election.requiredVotes,
      activeUsers: activeUsers.length,
      status: election.status,
      committee: user.info.committee,
      endDate: election.endElectDate
    }))
  )

  return (
    console.log(tempData),
    (
      <div className='flex-1 space-y-4'>
        <ElectionRecordClient data={tempData} hoaInfo={hoaInfo} />
      </div>
    )
  )
}
