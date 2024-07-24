import { format } from 'date-fns'

import { TransactionClient } from './_components/client'
import { TransactionColumn } from './_components/columns'
import { currentUser } from '@/lib/auth'
import { getHoaTransactions } from '@/server/data/hoa-transactions'
import { getHoaInfo } from '@/server/data/hoa-info'
import { getPersonalInfo } from '@/server/data/user-info'

const RevenueExpense = async () => {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const transactions = await getHoaTransactions()
  if (!transactions) {
    return null
  }

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const formattedRecordsPromise: Promise<TransactionColumn>[] =
    transactions.map(async item => {
      const issuedBy = await getPersonalInfo(item.submittedBy)

      return {
        id: item.id,
        recordedBy: `${issuedBy?.firstName} ${issuedBy?.lastName} `.trim(),
        dateSubmitted: item.createdAt
          ? format(
              new Date(item.createdAt + 'Z').toISOString().split('T')[0],
              'dd MMM yyyy'
            )
          : '',
        dateIssued: item.dateIssued
          ? format(
              new Date(item.dateIssued).toISOString().split('T')[0],
              'dd MMM yyyy'
            )
          : '',
        type: item.type || '',
        purpose: item.purpose || '',
        amount: item.amount.toString() || '',
        description: item.description || ''
      }
    })

  const formattedRecords = await Promise.all(formattedRecordsPromise)

  return (
    <div className='flex'>
      <div className='flex-1 space-y-4'>
        <TransactionClient data={formattedRecords} hoaInfo={hoaInfo} />
      </div>
    </div>
  )
}

export default RevenueExpense
