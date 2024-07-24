'use client'

import { useRef } from 'react'
import { Heading } from '@/components/ui/heading'
import { FaFilePdf } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'
import { Spinner, ButtonGroup, Button, Stack } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Hoa, HoaTransactionType, PaymentStatus } from '@prisma/client'
import { useEffect, useState, useTransition } from 'react'
import { getAllTransactions } from '@/server/data/user-transactions'
import { getHoaTransactions } from '@/server/data/hoa-transactions'
import PdfView from './_components/pdf-view'
import ViewRevenueTable from './_components/revenue-view'
import ViewExpenseTable from './_components/expenses-view'
import ViewTotalTable from './_components/totals-view'
import BackButton from '@/components/system/BackButton'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const CompareMonths = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const year = searchParams.get('year')
  const month = searchParams.get('month')
  const compareYear = searchParams.get('compareYear')
  const compareMonth = searchParams.get('compareMonth')
  const initialized = useRef(false)
  const [monthData, setMonthData] = useState({})
  const [compareData, setCompareData] = useState({})

  const startOfSelectedMonth = new Date(parseInt(year!!), parseInt(month!!), 1)
  const endOfSelectedMonth = new Date(
    parseInt(year!!),
    parseInt(month!!) + 1,
    1
  )

  const startOfComparedMonth = new Date(
    parseInt(compareYear!!),
    parseInt(compareMonth!!),
    1
  )
  const endOfComparedMonth = new Date(
    parseInt(compareYear!!),
    parseInt(compareMonth!!) + 1,
    1
  )

  let data = {
    forDate:
      month && year ? `${months[parseInt(month!!)]} ${parseInt(year!!)}` : null,
    AssocDues: 0,
    Toll: 0,
    Facility: 0,
    Construction: 0,
    CarSticker: 0,
    OtherRev: 0,

    SalariesBenefits: 0,
    Utilities: 0,
    OfficeSupplies: 0,
    RepairMaintenance: 0,
    Donations: 0,
    FurnituresFixtures: 0,
    Representation: 0,
    LegalProfessionalFees: 0,
    AdministrativeCosts: 0,
    OtherExp: 0,

    TotalYearlyRev: 0,
    TotalYearlyExp: 0,
    TotalYearlySurplus: 0
  }

  let compareMonthData = {
    forDate:
      compareMonth && compareYear
        ? `${months[parseInt(compareMonth!!)]} ${parseInt(compareYear!!)}`
        : null,
    AssocDues: 0,
    Toll: 0,
    Facility: 0,
    Construction: 0,
    CarSticker: 0,
    OtherRev: 0,

    SalariesBenefits: 0,
    Utilities: 0,
    OfficeSupplies: 0,
    RepairMaintenance: 0,
    Donations: 0,
    FurnituresFixtures: 0,
    Representation: 0,
    LegalProfessionalFees: 0,
    AdministrativeCosts: 0,
    OtherExp: 0,

    TotalYearlyRev: 0,
    TotalYearlyExp: 0,
    TotalYearlySurplus: 0
  }

  const fetchData = async () => {
    const userPaymentsForMonth = await (
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
    const userPaymentsToCompare = await (
      await getAllTransactions()
    ).filter(transaction => {
      if (transaction.datePaid) {
        const isPaid = transaction.status === PaymentStatus.PAID
        const isPaidWithinMonth =
          transaction.datePaid >= startOfComparedMonth &&
          transaction.datePaid <= endOfComparedMonth

        return isPaid && isPaidWithinMonth
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

    const hoaRevenuesToCompare = await (
      await getHoaTransactions()
    )?.filter(transaction => {
      const isRevenue = transaction.type === HoaTransactionType.REVENUE
      const isWithinMonth =
        transaction.dateIssued >= startOfComparedMonth &&
        transaction.dateIssued <= endOfComparedMonth

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

    const hoaExpensesToCompare = await (
      await getHoaTransactions()
    )?.filter(transaction => {
      const isExpense = transaction.type === HoaTransactionType.EXPENSE
      const isWithinMonth =
        transaction.dateIssued >= startOfComparedMonth &&
        transaction.dateIssued <= endOfComparedMonth

      return isExpense && isWithinMonth
    })

    if (userPaymentsForMonth || hoaRevenuesForMonth) {
      userPaymentsForMonth.map(payment => {
        if (payment.purpose === 'Association Dues') {
          if (data?.AssocDues) {
            data.AssocDues += payment.amount
          } else {
            data!!.AssocDues = payment.amount
          }
        } else if (payment.purpose === 'Facility Rentals') {
          if (data?.Facility) {
            data.Facility += payment.amount
          } else {
            data!!.Facility = payment.amount
          }
        } else {
          if (data?.OtherRev) {
            data.OtherRev += payment.amount
          } else {
            data!!.OtherRev = payment.amount
          }
        }
      })

      hoaRevenuesForMonth?.map(revenue => {
        if (revenue.purpose === 'Association Dues') {
          if (data?.AssocDues) {
            data.AssocDues += revenue.amount
          } else {
            data!!.AssocDues = revenue.amount
          }
        } else if (revenue.purpose === 'Facility Rentals') {
          if (data?.Facility) {
            data.Facility += revenue.amount
          } else {
            data!!.Facility = revenue.amount
          }
        } else if (revenue.purpose === 'Toll Fees') {
          if (data?.Toll) {
            data.Toll += revenue.amount
          } else {
            data!!.Toll = revenue.amount
          }
        } else if (revenue.purpose === 'Renovation and Demolition Fees') {
          if (data?.Construction) {
            data.Construction += revenue.amount
          } else {
            data!!.Construction = revenue.amount
          }
        } else if (revenue.purpose === 'Car Sticker Receipts') {
          if (data?.CarSticker) {
            data.CarSticker += revenue.amount
          } else {
            data!!.CarSticker = revenue.amount
          }
        } else {
          if (data?.OtherRev) {
            data.OtherRev += revenue.amount
          } else {
            data!!.OtherRev = revenue.amount
          }
        }
      })

      const { AssocDues, Toll, Facility, Construction, CarSticker, OtherRev } =
        data!!

      const RevValuesExist =
        AssocDues || Toll || Facility || Construction || CarSticker || OtherRev

      if (RevValuesExist) {
        const sum =
          (AssocDues || 0) +
          (Toll || 0) +
          (Facility || 0) +
          (Construction || 0) +
          (CarSticker || 0) +
          (OtherRev || 0)
        data!!.TotalYearlyRev = sum
      }
    }

    if (hoaExpensesForMonth) {
      hoaExpensesForMonth?.map(expense => {
        if (expense.purpose === 'Salaries and Benefits') {
          if (data?.SalariesBenefits) {
            data.SalariesBenefits += expense.amount
          } else {
            data!!.SalariesBenefits = expense.amount
          }
        } else if (expense.purpose === 'Utilities') {
          if (data?.Utilities) {
            data.Utilities += expense.amount
          } else {
            data!!.Utilities = expense.amount
          }
        } else if (expense.purpose === 'Office Supplies') {
          if (data?.OfficeSupplies) {
            data.OfficeSupplies += expense.amount
          } else {
            data!!.OfficeSupplies = expense.amount
          }
        } else if (expense.purpose === 'Repair and Maintenance') {
          if (data?.RepairMaintenance) {
            data.RepairMaintenance += expense.amount
          } else {
            data!!.RepairMaintenance = expense.amount
          }
        } else if (expense.purpose === 'Donations') {
          if (data?.Donations) {
            data.Donations += expense.amount
          } else {
            data!!.Donations = expense.amount
          }
        } else if (expense.purpose === 'Furnitures and Fixtures') {
          if (data?.FurnituresFixtures) {
            data.FurnituresFixtures += expense.amount
          } else {
            data!!.FurnituresFixtures = expense.amount
          }
        } else if (expense.purpose === 'Representation Expenses') {
          if (data?.Representation) {
            data.Representation += expense.amount
          } else {
            data!!.Representation = expense.amount
          }
        } else if (expense.purpose === 'Legal & Professional Fees') {
          if (data?.LegalProfessionalFees) {
            data.LegalProfessionalFees += expense.amount
          } else {
            data!!.LegalProfessionalFees = expense.amount
          }
        } else if (expense.purpose === 'Administrative Costs') {
          if (data?.AdministrativeCosts) {
            data.AdministrativeCosts += expense.amount
          } else {
            data!!.AdministrativeCosts = expense.amount
          }
        } else {
          if (data?.OtherExp) {
            data.OtherExp += expense.amount
          } else {
            data!!.OtherExp = expense.amount
          }
        }
      })

      const {
        SalariesBenefits,
        Utilities,
        OfficeSupplies,
        RepairMaintenance,
        Donations,
        FurnituresFixtures,
        Representation,
        LegalProfessionalFees,
        AdministrativeCosts,
        OtherExp
      } = data!!

      const ExpValuesExist =
        SalariesBenefits ||
        Utilities ||
        OfficeSupplies ||
        RepairMaintenance ||
        Donations ||
        FurnituresFixtures ||
        Representation ||
        LegalProfessionalFees ||
        AdministrativeCosts ||
        OtherExp

      if (ExpValuesExist) {
        const sum =
          (SalariesBenefits || 0) +
          (Utilities || 0) +
          (OfficeSupplies || 0) +
          (RepairMaintenance || 0) +
          (Donations || 0) +
          (FurnituresFixtures || 0) +
          (Representation || 0) +
          (LegalProfessionalFees || 0) +
          (AdministrativeCosts || 0) +
          (OtherExp || 0)
        data!!.TotalYearlyExp = sum
      }
    }

    if (data?.TotalYearlyExp && data?.TotalYearlyRev) {
      data!!.TotalYearlySurplus = data!!.TotalYearlyRev - data!!.TotalYearlyExp
    }

    if (userPaymentsToCompare || hoaRevenuesToCompare) {
      userPaymentsToCompare.map(payment => {
        if (payment.purpose === 'Association Dues') {
          if (compareMonthData?.AssocDues) {
            compareMonthData.AssocDues += payment.amount
          } else {
            compareMonthData!!.AssocDues = payment.amount
          }
        } else if (payment.purpose === 'Facility Rentals') {
          if (compareMonthData?.Facility) {
            compareMonthData.Facility += payment.amount
          } else {
            compareMonthData!!.Facility = payment.amount
          }
        } else {
          if (compareMonthData?.OtherRev) {
            compareMonthData.OtherRev += payment.amount
          } else {
            compareMonthData!!.OtherRev = payment.amount
          }
        }
      })

      hoaRevenuesToCompare?.map(revenue => {
        if (revenue.purpose === 'Association Dues') {
          if (compareMonthData?.AssocDues) {
            compareMonthData.AssocDues += revenue.amount
          } else {
            compareMonthData!!.AssocDues = revenue.amount
          }
        } else if (revenue.purpose === 'Facility Rentals') {
          if (compareMonthData?.Facility) {
            compareMonthData.Facility += revenue.amount
          } else {
            compareMonthData!!.Facility = revenue.amount
          }
        } else if (revenue.purpose === 'Toll Fees') {
          if (compareMonthData?.Toll) {
            compareMonthData.Toll += revenue.amount
          } else {
            compareMonthData!!.Toll = revenue.amount
          }
        } else if (revenue.purpose === 'Renovation and Demolition Fees') {
          if (compareMonthData?.Construction) {
            compareMonthData.Construction += revenue.amount
          } else {
            compareMonthData!!.Construction = revenue.amount
          }
        } else if (revenue.purpose === 'Car Sticker Receipts') {
          if (compareMonthData?.CarSticker) {
            compareMonthData.CarSticker += revenue.amount
          } else {
            compareMonthData!!.CarSticker = revenue.amount
          }
        } else {
          if (compareMonthData?.OtherRev) {
            compareMonthData.OtherRev += revenue.amount
          } else {
            compareMonthData!!.OtherRev = revenue.amount
          }
        }
      })

      const { AssocDues, Toll, Facility, Construction, CarSticker, OtherRev } =
        compareMonthData!!

      const RevValuesExist =
        AssocDues || Toll || Facility || Construction || CarSticker || OtherRev

      if (RevValuesExist) {
        const sum =
          (AssocDues || 0) +
          (Toll || 0) +
          (Facility || 0) +
          (Construction || 0) +
          (CarSticker || 0) +
          (OtherRev || 0)
        compareMonthData!!.TotalYearlyRev = sum
      }
    }

    if (hoaExpensesToCompare) {
      hoaExpensesToCompare?.map(expense => {
        if (expense.purpose === 'Salaries and Benefits') {
          if (compareMonthData?.SalariesBenefits) {
            compareMonthData.SalariesBenefits += expense.amount
          } else {
            compareMonthData!!.SalariesBenefits = expense.amount
          }
        } else if (expense.purpose === 'Utilities') {
          if (compareMonthData?.Utilities) {
            compareMonthData.Utilities += expense.amount
          } else {
            compareMonthData!!.Utilities = expense.amount
          }
        } else if (expense.purpose === 'Office Supplies') {
          if (compareMonthData?.OfficeSupplies) {
            compareMonthData.OfficeSupplies += expense.amount
          } else {
            compareMonthData!!.OfficeSupplies = expense.amount
          }
        } else if (expense.purpose === 'Repair and Maintenance') {
          if (compareMonthData?.RepairMaintenance) {
            compareMonthData.RepairMaintenance += expense.amount
          } else {
            compareMonthData!!.RepairMaintenance = expense.amount
          }
        } else if (expense.purpose === 'Donations') {
          if (compareMonthData?.Donations) {
            compareMonthData.Donations += expense.amount
          } else {
            compareMonthData!!.Donations = expense.amount
          }
        } else if (expense.purpose === 'Furnitures and Fixtures') {
          if (compareMonthData?.FurnituresFixtures) {
            compareMonthData.FurnituresFixtures += expense.amount
          } else {
            compareMonthData!!.FurnituresFixtures = expense.amount
          }
        } else if (expense.purpose === 'Representation Expenses') {
          if (compareMonthData?.Representation) {
            compareMonthData.Representation += expense.amount
          } else {
            compareMonthData!!.Representation = expense.amount
          }
        } else if (expense.purpose === 'Legal & Professional Fees') {
          if (compareMonthData?.LegalProfessionalFees) {
            compareMonthData.LegalProfessionalFees += expense.amount
          } else {
            compareMonthData!!.LegalProfessionalFees = expense.amount
          }
        } else if (expense.purpose === 'Administrative Costs') {
          if (compareMonthData?.AdministrativeCosts) {
            compareMonthData.AdministrativeCosts += expense.amount
          } else {
            compareMonthData!!.AdministrativeCosts = expense.amount
          }
        } else {
          if (compareMonthData?.OtherExp) {
            compareMonthData.OtherExp += expense.amount
          } else {
            compareMonthData!!.OtherExp = expense.amount
          }
        }
      })

      const {
        SalariesBenefits,
        Utilities,
        OfficeSupplies,
        RepairMaintenance,
        Donations,
        FurnituresFixtures,
        Representation,
        LegalProfessionalFees,
        AdministrativeCosts,
        OtherExp
      } = compareMonthData!!

      const ExpValuesExist =
        SalariesBenefits ||
        Utilities ||
        OfficeSupplies ||
        RepairMaintenance ||
        Donations ||
        FurnituresFixtures ||
        Representation ||
        LegalProfessionalFees ||
        AdministrativeCosts ||
        OtherExp

      if (ExpValuesExist) {
        const sum =
          (SalariesBenefits || 0) +
          (Utilities || 0) +
          (OfficeSupplies || 0) +
          (RepairMaintenance || 0) +
          (Donations || 0) +
          (FurnituresFixtures || 0) +
          (Representation || 0) +
          (LegalProfessionalFees || 0) +
          (AdministrativeCosts || 0) +
          (OtherExp || 0)
        compareMonthData!!.TotalYearlyExp = sum
      }
    }

    if (compareMonthData?.TotalYearlyExp && compareMonthData?.TotalYearlyRev) {
      compareMonthData!!.TotalYearlySurplus =
        compareMonthData!!.TotalYearlyRev - compareMonthData!!.TotalYearlyExp
    }

    console.log(data, compareMonthData)

    setMonthData(data)
    setCompareData(compareMonthData)
  }

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      startTransition(() => {
        fetchData().then(() => {
          router.refresh()
        })
      })
    }
  }, [])

  // Page Title and Description
  const pageTitle = `Revenue and Expense Comparison Report: ${
    months[parseInt(month!!)]
  } ${parseInt(year!!)}`
  const pageDescription = `View the comparison of revenue and expenses for ${
    months[parseInt(month!!)]
  } ${parseInt(year!!)} and ${
    compareMonth && months[parseInt(compareMonth!!)]
  } ${compareYear && parseInt(compareYear!!)} of the Homeowners' Association.`

  // Report Title and Subtitle
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}`

  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null
  })

  return isPending ? (
    <Spinner />
  ) : (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <Button
              size='sm'
              variant='outline'
              colorScheme='orange'
              leftIcon={<FaFilePdf />}
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* PDF View */}
      <div className='hidden'>
        <div ref={componentPDF} style={{ width: '100%' }}>
          <PdfView
            monthData={monthData}
            compareData={compareData}
            // hoaInfo={hoaInfo}
            reportTitle={reportTitle}
            reportSubtitle={reportSubtitle}
          />
        </div>
      </div>

      <Stack spacing={10}>
        <ViewRevenueTable monthData={monthData} compareData={compareData} />
        <ViewExpenseTable monthData={monthData} compareData={compareData} />
        <ViewTotalTable monthData={monthData} compareData={compareData} />
      </Stack>
    </>
  )
}

export default CompareMonths
