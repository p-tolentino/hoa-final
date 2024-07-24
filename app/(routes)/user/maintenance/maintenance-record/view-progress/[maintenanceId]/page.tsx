import { db } from '@/lib/db'
import ProgressDetails from './_components/progress-details'
import { getAllInfo } from '@/server/data/user-info'
import {
  getAllProgressReports,
  getMaintenanceOfficerActivitiesById
} from '@/server/data/maintenance-request'
import { getAllProperties } from '@/server/data/property'
import { getFacilities } from '@/server/data/facilities'

export const MaintenanceProgressPage = async ({
  params
}: {
  params: { maintenanceId: string }
}) => {
  const maintenance = await db.maintenanceRequest.findUnique({
    where: {
      id: params.maintenanceId
    }
  })

  if (!maintenance) {
    return null
  }

  const maintenanceType = await db.maintenanceType.findFirst({
    where: {
      id: maintenance?.type
    }
  })

  let officerAssigned

  if (maintenance?.officerAssigned) {
    officerAssigned = await db.personalInfo.findFirst({
      where: {
        userId: maintenance?.officerAssigned
      }
    })
  }

  const submittedBy = await db.personalInfo.findFirst({
    where: {
      userId: maintenance?.submittedBy
    }
  })

  const infos = await getAllInfo()

  if (!infos) {
    return null
  }

  const committeeMembers = infos.filter(
    info => info.committee === 'Environment & Sanitation Committee'
  )

  const officerActivities = await getMaintenanceOfficerActivitiesById(
    maintenance?.id
  )

  const progressReports = await getAllProgressReports()

  const facilities = await getFacilities()

  if (!facilities) {
    return null
  }

  const properties = await getAllProperties()

  if (!properties) {
    return null
  }

  // const allMaintenance = await db.maintenance.findMany()

  // const status = {
  //   FOR_REVIEW: 'For Review',
  //   FOR_ASSIGNMENT: 'For Officer Assignment',
  //   PENDING_NOTICE: 'Pending Maintenance Notice',
  //   IN_PROGRESS: 'Maintenance in Progress',
  //   FOR_FINAL_REPORT: 'For Final Report',
  //   CANCELLED: 'Cancelled',
  //   COMPLETED: 'Completed',
  //   DECLINED: 'Declined'
  // }

  const reportDetails = {
    maintenance: maintenance,
    maintenanceType: maintenanceType,
    officerAssigned: officerAssigned ? officerAssigned : null,
    submittedBy: submittedBy,
    committee: committeeMembers,
    officerActivities: officerActivities?.sort(
      (a: any, b: any) => a.deadline - b.deadline
    ),
    progressReports: progressReports,
    userInfos: infos,
    location:
      maintenance.type === 'facilityMaintenance'
        ? facilities.find(loc => loc.id === maintenance.location)!!.name
        : properties.find(loc => loc.id === maintenance.location)!!.address
  }

  return (
    <div>
      <ProgressDetails reportDetails={reportDetails} />
    </div>
  )
}

export default MaintenanceProgressPage
