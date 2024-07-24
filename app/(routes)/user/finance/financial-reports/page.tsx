import { getHoaInfo } from '@/server/data/hoa-info'
import FinancialReportsClient from './_components/client'
import { getAllTransactions } from '@/server/data/user-transactions'
import { getHoaTransactions } from '@/server/data/hoa-transactions'
import { HoaTransactionType, PaymentStatus } from '@prisma/client'
import { m } from 'framer-motion'

const FinancialReports = async ({
  searchParams
}: {
  searchParams?: { [key: string]: string | undefined }
}) => {
  const hoaInfo = await getHoaInfo()
  if (!hoaInfo || !searchParams) {
    return null
  }

  const now = new Date()

  const { year, month } = searchParams

  const startOfSelectedMonth = new Date(
    parseInt(year || now.getFullYear().toString()),
    parseInt(month || now.getMonth().toString()),
    1
  )
  const endOfSelectedMonth = new Date(
    parseInt(year || now.getFullYear().toString()),
    parseInt(month || now.getMonth().toString()) + 1,
    1
  )

  let finance = {
    assocDuesRevenue: 0,
    tollFeesRevenue: 0,
    facilityFeesRevenue: 0,
    violationFinesRevenue: 0,
    renovDemoRevenue: 0,
    carStickerRevenue: 0,
    donationsRevenue: 0,
    otherRevenue: 0,
    totalRevenue: 0,

    salariesExpense: 0,
    utilitiesExpense: 0,
    officeSuppliesExpense: 0,
    furnituresFixturesExpense: 0,
    repairMaintenanceExpense: 0,
    legalProfExpense: 0,
    administrativeExpense: 0,
    miscellaneousExpense: 0,
    totalExpenses: 0,

    netIncome: 0,

    accountsReceivable: 0,
    accountsPayable: 0,
    totalLiabilities: 0
  }

  const userPaidPaymentsForMonth = await (
    await getAllTransactions()
  ).filter(transaction => {
    if (transaction.datePaid) {
      const isPaid = transaction.status === PaymentStatus.PAID
      const isPaidWithinMonth =
        transaction.datePaid >= startOfSelectedMonth &&
        transaction.datePaid <= endOfSelectedMonth

      return isPaid && isPaidWithinMonth
    }
  })

  const userUnpaidPaymentsForMonth = await (
    await getAllTransactions()
  ).filter(transaction => {
    if (transaction.amount) {
      const isUnpaid = transaction.status !== PaymentStatus.PAID
      const isUnpaidWithinMonth =
        transaction.createdAt >= startOfSelectedMonth &&
        transaction.createdAt <= endOfSelectedMonth

      return isUnpaid && isUnpaidWithinMonth
    }
  })

  const hoaRevenuesForMonth = await (
    await getHoaTransactions()
  )?.filter(transaction => {
    const isRevenue = transaction.type === HoaTransactionType.REVENUE
    const isWithinMonth =
      transaction.dateIssued >= startOfSelectedMonth &&
      transaction.dateIssued <= endOfSelectedMonth

    return isRevenue && isWithinMonth
  })

  const hoaExpensesForMonth = await (
    await getHoaTransactions()
  )?.filter(transaction => {
    const isExpense = transaction.type === HoaTransactionType.EXPENSE
    const isWithinMonth =
      transaction.dateIssued >= startOfSelectedMonth &&
      transaction.dateIssued <= endOfSelectedMonth

    return isExpense && isWithinMonth
  })

  if (userPaidPaymentsForMonth || hoaRevenuesForMonth) {
    userPaidPaymentsForMonth.map(payment => {
      if (payment.purpose === 'Association Dues') {
        if (finance?.assocDuesRevenue) {
          finance.assocDuesRevenue += payment.amount
        } else {
          finance!!.assocDuesRevenue = payment.amount
        }
      } else if (payment.purpose === 'Facility Reservation Fees') {
        if (finance?.facilityFeesRevenue) {
          finance.facilityFeesRevenue += payment.amount
        } else {
          finance!!.facilityFeesRevenue = payment.amount
        }
      } else if (payment.purpose === 'Violation Fines') {
        if (finance?.violationFinesRevenue) {
          finance.violationFinesRevenue += payment.amount
        } else {
          finance!!.facilityFeesRevenue = payment.amount
        }
      } else {
        if (finance?.otherRevenue) {
          finance.otherRevenue += payment.amount
        } else {
          finance!!.otherRevenue = payment.amount
        }
      }
    })
  }

  hoaRevenuesForMonth?.map(revenue => {
    if (revenue.purpose === 'Association Dues') {
      if (finance?.assocDuesRevenue) {
        finance.assocDuesRevenue += revenue.amount
      } else {
        finance!!.assocDuesRevenue = revenue.amount
      }
    } else if (revenue.purpose === 'Toll Fees') {
      if (finance?.tollFeesRevenue) {
        finance.tollFeesRevenue += revenue.amount
      } else {
        finance!!.tollFeesRevenue = revenue.amount
      }
    } else if (revenue.purpose === 'Facility Rentals') {
      if (finance?.facilityFeesRevenue) {
        finance.facilityFeesRevenue += revenue.amount
      } else {
        finance!!.facilityFeesRevenue = revenue.amount
      }
    } else if (revenue.purpose === 'Renovation and Demolition Fees') {
      if (finance?.renovDemoRevenue) {
        finance.renovDemoRevenue += revenue.amount
      } else {
        finance!!.renovDemoRevenue = revenue.amount
      }
    } else if (revenue.purpose === 'Car Sticker Receipts') {
      if (finance?.carStickerRevenue) {
        finance.carStickerRevenue += revenue.amount
      } else {
        finance!!.carStickerRevenue = revenue.amount
      }
    } else if (revenue.purpose === 'Donations') {
      if (finance?.donationsRevenue) {
        finance.donationsRevenue += revenue.amount
      } else {
        finance!!.donationsRevenue = revenue.amount
      }
    } else {
      if (finance?.otherRevenue) {
        finance.otherRevenue += revenue.amount
      } else {
        finance!!.otherRevenue = revenue.amount
      }
    }
  })

  if (hoaExpensesForMonth) {
    hoaExpensesForMonth?.map(expense => {
      if (expense.purpose === 'Salaries and Benefits') {
        if (finance?.salariesExpense) {
          finance.salariesExpense += expense.amount
        } else {
          finance!!.salariesExpense = expense.amount
        }
      } else if (expense.purpose === 'Utilities') {
        if (finance?.utilitiesExpense) {
          finance.utilitiesExpense += expense.amount
        } else {
          finance!!.utilitiesExpense = expense.amount
        }
      } else if (expense.purpose === 'Office Supplies') {
        if (finance?.officeSuppliesExpense) {
          finance.officeSuppliesExpense += expense.amount
        } else {
          finance!!.officeSuppliesExpense = expense.amount
        }
      } else if (expense.purpose === 'Furnitures and Fixtures') {
        if (finance?.furnituresFixturesExpense) {
          finance.furnituresFixturesExpense += expense.amount
        } else {
          finance!!.furnituresFixturesExpense = expense.amount
        }
      } else if (expense.purpose === 'Repair and Maintenance') {
        if (finance?.repairMaintenanceExpense) {
          finance.repairMaintenanceExpense += expense.amount
        } else {
          finance!!.repairMaintenanceExpense = expense.amount
        }
      } else if (expense.purpose === 'Legal & Professional Fees') {
        if (finance?.legalProfExpense) {
          finance.legalProfExpense += expense.amount
        } else {
          finance!!.legalProfExpense = expense.amount
        }
      } else if (expense.purpose === 'Administrative Costs') {
        if (finance?.administrativeExpense) {
          finance.administrativeExpense += expense.amount
        } else {
          finance!!.administrativeExpense = expense.amount
        }
      } else {
        if (finance?.miscellaneousExpense) {
          finance.miscellaneousExpense += expense.amount
        } else {
          finance!!.miscellaneousExpense = expense.amount
        }
      }
    })

    userUnpaidPaymentsForMonth?.map(receivable => {
      if (finance?.accountsReceivable) {
        finance.accountsReceivable += receivable.amount
      } else {
        finance!!.accountsReceivable = receivable.amount
      }
    })

    const {
      assocDuesRevenue,
      tollFeesRevenue,
      facilityFeesRevenue,
      violationFinesRevenue,
      renovDemoRevenue,
      carStickerRevenue,
      donationsRevenue,
      otherRevenue,
      salariesExpense,
      utilitiesExpense,
      officeSuppliesExpense,
      repairMaintenanceExpense,
      furnituresFixturesExpense,
      legalProfExpense,
      administrativeExpense,
      miscellaneousExpense
    } = finance!!

    const RevValuesExist =
      assocDuesRevenue || tollFeesRevenue || facilityFeesRevenue || otherRevenue
    const ExpValuesExist =
      salariesExpense ||
      utilitiesExpense ||
      officeSuppliesExpense ||
      repairMaintenanceExpense ||
      furnituresFixturesExpense ||
      legalProfExpense ||
      administrativeExpense ||
      miscellaneousExpense

    if (RevValuesExist && ExpValuesExist) {
      const revenueSum =
        (assocDuesRevenue || 0) +
        (tollFeesRevenue || 0) +
        (facilityFeesRevenue || 0) +
        (violationFinesRevenue || 0) +
        (renovDemoRevenue || 0) +
        (carStickerRevenue || 0) +
        (donationsRevenue || 0) +
        (otherRevenue || 0)
      const expenseSum =
        (salariesExpense || 0) +
        (utilitiesExpense || 0) +
        (officeSuppliesExpense || 0) +
        (furnituresFixturesExpense || 0) +
        (repairMaintenanceExpense || 0) +
        (legalProfExpense || 0) +
        (administrativeExpense || 0) +
        (miscellaneousExpense || 0)
      finance!!.totalRevenue = revenueSum
      finance!!.totalExpenses = expenseSum
      finance!!.netIncome = revenueSum - expenseSum
    }
  }

  return (
    <div>
      <FinancialReportsClient
        hoaInfo={hoaInfo}
        finance={finance}
        year={year || now.getFullYear().toString()}
        month={month || now.getMonth().toString()}
      />
    </div>
  )
}

export default FinancialReports
