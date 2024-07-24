import { currentUser } from '@/lib/auth'
import { getAllInfo } from '@/server/data/user-info'
import { getHoaInfo } from '@/server/data/hoa-info'
import { getAllMaintenanceRequests } from '@/server/data/maintenance-request'
import { getAllMaintenanceTypes } from '@/server/data/maintenance-type'
import { format } from 'date-fns'
import { getAllProperties } from '@/server/data/property'
import { getFacilities } from '@/server/data/facilities'
import { SubmittedMaintenanceClient } from './_components/client'
import { MaintenanceRecordColumn } from '../maintenance-record/_components/columns'

export default async function SubmittedMaintenance () {
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

  const facilities = await getFacilities()
  if (!facilities) {
    return null
  }

  const properties = await getAllProperties()
  if (!properties) {
    return null
  }

  const requests = await getAllMaintenanceRequests()

  if (!requests) {
    return null
  }

  const filteredRequests = requests.filter(req => req.submittedBy === user.id)

  const types = await getAllMaintenanceTypes()

  if (!types) {
    return null
  }

  let formattedRequests: MaintenanceRecordColumn[] = filteredRequests.map(
    item => {
      const officer = users.find(user => user.userId === item.officerAssigned)
      const submittedBy = users.find(user => user.userId === item.submittedBy)
      const type = types.find(type => type.id === item.type)

      return {
        id: item.id || '',
        number: item.number || 0,
        status: item.status || '',
        type: type?.title || '',
        location:
          item.type === 'facilityMaintenance'
            ? facilities.find(loc => loc.id === item.location)?.name
            : properties.find(loc => loc.id === item.location)?.address,
        createdAt: item.createdAt
          ? format(
              new Date(item.createdAt + 'Z')?.toISOString().split('T')[0],
              'MMMM dd, yyyy'
            )
          : '',

        officerAssigned: officer,
        description: item.description || '',
        submittedBy: submittedBy,
        step: item.step || 0,
        progress: item.progress || 'Step 0',
        documents: item.documents || [],
        priority: item.priority || '',
        letterSent: item.letterSent || false,
        reasonToClose: item.reasonToClose || '',
        updatedAt: item.updatedAt
          ? format(
              new Date(item.updatedAt + 'Z')?.toISOString(),
              'MMMM dd, yyyy h:mm:ss a'
            )
          : ''
      }
    }
  )

  formattedRequests = formattedRequests.sort((a, b) => b.number - a.number)

  return (
    <div>
      <div className='flex-1 space-y-4'>
        <SubmittedMaintenanceClient
          data={formattedRequests}
          hoaInfo={hoaInfo}
        />
      </div>
    </div>
  )
}
