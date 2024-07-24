import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface UserSummary {
  activeUsers: number
  requiredVotes: number
  voterTurnout: number
}

interface BarChartProps {
  userSummary: UserSummary
  loading: boolean
}

interface BarChartState {
  series: {
    name: string
    data: number[]
  }[]
  options: ApexOptions
}

class ElectionBarChart extends React.Component<BarChartProps, BarChartState> {
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
            return val.toString()
          },
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            colors: ['#000']
          }
        },
        colors: ['#6D936A', '#244B2F', '#FFA500'],
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        xaxis: {
          categories: ['Active Users', 'Required Votes', 'Actual Votes'],
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    }
  }

  componentDidMount () {
    this.updateChartData()
  }

  componentDidUpdate (prevProps: BarChartProps) {
    if (
      JSON.stringify(prevProps.userSummary) !==
      JSON.stringify(this.props.userSummary)
    ) {
      this.updateChartData()
    }
  }

  updateChartData = () => {
    const { userSummary } = this.props

    // Prepare data for the chart
    const values = [
      userSummary.activeUsers,
      userSummary.requiredVotes,
      userSummary.voterTurnout
    ]

    this.setState({
      series: [{ name: 'Users', data: values }],
      options: {
        ...this.state.options
      }
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
        {this.props.loading ? (
          <Spinner size='xl' />
        ) : (
          <Chart
            options={this.state.options}
            series={this.state.series}
            type='bar'
            height={300}
            width={400}
          />
        )}
      </Box>
    )
  }
}

export default ElectionBarChart
