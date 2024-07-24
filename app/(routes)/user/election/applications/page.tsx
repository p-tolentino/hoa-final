import React from 'react'
import { currentUser } from '@/lib/auth'
import { getAllInfo } from '@/server/data/user-info'
import { getHoaInfo } from '@/server/data/hoa-info'
import { ElectionApplicationsClient } from './_components/client'
import { ElectionApplicationsColumn } from './_components/columns'
import { getAllCandidates } from '@/server/data/candidates'
import { db } from '@/lib/db'

export default async function ApplicationsForCandidacy () {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const users = await getAllInfo()

  if (!users) {
    return null
  }

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const candidates = await getAllCandidates()
  if (!candidates) {
    return null
  }

  interface Education {
    year: string
    institution: string
  }

  interface WorkExperience {
    year: string
    company: string
  }

  const formattedCandidates: Promise<ElectionApplicationsColumn>[] =
    candidates.map(async item => {
      const submittedBy = users.find(info => info.userId === item.userId)
      const electionSettings = await db.electionSettings.findUnique({
        where: { id: item.electionId }
      })

      const edu: Education[] = item.educBackground
      const work: WorkExperience[] = item.workExperience

      console.log(edu)

      return {
        id: item.id || '',
        term: electionSettings?.termOfOffice || '',
        status: item.status || '',
        applicant: `${submittedBy?.firstName} ${submittedBy?.lastName}`,
        application: item,
        educBackground: edu,
        workExperience: work,
        committee: user.info.committee
      }
    })

  const finalCandidates = await Promise.all(formattedCandidates)

  return (
    <div className='flex-1 space-y-4'>
      <ElectionApplicationsClient data={finalCandidates} hoaInfo={hoaInfo} />
    </div>
  )
}
