import React from 'react'
import { ReservationsMadeClient } from './_components/client'
import { currentUser } from '@/lib/auth'
import { getAllInfo } from '@/server/data/user-info'
import { getHoaInfo } from '@/server/data/hoa-info'
import { getUserReservations } from '@/server/data/facilitiesReservation'
import { getFacilityName, getFacilityRate } from '@/server/data/facilities'
import { getPersonalInfo } from '@/server/data/user-info'
import { db } from '@/lib/db'
import { format } from 'date-fns'

export default async function MyFacilityReservationRecord () {
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

  const reservations = await getUserReservations(user.id)
  if (!reservations) {
    return null
  }

  // Fetch facility names, rates, reservations, maintenance schedules, and notices in parallel
  const facilityDetails = await Promise.all(
    reservations.map(async reservation => {
      const [name, hourlyRate, facilityReservations, regularMaintenance] =
        await Promise.all([
          getFacilityName(reservation.facilityId),
          getFacilityRate(reservation.facilityId),
          db.facilityReservation.findMany({
            where: { facilityId: reservation.facilityId }
          }),
          db.maintenanceSchedule.findMany({
            where: { service: { facilityId: reservation.facilityId } },
            include: { service: true }
          })
        ])

      const maintenanceNotices = await db.maintenanceNotice.findMany({
        where: { location: name } // Use the facility name for location
      })

      return {
        facilityId: reservation.facilityId,
        name,
        hourlyRate,
        facilityReservations,
        regularMaintenance,
        maintenanceNotices
      }
    })
  )

  const userNames = await Promise.all(
    reservations.map(async reservation => {
      const names = await getPersonalInfo(reservation.userId)
      return {
        userId: reservation.userId,
        firstName: names?.firstName,
        lastName: names?.lastName
      }
    })
  )

  const formattedData = reservations.map(reservation => {
    const facilityDetail = facilityDetails.find(
      facility => facility.facilityId === reservation.facilityId
    )
    const facilityName = facilityDetail?.name || 'Unknown Facility'
    const hourlyRate = facilityDetail?.hourlyRate || 0
    const userDetail = userNames.find(
      user => user.userId === reservation.userId
    )
    const userName = `${userDetail?.firstName || 'Unknown'} ${
      userDetail?.lastName || 'User'
    }`
    const id = reservation.id
    const numHours = reservation.numHours.toString()
    const startTime = new Date(reservation.startTime)
    const endTime = new Date(reservation.endTime)
    const formattedStartTime = format(startTime, 'dd MMM yyyy, hh:mm a')
    const formattedEndTime = format(endTime, 'dd MMM yyyy, hh:mm a')

    return {
      reservationId: id,
      facility: facilityName,
      userName,
      numHours,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      reservationFee: reservation.reservationFee,
      start: startTime,
      end: endTime,
      cancelPeriod: hoaInfo.cancelPeriod,
      cancelFee: hoaInfo.cancellationFee,
      reservedBy: users.find(user => user.userId === reservation.userId),
      hourlyRate,
      facilityReservations: facilityDetail?.facilityReservations || [],
      maintenanceSchedule: facilityDetail?.regularMaintenance || [],
      maintenanceNotice: facilityDetail?.maintenanceNotices || []
    }
  })

  // Sort the data by original startTime in ascending order
  formattedData.sort((a, b) => {
    const aStartTime = new Date(a.startTime.split(' - ')[0])
    const bStartTime = new Date(b.startTime.split(' - ')[0])
    return bStartTime.getTime() - aStartTime.getTime()
  })

  return (
    <div className='flex-1 space-y-4'>
      <ReservationsMadeClient data={formattedData} hoaInfo={hoaInfo} />
    </div>
  )
}
