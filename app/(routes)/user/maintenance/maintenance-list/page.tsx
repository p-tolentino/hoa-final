import { currentUser } from '@/lib/auth'
import MaintenanceList from './_components/maintenance-list'
import { getAllMaintenanceTypes } from '@/server/data/maintenance-type'

export default async function ListOfViolations () {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const types = await getAllMaintenanceTypes()

  if (!types) {
    return null
  }

  return (
    <>
      <MaintenanceList maintenanceServices={types || null} />
    </>
  )
}
