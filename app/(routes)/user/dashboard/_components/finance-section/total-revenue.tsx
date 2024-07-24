import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface FinancialSummary {
  yearMonth: string
  income: number
  expense: number
  net: number // Making this non-optional since you want to display it
}

interface LineChartProps {
  financialSummary: FinancialSummary[]
}

interface LineChartState {
  series: {
    name: string
    data: number[]
  }[]
  options: ApexOptions
  loading: boolean
}

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

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

class LineChart extends React.Component<LineChartProps, LineChartState> {
  state: LineChartState = {
    series: [
      {
        name: 'Income',
        data: []
      }
    ],
    // Chart Options
    options: {
      chart: {
        type: 'line',
        zoom: {
          enabled: true,
          zoomedArea: {
            fill: {
              color: chartColors[5],
              opacity: 0.4
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: [chartColors[0]],
      stroke: {
        curve: 'straight'
      },
      grid: {
        row: {
          colors: gridRowColors,
          opacity: 0.5
        }
      },
      markers: {
        size: 8,
        colors: [chartColors[1]]
      },
      // X-Axis
      xaxis: {
        categories: []
      },
      // Y-Axis
      yaxis: {
        title: {
          text: 'Income',
          style: {
            fontSize: '12px',
            fontFamily: 'font.body',
            fontWeight: '600'
          }
        },
        labels: {
          formatter: function (val) {
            return formatCurrency(val)
          },
          style: {
            fontSize: '10px'
          }
        },
        stepSize: 20000
      }
    },
    loading: true
  }

  componentDidMount () {
    const { financialSummary } = this.props
    // Sort financialSummary by yearMonth
    const sortedFinancialSummary = [...financialSummary].sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth)
    )

    const netData = sortedFinancialSummary.map(item => item.net)
    const categories = sortedFinancialSummary.map(item =>
      formatYearMonth(item.yearMonth)
    )

    this.setState({
      series: [{ name: 'Income', data: netData }],
      options: {
        ...this.state.options,
        xaxis: { ...this.state.options.xaxis, categories }
      }
    })
  }

  componentDidUpdate (prevProps: { financialSummary: any }) {
    // Check if financialSummary prop has changed
    if (
      JSON.stringify(prevProps.financialSummary) !==
      JSON.stringify(this.props.financialSummary)
    ) {
      const { financialSummary } = this.props
      // Sort financialSummary by yearMonth
      const sortedFinancialSummary = [...financialSummary].sort((a, b) =>
        a.yearMonth.localeCompare(b.yearMonth)
      )

      const netData = sortedFinancialSummary.map(item => item.net)
      const categories = sortedFinancialSummary.map(item =>
        formatYearMonth(item.yearMonth)
      )

      this.setState({
        series: [{ name: 'Income', data: netData }],
        options: {
          ...this.state.options,
          xaxis: { ...this.state.options.xaxis, categories }
        },
        loading: false
      })
    }
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
            type='line'
            height={400}
            width={800}
          />
        )}
      </Box>
    )
  }
}

export default LineChart
