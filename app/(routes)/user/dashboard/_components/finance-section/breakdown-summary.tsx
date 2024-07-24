import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface BreakdownRevExpSummary {
  purpose: string
  amount: number
}

interface BarChartProps {
  summary: BreakdownRevExpSummary[]
  purpose: string
}

interface BarChartState {
  series: {
    name: string
    data: number[]
  }[]
  options: ApexOptions
  loading: boolean
}

// Grid Row Colors
const gridRowColors = ['#f3f3f3', 'transparent']

// Chart Colors
const chartColors = [
  '#6D936A', // [0] Dark Sea Green (Base)
  '#49563A', // [1] Dark Olive Green (applicable to Markers)
  '#A1B4A0', // [2] Light Grayish Green
  '#244B2F', // [3] Dark Green
  '#7CA689', // [4] Green Sheen
  '#335A39', // [5] Hunter Green (applicable to Bar Chart and Zoom Area)
  '#8ABE99' // [6] Light Green
]

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
            horizontal: false,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
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
        colors: [chartColors[0]],
        grid: {
          row: {
            colors: gridRowColors,
            opacity: 0.5
          }
        },
        // X-axis
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        // Y-axis
        yaxis: {
          labels: {
            formatter: function (val) {
              return formatCurrency(val)
            }
          },
          stepSize: 50000
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
      JSON.stringify(prevProps.summary) !== JSON.stringify(this.props.summary)
    ) {
      this.updateChartData()
    }
  }

  updateChartData = () => {
    const { summary, purpose } = this.props

    // Prepare data for the chart
    const data = summary.map(item => item.amount)
    const categories = summary.map(item => item.purpose)

    this.setState({
      series: [{ name: purpose, data }],
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
            height={300}
            width={450}
          />
        )}
      </Box>
    )
  }
}

export default BarChart
