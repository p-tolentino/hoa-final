import { currentUser } from '@/lib/auth'
import SoaInfo from './_components/soa-info'
import { getPropertyById } from '@/server/data/user-info'
import { getTransactionByAddress } from '@/server/data/user-transactions'

import {
  createAssocDue,
  newUserTransaction,
  updateTransaction,
  updateTransactionSoaId
} from '@/server/actions/user-transactions'
import { PaymentStatus } from '@prisma/client'
import {
  getAllSoaPayments,
  getAllSoasByAddress,
  getSoaByDate
} from '@/server/data/soa'
import { createPrevMonthSoa, createSoa, updateSoa } from '@/server/actions/soa'
import { getAllReservations } from '@/server/data/facilitiesReservation'
import { createNotification } from '@/server/actions/notification'
import { updateReservation } from '@/server/actions/facility-reservation'
import { getFacilityName } from '@/server/data/facilities'
import { getHoaInfo } from '@/server/data/hoa-info'
import { format } from 'date-fns'

const StatementOfAccount = async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const property = await getPropertyById(user?.id)

  if (!property) {
    return null
  }

  const userAddress = user?.info?.address

  const allReservations = await getAllReservations()

  const userReservations = allReservations?.filter(
    reserved => reserved.userId === user.id
  )

  if (userReservations) {
    await userReservations.map(async reserved => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const facility = await getFacilityName(reserved.facilityId)

      const existingCurrMonthSoa = await getSoaByDate(
        today.getFullYear(),
        today.getMonth(),
        userAddress
      )

      if (!reserved.isBilled && new Date(reserved.endTime!!) <= now) {
        // Bill to Address of Person Involved + Notification
        const feeData = {
          soaId: existingCurrMonthSoa?.id || null,
          purpose: 'Facility Reservation Fees',
          amount: parseFloat(
            (reserved.reservationFee * reserved.numHours).toString()
          ),
          addressId: userAddress,
          description: `[${format(
            reserved.startTime,
            'dd MMM yyyy'
          )}] ${facility}`
        }

        await newUserTransaction(feeData).then(data => {
          if (data.success) {
            console.log(data.success)
            updateReservation(reserved.id, { isBilled: true })
          }
        })

        // Send Notifications
        const notifPaymentData = {
          type: 'finance',
          recipient: user.id,
          title: 'URGENT: Facility Reservation Fee Payment Required',
          description: `Your payment for the reservation of the ${facility} is now due today. Click here to proceed to payment.`,
          linkToView: `/user/finance/statement-of-account`
        }

        await createNotification(notifPaymentData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })
      }
    })
  }

  const allTransactions = await getTransactionByAddress(userAddress)

  if (!allTransactions) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )

  const existingPrevMonthSoa = await getSoaByDate(
    firstDayOfLastMonth.getFullYear(),
    firstDayOfLastMonth.getMonth(),
    userAddress
  )

  if (!existingPrevMonthSoa) {
    const prevMonthTransactions = allTransactions.filter(
      transaction =>
        firstDayOfLastMonth < transaction.createdAt &&
        firstDayOfThisMonth > transaction.createdAt
    )

    const prevMonthTransactionIds = prevMonthTransactions.map(
      transaction => transaction.id
    )

    const prevMonthTotalAmount = prevMonthTransactions.reduce(
      (total, transaction) => {
        return total + transaction.amount
      },
      0
    )

    const newPrevMonthSoa = await createPrevMonthSoa(userAddress)

    if (newPrevMonthSoa && newPrevMonthSoa.soa) {
      console.log(newPrevMonthSoa.success)
      prevMonthTransactionIds.forEach(id =>
        updateTransactionSoaId(id, newPrevMonthSoa.soa.id)
      )
      const prevMonthUpdate = {
        transactions: prevMonthTransactionIds,
        total: parseFloat(prevMonthTotalAmount.toFixed(2)),
        balance: parseFloat(prevMonthTotalAmount.toFixed(2))
      }
      await updateSoa(newPrevMonthSoa.soa.id, prevMonthUpdate)
    }
  }

  const existingCurrentMonthSoa = await getSoaByDate(
    today.getFullYear(),
    today.getMonth(),
    userAddress
  )

  if (!existingCurrentMonthSoa) {
    const newCurrentMonthSoa = await createSoa(userAddress)
    if (newCurrentMonthSoa && newCurrentMonthSoa.soa) {
      console.log(newCurrentMonthSoa.success)
    }
  }

  if (existingCurrentMonthSoa) {
    const currentMonthTransactions = allTransactions.filter(
      transaction =>
        firstDayOfThisMonth < transaction.createdAt &&
        now >= transaction.createdAt
    )

    const currentMonthTransactionIds = currentMonthTransactions.map(
      transaction => transaction.id
    )
    const currentMonthTotalAmount = currentMonthTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    )

    currentMonthTransactionIds.forEach(id =>
      updateTransactionSoaId(id, existingCurrentMonthSoa.id)
    )
    const currentMonthUpdate = {
      transactions: currentMonthTransactionIds,
      total: parseFloat(currentMonthTotalAmount.toFixed(2)),
      balance: parseFloat(currentMonthTotalAmount.toFixed(2))
    }
    await updateSoa(existingCurrentMonthSoa.id, currentMonthUpdate)
  }

  const existingAssocDuesBill = allTransactions.some(
    transaction =>
      transaction.purpose === 'Association Dues' &&
      transaction.createdAt.getMonth() === today.getMonth() &&
      transaction.createdAt.getFullYear() === today.getFullYear() &&
      transaction.addressId === userAddress
  )

  const refetchedCurrentMonthSoa = await getSoaByDate(
    today.getFullYear(),
    today.getMonth(),
    userAddress
  )

  if (!existingAssocDuesBill) {
    await createAssocDue(refetchedCurrentMonthSoa?.id || null).then(data => {
      if (data) console.log(data.success)
    })
  }

  // transactions.map((transaction) => {
  //   const deadline = addDays(new Date(transaction.createdAt), 30);

  //   if (transaction.status === PaymentStatus.UNPAID && new Date() > deadline) {
  //     transaction.status = PaymentStatus.OVERDUE;
  //     overdueTransaction(transaction.id);
  //   }
  // });

  const updatedTransactions = await getTransactionByAddress(userAddress)

  if (!updatedTransactions) {
    return null
  }

  const allSoaPayments = await getAllSoaPayments()
  const allSoas = await getAllSoasByAddress(userAddress)

  allSoas.map(soa => {
    const payments = allSoaPayments.filter(payment => payment.soaId === soa.id)
    const totalPaidAmount = parseFloat(
      payments.reduce((total, payment) => total + payment.amount, 0).toString()
    )
    const balanceDue = soa.total - totalPaidAmount

    const statusUpdate =
      balanceDue > 0 &&
      soa.forYear === today.getFullYear() &&
      soa.forMonth < today.getMonth()
        ? PaymentStatus.OVERDUE
        : balanceDue > 0 && soa.total !== totalPaidAmount && totalPaidAmount > 0
        ? PaymentStatus.UNSETTLED
        : soa.total !== 0 && soa.total === totalPaidAmount && balanceDue === 0
        ? PaymentStatus.PAID
        : PaymentStatus.UNPAID

    soa.paidAmount = totalPaidAmount
    soa.balance = balanceDue
    soa.status = statusUpdate

    soa.transactions.map(transaction => {
      updateTransaction(transaction, { status: statusUpdate }).then(data => {
        if (data.success) {
          console.log(data.success)
        }
      })
    })

    const update = {
      paidAmount: totalPaidAmount,
      balance: balanceDue,
      status: statusUpdate
    }

    updateSoa(soa.id, update).then(data => {
      if (data.success) {
        console.log(data.success)
      }
    })
  })

  const sortedSoas = allSoas.sort((a, b) => {
    if (a.forYear !== b.forYear) {
      return b.forYear - a.forYear
    } else {
      return b.forMonth - a.forMonth
    }
  })

  return (
    <div className='flex'>
      <div className='flex-1'>
        <SoaInfo
          property={property}
          allTransactions={updatedTransactions}
          allSoas={sortedSoas}
          allSoaPayments={allSoaPayments}
          hoaInfo={hoaInfo}
        />
      </div>
    </div>
  )
}

export default StatementOfAccount
