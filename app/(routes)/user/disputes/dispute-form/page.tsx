import ReportForm from './_components/report-form'
import { currentUser } from '@/lib/auth'
import { getAllDisputeTypes } from '@/server/data/dispute-type'
import { getAllInfo } from '@/server/data/user-info'
import { getAllViolationTypes } from '@/server/data/violation-type'

export const DisputeForm = async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const allUsers = await getAllInfo()

  if (!allUsers) {
    return null
  }

  const disputeTypes = await getAllDisputeTypes()

  if (!disputeTypes) {
    return null
  }

  const violationTypes = await getAllViolationTypes()

  if (!violationTypes) {
    return null
  }

  return (
    <>
      <ReportForm disputeTypes={disputeTypes} users={allUsers || null} />
    </>
  )
}

export default DisputeForm
