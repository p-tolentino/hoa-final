import { db } from '@/lib/db'
import ViewBudgetPlan from './_components/view-budget-plan'
import { getAllTransactions } from '@/server/data/user-transactions'
import { HoaTransactionType, PaymentStatus } from '@prisma/client'
import { getHoaTransactions } from '@/server/data/hoa-transactions'
import { getHoaInfo } from '@/server/data/hoa-info'

const ViewPage = async ({ params }: { params: { planId: string } }) => {
  const plan = await db.budgetPlan.findUnique({
    where: {
      id: params.planId
    }
  })

  const prevPlan = await db.budgetPlan.findFirst({
    where: {
      forYear: plan!!.forYear - 1
    }
  })

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const userPayments = await (
    await getAllTransactions()
  ).filter(transaction => {
    if (transaction.datePaid) {
      const isPaid = transaction.status === PaymentStatus.PAID
      const isPaidWithinYear =
        transaction.datePaid.getFullYear() === plan?.forYear

      return isPaid && isPaidWithinYear
    }
  })

  const hoaRevenues = await (
    await getHoaTransactions()
  )?.filter(transaction => {
    const isRevenue = transaction.type === HoaTransactionType.REVENUE
    const isWithinYear = transaction.dateIssued.getFullYear() === plan?.forYear

    return isRevenue && isWithinYear
  })

  const hoaExpenses = await (
    await getHoaTransactions()
  )?.filter(transaction => {
    const isExpense = transaction.type === HoaTransactionType.EXPENSE
    const isWithinYear = transaction.dateIssued.getFullYear() === plan?.forYear

    return isExpense && isWithinYear
  })

  if (userPayments || hoaRevenues) {
    userPayments.map(payment => {
      if (payment.purpose === 'Association Dues') {
        if (plan?.ytdaAssocDues) {
          plan.ytdaAssocDues += payment.amount
        } else {
          plan!!.ytdaAssocDues = payment.amount
        }
      } else if (payment.purpose === 'Facility Rentals') {
        if (plan?.ytdaFacility) {
          plan.ytdaFacility += payment.amount
        } else {
          plan!!.ytdaFacility = payment.amount
        }
      } else {
        if (plan?.ytdaOtherRev) {
          plan.ytdaOtherRev += payment.amount
        } else {
          plan!!.ytdaOtherRev = payment.amount
        }
      }
    })

    hoaRevenues?.map(revenue => {
      if (revenue.purpose === 'Association Dues') {
        if (plan?.ytdaAssocDues) {
          plan.ytdaAssocDues += revenue.amount
        } else {
          plan!!.ytdaAssocDues = revenue.amount
        }
      } else if (revenue.purpose === 'Facility Rentals') {
        if (plan?.ytdaFacility) {
          plan.ytdaFacility += revenue.amount
        } else {
          plan!!.ytdaFacility = revenue.amount
        }
      } else if (revenue.purpose === 'Toll Fees') {
        if (plan?.ytdaToll) {
          plan.ytdaToll += revenue.amount
        } else {
          plan!!.ytdaToll = revenue.amount
        }
      } else if (revenue.purpose === 'Renovation and Demolition Fees') {
        if (plan?.ytdaConstruction) {
          plan.ytdaConstruction += revenue.amount
        } else {
          plan!!.ytdaConstruction = revenue.amount
        }
      } else if (revenue.purpose === 'Car Sticker Receipts') {
        if (plan?.ytdaCarSticker) {
          plan.ytdaCarSticker += revenue.amount
        } else {
          plan!!.ytdaCarSticker = revenue.amount
        }
      } else {
        if (plan?.ytdaOtherRev) {
          plan.ytdaOtherRev += revenue.amount
        } else {
          plan!!.ytdaOtherRev = revenue.amount
        }
      }
    })

    const {
      ytdaAssocDues,
      ytdaToll,
      ytdaFacility,
      ytdaConstruction,
      ytdaCarSticker,
      ytdaOtherRev
    } = plan!!

    const ytdaRevValuesExist =
      ytdaAssocDues ||
      ytdaToll ||
      ytdaFacility ||
      ytdaConstruction ||
      ytdaCarSticker ||
      ytdaOtherRev

    if (ytdaRevValuesExist) {
      const sum =
        (ytdaAssocDues || 0) +
        (ytdaToll || 0) +
        (ytdaFacility || 0) +
        (ytdaConstruction || 0) +
        (ytdaCarSticker || 0) +
        (ytdaOtherRev || 0)
      if (plan!!.ytdaTotalYearlyRev === null) {
        plan!!.ytdaTotalYearlyRev = sum
      }
    }
  }

  if (hoaExpenses) {
    hoaExpenses?.map(expense => {
      if (expense.purpose === 'Salaries and Benefits') {
        if (plan?.ytdaSalariesBenefits) {
          plan.ytdaSalariesBenefits += expense.amount
        } else {
          plan!!.ytdaSalariesBenefits = expense.amount
        }
      } else if (expense.purpose === 'Utilities') {
        if (plan?.ytdaUtilities) {
          plan.ytdaUtilities += expense.amount
        } else {
          plan!!.ytdaUtilities = expense.amount
        }
      } else if (expense.purpose === 'Office Supplies') {
        if (plan?.ytdaOfficeSupplies) {
          plan.ytdaOfficeSupplies += expense.amount
        } else {
          plan!!.ytdaOfficeSupplies = expense.amount
        }
      } else if (expense.purpose === 'Repair and Maintenance') {
        if (plan?.ytdaRepairMaintenance) {
          plan.ytdaRepairMaintenance += expense.amount
        } else {
          plan!!.ytdaRepairMaintenance = expense.amount
        }
      } else if (expense.purpose === 'Donations') {
        if (plan?.ytdaDonations) {
          plan.ytdaDonations += expense.amount
        } else {
          plan!!.ytdaDonations = expense.amount
        }
      } else if (expense.purpose === 'Furnitures and Fixtures') {
        if (plan?.ytdaFurnituresFixtures) {
          plan.ytdaFurnituresFixtures += expense.amount
        } else {
          plan!!.ytdaFurnituresFixtures = expense.amount
        }
      } else if (expense.purpose === 'Representation Expenses') {
        if (plan?.ytdaRepresentation) {
          plan.ytdaRepresentation += expense.amount
        } else {
          plan!!.ytdaRepresentation = expense.amount
        }
      } else if (expense.purpose === 'Legal & Professional Fees') {
        if (plan?.ytdaLegalProfessionalFees) {
          plan.ytdaLegalProfessionalFees += expense.amount
        } else {
          plan!!.ytdaLegalProfessionalFees = expense.amount
        }
      } else if (expense.purpose === 'Administrative Costs') {
        if (plan?.ytdaAdministrativeCosts) {
          plan.ytdaAdministrativeCosts += expense.amount
        } else {
          plan!!.ytdaAdministrativeCosts = expense.amount
        }
      } else {
        if (plan?.ytdaOtherExp) {
          plan.ytdaOtherExp += expense.amount
        } else {
          plan!!.ytdaOtherExp = expense.amount
        }
      }
    })

    const {
      ytdaSalariesBenefits,
      ytdaUtilities,
      ytdaOfficeSupplies,
      ytdaRepairMaintenance,
      ytdaDonations,
      ytdaFurnituresFixtures,
      ytdaRepresentation,
      ytdaLegalProfessionalFees,
      ytdaAdministrativeCosts,
      ytdaOtherExp
    } = plan!!

    const ytdaExpValuesExist =
      ytdaSalariesBenefits ||
      ytdaUtilities ||
      ytdaOfficeSupplies ||
      ytdaRepairMaintenance ||
      ytdaDonations ||
      ytdaFurnituresFixtures ||
      ytdaRepresentation ||
      ytdaLegalProfessionalFees ||
      ytdaAdministrativeCosts ||
      ytdaOtherExp

    if (ytdaExpValuesExist) {
      const sum =
        (ytdaSalariesBenefits || 0) +
        (ytdaUtilities || 0) +
        (ytdaOfficeSupplies || 0) +
        (ytdaRepairMaintenance || 0) +
        (ytdaDonations || 0) +
        (ytdaFurnituresFixtures || 0) +
        (ytdaRepresentation || 0) +
        (ytdaLegalProfessionalFees || 0) +
        (ytdaAdministrativeCosts || 0) +
        (ytdaOtherExp || 0)
      if (plan!!.ytdaTotalYearlyExp === null) {
        plan!!.ytdaTotalYearlyExp = sum
      }
    }
  }

  if (plan?.ytdaTotalYearlyExp && plan?.ytdaTotalYearlyRev) {
    plan!!.ytdaTotalYearlySurplus =
      plan!!.ytdaTotalYearlyRev - plan!!.ytdaTotalYearlyExp
  }

  return (
    <div>
      <ViewBudgetPlan
        initialData={plan}
        previous={prevPlan}
        hoaInfo={hoaInfo}
      />
    </div>
  )
}

export default ViewPage
