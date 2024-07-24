import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface FinancialSummary {
  yearMonth: string
  income: number
  expense: number
  net: number
}

interface BarChartProps {
  financialSummary: FinancialSummary[]
  primarySelection?: string
}

interface BarChartState {
  series: {
    name: string
    data: number[]
  }[]
  options: ApexOptions
  loading: boolean
}

// Format Currency, whether it be a type number, string, or array of numbers
const formatCurrency = (amount: number | string | number[]) => {
  let numericAmount

  if (typeof amount === 'string') {
    numericAmount = parseFloat(amount)
  } else if (Array.isArray(amount)) {
    numericAmount = amount[0]
  } else {
    numericAmount = amount
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

function formatYearMonth (yearMonth: string): string {
  const parts = yearMonth.split('-')
  // Ensure parts are converted to numbers where necessary
  const year = Number(parts[0])
  const month = Number(parts[1]) - 1 // Adjust for 0-indexed months in JavaScript Date
  const date = new Date(year, month)

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// Grid Row Colors
const gridRowColors = ['#f3f3f3', 'transparent']

// Chart Colors
const chartColors = [
  '#6D936A', // [0] Dark Sea Green (Base)
  '#49563A', // [1] Dark Olive Green (appplicable to Markers)
  '#A1B4A0', // [2] Light Grayish Green
  '#244B2F', // [3] Dark Green
  '#7CA689', // [4] Green Sheen
  '#335A39', // [5] Hunter Green (applicable to Bar Chart and Zoom Area)
  '#8ABE99' // [6] Light Green
]

class BarChart extends React.Component<BarChartProps, BarChartState> {
  constructor (props: BarChartProps) {
    super(props)
    this.state = {
      series: [],
      options: {
        chart: {
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: 43,
          formatter: function (val) {
            return formatCurrency(val)
          },
          style: {
            fontSize: '10px',
            fontWeight: 'normal',
            colors: ['black']
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return formatCurrency(val)
            }
          }
        },
        colors: [chartColors[0], chartColors[5]],
        grid: {
          row: {
            colors: gridRowColors,
            opacity: 0.5
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        // X-Axis
        xaxis: {
          categories: [],
          labels: {
            formatter: function (val) {
              return formatCurrency(val)
            },
            style: {
              fontSize: '10px'
            }
          },
          stepSize: 15000
        }
      },
      loading: true
    }
  }

  componentDidMount () {
    this.updateChartData()
  }

  componentDidUpdate (prevProps: BarChartProps) {
    if (
      JSON.stringify(prevProps.financialSummary) !==
      JSON.stringify(this.props.financialSummary)
    ) {
      this.updateChartData()
    }
  }

  updateChartData = () => {
    const { financialSummary } = this.props

    // Prepare data for the chart
    const incomeData = financialSummary.map(item => item.income)
    const expenseData = financialSummary.map(item => item.expense)
    const categories = financialSummary.map(item =>
      formatYearMonth(item.yearMonth)
    )

    this.setState({
      series: [
        { name: 'Revenue', data: incomeData },
        { name: 'Expenses', data: expenseData }
      ],
      options: {
        ...this.state.options,
        xaxis: { ...this.state.options.xaxis, categories }
      },
      loading: false
    })
  }
  render () {
    return (
      <Box
        width='100%'
        height='100%'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {this.state.loading ? (
          <Spinner size='xl' />
        ) : (
          <Chart
            options={this.state.options}
            series={this.state.series}
            type='bar'
            height={this.props.primarySelection === 'yearMonth' ? 300 : 600}
            width={800}
          />
        )}
      </Box>
    )
  }
}

export default BarChart
