'use client'

import {
  Button,
  Flex,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Text,
  Select,
  CardFooter,
  Stack,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Avatar,
  Center,
  Spinner
} from '@chakra-ui/react'
import { Heading } from '@/components/ui/heading'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'

// Summary Cards for each Module
import MembershipCard from './_components/summary-cards/membership-card'
import FinanceCard from './_components/summary-cards/finance-card'
import DiscussionCard from './_components/summary-cards/com-eng-card/discussion-total-post'
import BusinessCard from './_components/summary-cards/com-eng-card/business-total-post'
import EventCard from './_components/summary-cards/com-eng-card/event-total-post'
import PollCard from './_components/summary-cards/com-eng-card/poll-responses'
import DisputeCard from './_components/summary-cards/dispute-card'
import ViolationCard from './_components/summary-cards/violation-card'
import FacilityCard from './_components/summary-cards/facility-card'
import MaintenanceCard from './_components/summary-cards/maintenance-card'
import ElectionCard from './_components/summary-cards/election-card'

// Finance Charts
import TotalRevenue from './_components/finance-section/total-revenue'
import RevenueVsExpenses from './_components/finance-section/revenue-vs-expenses'
import BreakdownRevExpSummary from './_components/finance-section/breakdown-summary'

// Dispute and Violation Charts
import DisputePieChart from './_components/disputeViolation-section/dispute-pie-chart'
import ViolationPieChart from './_components/disputeViolation-section/violation-pie-chart'

// Facility Charts
import MonthlyReservationTrends from './_components/facility-section/monthly-reservation-trends'
import TopFacilitiesReserved from './_components/facility-section/top-facilities-reserved'

// Maintenance Charts
import MaintenanceRequestVolume from './_components/maintenance-section/maintenance-request-volume'
import AverageTimeToResolve from './_components/maintenance-section/average-time-resolve'
import PendingVsCompleted from './_components/maintenance-section/pending-vs-completed'

// Election Charts
import ElectionLineChart from './_components/election-section/election-line-chart'
import ElectionBarChart from './_components/election-section/election-bar-chart'

import React, { useEffect, useState, useTransition } from 'react'

import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'

/* Card Functions */
import {
  getMemberCount,
  getHoaFunds,
  getViolations,
  getDisputes,
  getViolationName,
  getAllDisputes,
  getDisputeName,
  fetchMaintenanceRequestData,
  getAverageResolveTime,
  getFacilityReserves,
  getMaintenanceCompleted,
  getLastVoterTurnout,
  getMonthlyReservationTrends,
  getTopFacilitiesReserved
} from '@/server/data/dashboard'
import { getAllElections } from '@/server/data/election-settings'
import { getAllVotesDashboard } from '@/server/data/election-settings'
import { getUniqueVotersCount } from '@/server/data/election-vote'
import { getActiveUsers } from '@/server/data/user'
import { getElectionRequiredVotes } from '@/server/data/election-settings'
import { Hoa } from '@prisma/client'

/* Graph Fucntions */
import { getHoaTransactions, getAllViolations } from '@/server/data/dashboard'

/* Community Engagement */
import {
  getDiscussionCount,
  getBusinessCount,
  getEventCount,
  countUniqueUsersWhoAnsweredPolls
} from '@/server/data/dashboard'
import { getHoaInfo } from '@/server/data/hoa-info'
import { FaFilePdf } from 'react-icons/fa'
import { getMaintenanceReqVolume } from '@/server/data/dashboard'
import ReportHeader from './_components/Report-Header'
import { FiUsers } from 'react-icons/fi'

interface Transaction {
  dateIssued: Date | string // Assuming dateIssued could be a Date object or a string
  type: 'REVENUE' | 'EXPENSE'
  amount: number
  purpose: string
}

interface BreakdownSummary {
  purpose: string
  amount: number
}

interface MonthlySummary {
  yearMonth: string // Make sure this is present and correctly typed
  income: number
  expense: number
  net: number // Depending on how you calculate or handle 'net', ensure it's included and correctly typed
}

interface SummaryByMonth {
  [yearMonth: string]: MonthlySummary
}

interface ViolationCounts {
  [key: string]: number
}

interface ViolationChartData {
  series: number[]
  labels: string[]
}

interface DisputeCounts {
  [key: string]: number
}

interface DisputeChartData {
  series: number[]
  labels: string[]
}

interface MonthlyRequestVolume {
  series: { name: string; data: number[] }[]
  categories: string[]
}
export interface MaintenanceRequestData {
  maintenanceType: string
  pending: number
  completed: number
}

export interface AverageResolveTimeData {
  maintenanceType: string
  averageTimeToResolve: number
}

interface FacilityReservation {
  month: string
  count: number
  facilities: { [key: string]: number }
}

interface VoteResponse {
  candidateName: string
  voteCount: number
}

interface ElectionSettings {
  id: string
  termOfOffice: string | null
}

export default function Dashboard () {
  // Page Title and Description
  const pageTitle = 'Dashboard'
  const pageDescription = `Navigate the Dashboard to gain insights into the various functions of the Homeowners' Association.`

  const currYear = new Date().getFullYear().toString()
  const currMonth = (new Date().getMonth() + 1).toString() // getMonth() is 0-indexed, add 1 to make it 1-indexed

  const [primarySelection, setPrimarySelection] = useState('all')
  const [selectedYear, setSelectedYear] = useState(currYear)
  const [selectedMonth, setSelectedMonth] = useState(currMonth)

  const [hoaInfo, setHoaInfo] = useState<Hoa>()

  const [memberCount, setMemberCount] = useState(0)
  const [hoaFunds, setFunds] = useState(0)
  const [violationCount, setViolationCount] = useState(0)
  const [disputeCount, setDisputeCount] = useState(0)
  const [facilityReserveCount, setFacilityReserveCount] = useState(0)
  const [maintenanceCompletedCount, setMaintenanceCompletedCount] = useState(0)
  const [lastVoterTurnout, setLastVoterTurnout] = useState(0)
  const [requiredVotes, setRequiredVotes] = useState(0)
  const [totalActiveUser, setTotalActiveUser] = useState(0)
  const [voteTurnout, setVoteTurnout] = useState(0)
  const [revenueSummary, setRevenueSummary] = useState<BreakdownSummary[]>([])
  const [expenseSummary, setExpenseSummary] = useState<BreakdownSummary[]>([])

  const [financialSummary, setFinancialSummary] = useState<MonthlySummary[]>([])
  const [violationTypeCounts, setViolationTypeCounts] =
    useState<ViolationCounts>({})
  const [violationChartData, setViolationChartData] =
    useState<ViolationChartData>({ series: [], labels: [] })

  const [disputeTypeCounts, setDisputeTypeCounts] = useState<DisputeCounts>({})
  const [disputeChartData, setDisputeChartData] = useState<DisputeChartData>({
    series: [],
    labels: []
  })

  const [discussionCount, setDiscussionCount] = useState(0)
  const [businessCount, setBusinessCount] = useState(0)
  const [eventCount, setEventCount] = useState(0)
  const [userPollCount, setUserPollCount] = useState(0)

  const [maintenanceRequestVolume, setMaintenanceRequestVolume] =
    useState<MonthlyRequestVolume>({
      series: [],
      categories: []
    })

  const [maintenanceRequestData, setMaintenanceRequestData] = useState<
    MaintenanceRequestData[]
  >([])

  const [averageTimeData, setAverageTimeData] = useState<
    AverageResolveTimeData[]
  >([])

  const [reservationsData, setReservationsData] = useState<
    FacilityReservation[]
  >([])

  const [topFacilitiesData, setTopFacilitiesData] = useState<
    { facilityName: string; reservationCount: number }[]
  >([])
  const [electionSettings, setElectionSettings] = useState<ElectionSettings[]>(
    []
  )
  const [selectedElection, setSelectedElection] = useState<string | null>(null)
  const [votes, setVotes] = useState<VoteResponse[]>([])
  const [loading, setLoading] = useState(false)

  const componentPDF = useRef<HTMLDivElement | null>(null)
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null
  })

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const activeUsers = await getActiveUsers()
      if (activeUsers) {
        setTotalActiveUser(activeUsers.length)
      }
    }

    fetchActiveUsers()
  }, [])

  useEffect(() => {
    const fetchElectionSettings = async () => {
      const data = await getAllElections()
      if (data) {
        setElectionSettings(data)
        setSelectedElection(data[0].id)
      }
    }
    fetchElectionSettings()
  }, [])

  useEffect(() => {
    if (selectedElection) {
      const fetchVotes = async () => {
        setLoading(true)
        const data = await getAllVotesDashboard(selectedElection)
        const votes = await getElectionRequiredVotes(selectedElection)
        const turnout = await getUniqueVotersCount(selectedElection)
        setLoading(false)
        if (data) {
          setVotes(data)
        }
        if (votes) {
          setRequiredVotes(votes)
        }
        if (turnout) {
          setVoteTurnout(turnout)
        } else {
          setVoteTurnout(0)
        }
      }
      fetchVotes()
    }
  }, [selectedElection])
  console.log('gathered votes are', votes)

  const handleElectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedElection(event.target.value)
  }

  const userSummary = {
    activeUsers: totalActiveUser,
    requiredVotes: requiredVotes,
    voterTurnout: voteTurnout
  }

  console.log('The election data are', userSummary)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const hoa = await getHoaInfo()
        if (hoa) {
          setHoaInfo(hoa)
        }

        const fetchedCount = await getMemberCount(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setMemberCount(fetchedCount)
        const fetchedFunds = await getHoaFunds()
        if (typeof fetchedFunds === 'number') {
          // Check if fetchedFunds is a number
          setFunds(fetchedFunds)
        } else {
          // Handle the undefined case or set a default value
          setFunds(0) // Example: setting default value to 0
        }
        const violationCount = await getViolations(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setViolationCount(violationCount)

        const disputeCount = await getDisputes(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setDisputeCount(disputeCount)

        const facilityReserveCount = await getFacilityReserves(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setFacilityReserveCount(facilityReserveCount)

        const maintenanceCompletedCount = await getMaintenanceCompleted(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setMaintenanceCompletedCount(maintenanceCompletedCount)

        const lastVoterTurnoutCount = await getLastVoterTurnout(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setLastVoterTurnout(lastVoterTurnoutCount)

        const transactions = await getHoaTransactions(
          primarySelection,
          selectedYear,
          selectedMonth
        )

        const revSum = calculateBreakdownByPurpose(transactions, 'REVENUE')
        setRevenueSummary(revSum)

        const expSum = calculateBreakdownByPurpose(transactions, 'EXPENSE')
        setExpenseSummary(expSum)

        const summary = calculateFinancialSummary(transactions)
        setFinancialSummary(summary)

        const fetchedViolations = await getAllViolations(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        if (fetchedViolations) {
          // Process to get counts by violation type
          const tempViolationCounts = fetchedViolations.reduce(
            async (accPromise, violation) => {
              const acc: ViolationCounts = await accPromise // Wait for the accumulator
              const typeName = await getViolationName(violation.type) // Fetch the real name using the type ID
              if (typeName) {
                acc[typeName] = acc[typeName] ? acc[typeName] + 1 : 1
              }
              return acc
            },
            Promise.resolve({}) // Start with a promise that resolves to an empty object
          )
          const violationTypeCounts = await tempViolationCounts // Ensure the final object is resolved
          const labels = Object.keys(violationTypeCounts)
          const series: number[] = Object.values(violationTypeCounts)
          setViolationChartData({ series, labels })
          setViolationTypeCounts(violationTypeCounts)
        }

        const fetchedDisputes = await getAllDisputes(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        if (fetchedDisputes) {
          // Process to get counts by violation type
          const tempDisputeCounts = fetchedDisputes.reduce(
            async (accPromise, dispute) => {
              const acc: DisputeCounts = await accPromise // Wait for the accumulator
              const typeName = await getDisputeName(dispute.type) // Fetch the real name using the type ID
              if (typeName) {
                acc[typeName] = acc[typeName] ? acc[typeName] + 1 : 1
              }
              return acc
            },
            Promise.resolve({}) // Start with a promise that resolves to an empty object
          )
          const DisputeTypeCounts = await tempDisputeCounts // Ensure the final object is resolved
          const labels = Object.keys(DisputeTypeCounts)
          const series: number[] = Object.values(DisputeTypeCounts)
          setDisputeChartData({ series, labels })
          setDisputeTypeCounts(DisputeTypeCounts)
        }

        const businessCount = await getBusinessCount(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setBusinessCount(businessCount)

        const DiscussCount = await getDiscussionCount(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setDiscussionCount(DiscussCount)

        const eventCount = await getEventCount(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setEventCount(eventCount)

        const userPollCount = await countUniqueUsersWhoAnsweredPolls(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setUserPollCount(userPollCount)

        const { series, categories } = await calculateMaintenanceRequestSummary(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setMaintenanceRequestVolume({ series, categories })

        const pendingCompleted = await fetchMaintenanceRequestData(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setMaintenanceRequestData(pendingCompleted)

        const avgTime = await getAverageResolveTime(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setAverageTimeData(avgTime)

        const monthlyReservationTrends = await getMonthlyReservationTrends(
          primarySelection,
          selectedYear,
          selectedMonth
        )

        const reservationTrends = await getMonthlyReservationTrends(
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setReservationsData(reservationTrends)

        const topFacilities = await getTopFacilitiesReserved(
          // Fetch top facilities
          primarySelection,
          selectedYear,
          selectedMonth
        )
        setTopFacilitiesData(topFacilities)
      } catch (error) {
        console.error(error)
      }
    }
    fetchInfo()
  }, [primarySelection, selectedYear, selectedMonth])

  function formatMonth (monthNumber: string) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const monthIndex = parseInt(monthNumber, 10) - 1 // Convert to integer and adjust for array index
    return monthNames[monthIndex]
  }

  const calculateBreakdownByPurpose = (
    transactions: Transaction[] | null,
    purpose: string
  ): BreakdownSummary[] => {
    if (!transactions) {
      return []
    }

    const breakdownByPurpose: { [key: string]: number } = transactions.reduce(
      (acc: { [key: string]: number }, transaction: Transaction) => {
        if (transaction.type === purpose) {
          if (!acc[transaction.purpose]) {
            acc[transaction.purpose] = 0
          }
          acc[transaction.purpose] += transaction.amount
        }
        return acc
      },
      {}
    )

    return Object.entries(breakdownByPurpose).map(([purpose, amount]) => ({
      purpose,
      amount
    }))
  }

  const calculateFinancialSummary = (
    transactions: Transaction[] | null
  ): MonthlySummary[] => {
    // If transactions is null, return an empty array immediately
    if (!transactions) {
      return []
    }

    const summaryByMonth: SummaryByMonth = transactions.reduce(
      (acc: SummaryByMonth, transaction: Transaction) => {
        const date = new Date(transaction.dateIssued)
        const yearMonthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}` // Format: YYYY-MM

        // Initialize the month entry in accumulator if it doesn't exist
        if (!acc[yearMonthKey]) {
          acc[yearMonthKey] = {
            yearMonth: yearMonthKey,
            income: 0,
            expense: 0,
            net: 0
          }
        }

        // Accumulate the amounts based on type
        if (transaction.type === 'REVENUE') {
          acc[yearMonthKey].income += transaction.amount
        } else if (transaction.type === 'EXPENSE') {
          acc[yearMonthKey].expense += transaction.amount
        }

        return acc
      },
      {}
    ) // Providing an empty object as the initial value for the accumulator

    const financialSummary: MonthlySummary[] = Object.entries(
      summaryByMonth
    ).map(([yearMonth, { income, expense }]) => ({
      yearMonth,
      income,
      expense,
      net: income - expense
    }))

    return financialSummary
  }

  const calculateMaintenanceRequestSummary = async (
    primarySelection: string,
    selectedYear?: string,
    selectedMonth?: string
  ): Promise<{
    series: { name: string; data: number[] }[]
    categories: string[]
  }> => {
    const maintenanceRequests = await getMaintenanceReqVolume(
      primarySelection,
      selectedYear,
      selectedMonth
    )

    // Define months array
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

    // Initialize data structure for series and categories
    const seriesData: { name: string; data: number[] }[] = [
      { name: 'Maintenance Requests', data: [] }
    ]
    const categories: string[] = []

    // Group requests by year and month
    const groupedRequests: { [key: string]: number } = {}

    maintenanceRequests.forEach(req => {
      const reqDate = new Date(req.createdAt)
      const yearMonthKey = `${
        months[reqDate.getMonth()]
      } ${reqDate.getFullYear()}`

      if (!groupedRequests[yearMonthKey]) {
        groupedRequests[yearMonthKey] = 0
      }

      groupedRequests[yearMonthKey]++
    })

    // Sort the keys to ensure the data is ordered by year and month
    const sortedKeys = Object.keys(groupedRequests).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ')
      const [bMonth, bYear] = b.split(' ')
      const aDate = new Date(`${aMonth} 1, ${aYear}`)
      const bDate = new Date(`${bMonth} 1, ${bYear}`)
      return aDate.getTime() - bDate.getTime()
    })

    // Populate seriesData and categories
    sortedKeys.forEach(key => {
      seriesData[0].data.push(groupedRequests[key])
      categories.push(key)
    })

    console.log({ series: seriesData, categories })

    return { series: seriesData, categories }
  }

  // PAGE SECTIONS
  const pageSections = [
    {
      Finance: {
        title: 'Finance',
        isViewableByHomeowner: true,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Board of Directors',
        charts: [
          {
            columnSpan: 2,
            title: `Total Income`,
            description: `This line chart shows the total income within the Homeowners Association`,
            importance: `It provides a visual representation of the financial information that would aid the organizations' financial decisions.`,
            chartFile: <TotalRevenue financialSummary={financialSummary} />
          }
        ]
      }
    },
    {
      Finance: {
        title: 'Finance',
        isRepeated: true,
        isViewableByHomeowner: true,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Board of Directors',
        charts: [
          {
            columnSpan: 2,
            title: `Revenue vs Expenses`,
            description: `This bar chart shows the comparison between the revenue and expenses of the Homeowners Association`,
            importance: `It aims to give insights on the revenue and expenses of the Homeowners Association, helping in determining budget allocations.`,
            chartFile: (
              <RevenueVsExpenses
                financialSummary={financialSummary}
                primarySelection={primarySelection}
              />
            )
          }
        ]
      }
    },
    {
      Finance: {
        title: 'Finance',
        isRepeated: true,
        isViewableByHomeowner: true,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Board of Directors',
        charts: [
          {
            title: `Breakdown of HOA Revenues`,
            description: ` This bar chart displays the various sources of revenue for the HOA, highlighting the contribution of each source to the total revenue.`,
            importance: `It offers a clear understanding of revenue sources, which is crucial for transparent financial management and strategic planning within the HOA.`,
            chartFile: (
              <BreakdownRevExpSummary
                summary={revenueSummary}
                purpose='Revenue'
              />
            )
          },
          {
            title: `Breakdown of HOA Expenses`,
            description: `This bar chart illustrates the different categories of expenses for the HOA, showing the proportion of each expense in the total budget.`,
            importance: `It aims to provide insight into expense distribution, helping in effective budgeting and ensuring that funds are allocated appropriately to maintain and improve the community.`,
            chartFile: (
              <BreakdownRevExpSummary
                summary={expenseSummary}
                purpose='Expense'
              />
            )
          }
        ]
      }
    },
    // {
    //   Disputes: {
    //     title: 'Disputes',
    //     isViewableByHomeowner: false,
    //     isViewableByBoardOrOfficer: false,
    //     committeeView: 'Grievance & Adjudication Committee',
    //     charts: [
    //       {
    //         title: `Top Disputes Reported`,
    //         description: `This pie chart breaks down the top disputes reported within the Homeowners Association.`,
    //         importance: `It offers a quick visual representation of disputes popularity, aiding in strategic planning for future dispute handling.`,
    //         chartFile: (
    //           <DisputePieChart
    //             series={disputeChartData.series}
    //             labels={disputeChartData.labels}
    //           />
    //         )
    //       }
    //     ]
    //   }
    // },
    // {
    //   Violations: {
    //     title: 'Violations',
    //     isViewableByHomeowner: false,
    //     isViewableByBoardOrOfficer: false,
    //     committeeView: 'Security Committee',
    //     charts: [
    //       {
    //         title: `Top Violations Reported`,
    //         description: `This pie chart breaks down the top violations reported within the Homeowners Association.`,
    //         importance: `It offers a quick visual representation of violations popularity, aiding in strategic planning for future precautions and more efficient security operations.`,
    //         chartFile: (
    //           <ViolationPieChart
    //             series={violationChartData.series}
    //             labels={violationChartData.labels}
    //           />
    //         )
    //       }
    //     ]
    //   }
    // },
    {
      DisputesViolations: {
        title: 'Disputes & Violations',
        isViewableByHomeowner: false,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Board of Directors',
        charts: [
          {
            title: `Top Disputes Reported`,
            description: `This pie chart breaks down the top disputes reported within the Homeowners Association.`,
            importance: `It offers a quick visual representation of disputes popularity, aiding in strategic planning for future dispute handling.`,
            chartFile: (
              <DisputePieChart
                series={disputeChartData.series}
                labels={disputeChartData.labels}
              />
            )
          },
          {
            title: `Top Violations Reported`,
            description: `This pie chart breaks down the top violations reported within the Homeowners Association.`,
            importance: `It offers a quick visual representation of violations popularity, aiding in strategic planning for future precautions and more efficient security operations.`,
            chartFile: (
              <ViolationPieChart
                series={violationChartData.series}
                labels={violationChartData.labels}
              />
            )
          }
        ]
      }
    },
    {
      Facility: {
        title: 'Facilities',
        isViewableByHomeowner: false,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Environment & Sanitation Committee',
        charts: [
          {
            title: `Monthly Reservation Trends`,
            description: `This line chart shows the number of reservations made for each facility over the past six months.`,
            importance: `It aims to identify usage patterns and seasonal trends, enabling informed decisions about facility maintenance, upgrades, and potential need for additional facilities.`,
            chartFile: (
              <MonthlyReservationTrends reservationsData={reservationsData} />
            )
          },
          {
            title: `Top Facilities Reserved`,
            description: `This pie chart breaks down the proportion of reservations for each facility.`,
            importance: `It offers a quick visual representation of facility popularity, aiding in strategic planning for future community events and facility enhancements.`,
            chartFile: (
              <TopFacilitiesReserved facilityData={topFacilitiesData} />
            )
          }
        ]
      }
    },

    {
      Maintenance: {
        title: 'Maintenance',
        isViewableByHomeowner: false,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Environment & Sanitation Committee',
        charts: [
          {
            columnSpan: 2,
            title: `Maintenance Request Volume`,
            description: `This line chart shows the number of maintenance requests received each month.`,
            importance: `It tracks trends in maintenance needs over time, helping board members plan and allocate resources effectively for maintenance tasks.`,
            chartFile: (
              <MaintenanceRequestVolume
                series={maintenanceRequestVolume.series}
                categories={maintenanceRequestVolume.categories}
              />
            )
          }
        ]
      }
    },
    {
      Maintenance: {
        title: 'Maintenance',
        isRepeated: true,
        isViewableByHomeowner: false,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Environment & Sanitation Committee',
        charts: [
          {
            title: `Pending vs. Completed Maintenance Requests`,
            description: `This stacked bar chart compares the number of pending and completed maintenance requests by maintenance type.`,
            importance: `It aims to help quickly assess the workload and effectiveness of the maintenance team, facilitating better workload management and prioritization.`,
            chartFile: <PendingVsCompleted data={maintenanceRequestData} />
          },
          {
            title: `Average Time to Resolve Maintenance Requests`,
            description: `This bar chart shows the average time taken to resolve maintenance requests by maintenance type.`,
            importance: `It measures efficiency in handling maintenance issues and identifies areas needing process improvements.`,
            chartFile: (
              <AverageTimeToResolve
                series={[
                  {
                    name: 'Average Time to Resolve',
                    data: averageTimeData.map(item =>
                      Math.round(item.averageTimeToResolve)
                    )
                  }
                ]}
                categories={averageTimeData.map(item => item.maintenanceType)}
              />
            )
          }
        ]
      }
    },
    {
      Elections: {
        title: 'Elections',
        isViewableByHomeowner: false,
        isViewableByBoardOrOfficer: true,
        committeeView: 'Election Committee',
        charts: [
          {
            title: `Total Votes by Board Member Candidate`,
            description: `This line chart shows the following board member candidates and their corresponding number of votes.`,
            importance: `It aims to visually display the results of the election voting process within the Homeowners Association.`,
            chartFile: <ElectionLineChart votes={votes} loading={loading} />
          },
          {
            title: `Detailed Voter Turnout`,
            description: `This bar chart shows the total number of active users, required votes, and actual votes for the selected election term.`,
            importance: `It provides insights into resident engagement and participation in the election process, helping board members understand trends in voter involvement and identify strategies to increase turnout in future elections.`,
            chartFile: (
              <ElectionBarChart userSummary={userSummary} loading={loading} />
            )
          }
        ]
      }
    }
  ]

  // Conditionals for displaying Dashboard Sections
  // const isViewableByHomeowner =
  //   user?.info.position === "Member" && user?.info.committee === null;
  // const isViewableByBoardOrOfficer =
  //   user?.info.position !== "Member" ||
  //   user?.info.committee === "Board of Directors";

  // const getCommitteeView = (committee: string) =>
  //   committee && user?.info.committee === committee;

  // const filteredSections = pageSections
  //   .map((sectionObj: any) => {
  //     const key = Object.keys(sectionObj)[0];
  //     const section = sectionObj[key];
  //     const {
  //       title,
  //       isViewableByHomeowner: sectionViewByHomeowner,
  //       isViewableByBoardOrOfficer: sectionViewByBoardOrOfficer,
  //       committeeView,
  //       charts,
  //     } = section;

  //     const isSectionViewable =
  //       (sectionViewByBoardOrOfficer && isViewableByBoardOrOfficer) ||
  //       (sectionViewByHomeowner && isViewableByHomeowner) ||
  //       getCommitteeView(committeeView);

  //     if (!isSectionViewable) return null;

  //     const filteredCharts = charts.filter((chart: any) => {
  //       return (
  //         (sectionViewByBoardOrOfficer && isViewableByBoardOrOfficer) ||
  //         (sectionViewByHomeowner && isViewableByHomeowner) ||
  //         getCommitteeView(committeeView)
  //       );
  //     });

  //     return filteredCharts.length ? { title, charts: filteredCharts } : null;
  //   })
  //   .filter(Boolean);

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <Button
            size='sm'
            variant='outline'
            colorScheme='orange'
            leftIcon={<FaFilePdf />}
            isDisabled={memberCount === 0 && hoaFunds === 0}
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
        }
      />
      <Flex justifyContent='space-between'>
        {/* Breadcrumb (Navigation) */}
        <Breadcrumb
          fontWeight='semibold'
          fontFamily='font.body'
          color='brand.500'
          pb={5}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href='#Summary'>SUMMARY</BreadcrumbLink>
          </BreadcrumbItem>
          {/* {filteredSections.map(
            (section, index) =>
              section && (
                <BreadcrumbItem key={`#${section.title}${index}`}>
                  <BreadcrumbLink href={`#${section.title}`}>
                    {section.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )
          )} */}
          {pageSections.map(sectionObj => {
            const section = Object.values(sectionObj)[0]
            if (section.isRepeated) {
              return null
            }
            return (
              <BreadcrumbItem key={`#${section.title}`}>
                <BreadcrumbLink href={`#${section.title}`}>
                  {section.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>

        {/* Selection Filter */}
        <Flex gap={3} fontFamily='font.body'>
          <Text>Filter:</Text>
          <Select
            size='sm'
            fontWeight='semibold'
            color='gray.500'
            onChange={e => setPrimarySelection(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='yearMonth'>Year & Month</option>
            <option value='year'>Year</option>
          </Select>
          {['yearMonth', 'year'].includes(primarySelection) && (
            <Select
              size='sm'
              fontWeight='semibold'
              color='gray.500'
              onChange={e => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const year = new Date().getFullYear() - index
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                )
              })}
            </Select>
          )}
          {primarySelection === 'yearMonth' && (
            <Select
              size='sm'
              fontWeight='semibold'
              color='gray.500'
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              {[
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ].map((month, index) => (
                <option key={index} value={(index + 1).toString()}>
                  {month}
                </option> // Assuming you want 1-indexed months
              ))}
            </Select>
          )}
        </Flex>
      </Flex>

      <Divider opacity={0.3} />

      <Box
        w='100%'
        borderRadius='md'
        h='68vh'
        overflowY='auto'
        overflowX='hidden'
        border='1px solid lightgrey'
        p={3}
      >
        {memberCount !== 0 && hoaFunds !== 0 ? (
          <Box ref={componentPDF}>
            {/* Report Header */}
            <Flex
              id='Summary'
              bg='brand.500'
              color='brand.400'
              h='70px'
              p={2}
              gap={3}
              mb={3}
              className='report-header'
            >
              {hoaInfo && (
                <>
                  <NextImage
                    src={SystemLogo}
                    alt='HOAs.is Logo'
                    width={100}
                    height={70}
                    className='m-2'
                  />
                  <Box m={2} lineHeight={1.1}>
                    <Text
                      fontSize='lg'
                      fontFamily='font.heading'
                      fontWeight='bold'
                    >
                      {hoaInfo?.name}
                    </Text>
                    <Flex gap={10}>
                      <Flex fontFamily='font.body' gap={3}>
                        <span>Contact Number: </span>
                        {hoaInfo?.contactNumber}
                      </Flex>
                    </Flex>
                  </Box>
                </>
              )}
            </Flex>
            <ReportHeader reportSection='HOAs.is Dashboard' hoaInfo={hoaInfo} />
            <Stack gap={6} alignItems='center'>
              {/* SUMMARY SECTION */}
              <Box w='90%'>
                <Text
                  casing='uppercase'
                  fontSize='2xl'
                  fontWeight='extrabold'
                  fontFamily='font.heading'
                  color='brand.500'
                  py={3}
                >
                  Summary{' '}
                  {primarySelection === 'yearMonth' ? (
                    <>
                      ({formatMonth(selectedMonth)} {selectedYear})
                    </>
                  ) : (
                    primarySelection === 'year' && <>(Year {selectedYear})</>
                  )}
                </Text>
                <Grid templateColumns='repeat(4, 1fr)' gap={3}>
                  {/* {isViewableByHomeowner ? (
                  <> */}
                  {/* Homeowner View */}
                  {/* {primarySelection === "all" && (
                      <GridItem w="100%" colSpan={1}>
                        <FinanceCard count={hoaFunds} />
                      </GridItem>
                    )}
                    <GridItem w="100%" colSpan={1}>
                      <ElectionCard
                        electionInfo={userSummary}
                        primarySelection={primarySelection}
                      />
                    </GridItem>
                  </> */}
                  {/* ) : (
                  <>
                    {isViewableByBoardOrOfficer ? (
                      <> */}
                  {/* Board of Director, Officer, System Admin, Superuser View */}
                  <GridItem w='100%' colSpan={1}>
                    <MembershipCard
                      count={memberCount}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  {primarySelection === 'all' && (
                    <GridItem w='100%' colSpan={1}>
                      <FinanceCard count={hoaFunds} />
                    </GridItem>
                  )}
                  <GridItem w='100%' colSpan={1}>
                    <DisputeCard
                      count={disputeCount}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  <GridItem w='100%' colSpan={1}>
                    <ViolationCard
                      count={violationCount}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  <GridItem
                    as={Flex}
                    w='100%'
                    colSpan={primarySelection === 'all' ? 4 : 3}
                    justifyContent='space-between'
                    p={4}
                    borderRadius='md'
                    boxShadow='md'
                    bg='white'
                    h='90px'
                  >
                    <Stack direction='row' w='100%' spacing={12}>
                      <DiscussionCard
                        discussCount={discussionCount}
                        primarySelection={primarySelection}
                      />
                      <BusinessCard
                        businessCount={businessCount}
                        primarySelection={primarySelection}
                      />
                      <EventCard
                        eventCount={eventCount}
                        primarySelection={primarySelection}
                      />
                      <PollCard
                        userPollCount={userPollCount}
                        primarySelection={primarySelection}
                      />
                    </Stack>
                    <Avatar
                      bg='#7CA689'
                      size='md'
                      icon={<FiUsers size={24} color='white' />}
                    />
                  </GridItem>
                  {primarySelection !== 'all' && (
                    <GridItem w='100%' colSpan={1} />
                  )}
                  <GridItem w='100%' colSpan={1}>
                    <FacilityCard
                      count={facilityReserveCount}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  <GridItem w='100%' colSpan={1}>
                    <MaintenanceCard
                      count={maintenanceCompletedCount}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  <GridItem w='100%' colSpan={1}>
                    <ElectionCard
                      electionInfo={userSummary}
                      primarySelection={primarySelection}
                    />
                  </GridItem>
                  {/* </>
                    ) : getCommitteeView("Election Committee") ? (
                      // Election Committee View
                      <>
                        <GridItem w="100%" colSpan={1}>
                          <MembershipCard
                            count={memberCount}
                            primarySelection={primarySelection}
                          />
                        </GridItem>
                        <GridItem w="100%" colSpan={1}>
                          <ElectionCard
                            electionInfo={userSummary}
                            primarySelection={primarySelection}
                          />
                        </GridItem>
                      </>
                    ) : getCommitteeView(
                        "Grievance & Adjudication Committee"
                      ) ? (
                      // Grievance & Adjudication Committee View
                      <GridItem w="100%" colSpan={1}>
                        <DisputeCard
                          count={disputeCount}
                          primarySelection={primarySelection}
                        />
                      </GridItem>
                    ) : getCommitteeView("Security Committee") ? (
                      // Security Committee View
                      <GridItem w="100%" colSpan={1}>
                        <ViolationCard
                          count={violationCount}
                          primarySelection={primarySelection}
                        />
                      </GridItem>
                    ) : getCommitteeView(
                        "Environment & Sanitation Committee"
                      ) ? (
                      <>
                        {/* Environment & Sanitation Committee View */}
                  {/* <GridItem w="100%" colSpan={1}>
                          <FacilityCard
                            count={facilityReserveCount}
                            primarySelection={primarySelection}
                          />
                        </GridItem>
                        <GridItem w="100%" colSpan={1}>
                          <MaintenanceCard
                            count={maintenanceCompletedCount}
                            primarySelection={primarySelection}
                          />
                        </GridItem> */}
                  {/* </>
                    ) : null} */}
                  {/* </> } */}
                  {/* )} */}
                </Grid>
              </Box>
              {/* PAGE SECTIONS */}
              {pageSections.map((sectionObj, index) => {
                const section = Object.values(sectionObj)[0]
                return (
                  <Box
                    id={section.title}
                    key={`${section.title}-${index}`}
                    w='90%'
                  >
                    <ReportHeader
                      reportSection={section.title}
                      hoaInfo={hoaInfo}
                    />
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      className='hide-in-print'
                    >
                      {!section.isRepeated && (
                        <Text
                          casing='uppercase'
                          fontSize='lg'
                          fontWeight='extrabold'
                          fontFamily='font.heading'
                          color='brand.500'
                          pt={3}
                        >
                          {section.title}
                        </Text>
                      )}
                    </Flex>
                    {section.title === 'Elections' && (
                      <Flex
                        gap={3}
                        fontFamily='font.body'
                        py={5}
                        alignItems='center'
                      >
                        <Text>Election Term:</Text>
                        <Select onChange={handleElectionChange} w='220px'>
                          {electionSettings.map(setting => (
                            <option key={setting.id} value={setting.id}>
                              {setting.termOfOffice}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                    )}
                    <Grid templateColumns='repeat(2, 1fr)' gap={5} mb={2}>
                      {section.charts.map((chart: any, chartIndex: number) => (
                        <GridItem
                          key={`${section.title}Chart${chartIndex}`}
                          colSpan={chart.columnSpan ? chart.columnSpan : 1}
                        >
                          <Card h='100%' p={7}>
                            <CardHeader p={0}>
                              <Text
                                fontSize='sm'
                                fontWeight='semibold'
                                color='gray.500'
                                mb={1.5}
                              >
                                {section.title !== 'Elections' && (
                                  <>
                                    {primarySelection === 'all'
                                      ? 'All Time'
                                      : primarySelection === 'year' &&
                                        selectedYear
                                      ? `Year ${selectedYear}`
                                      : primarySelection === 'yearMonth' &&
                                        selectedMonth &&
                                        selectedYear
                                      ? `${formatMonth(
                                          selectedMonth
                                        )} ${selectedYear}`
                                      : ''}
                                  </>
                                )}
                              </Text>
                              <Text fontSize='md' fontWeight='bold'>
                                {chart.title}
                              </Text>
                              <Text
                                fontSize='xs'
                                fontWeight='normal'
                                textAlign='justify'
                              >
                                {chart.description}
                              </Text>
                            </CardHeader>
                            <CardBody py={5} px={0}>
                              {chart.chartFile}
                            </CardBody>
                            <CardFooter fontSize='xs' textAlign='justify' p={0}>
                              <Text>{chart.importance}</Text>
                            </CardFooter>
                          </Card>
                        </GridItem>
                      ))}
                    </Grid>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        ) : (
          <Center fontFamily='font.body' color='lightgrey' pt={10} gap={2}>
            No results to show.
          </Center>
        )}
      </Box>
    </>
  )
}
