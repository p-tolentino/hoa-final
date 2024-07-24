import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LineChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

interface LineChartState {
  options: ApexOptions
  loading: boolean
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
          text: 'Maintenance Requests',
          style: {
            fontSize: '12px',
            fontFamily: 'font.body',
            fontWeight: '600'
          }
        }
      }
    },
    loading: true
  }

  // Update chart options whenever categories or series change
  componentDidUpdate (prevProps: LineChartProps) {
    if (
      JSON.stringify(prevProps.categories) !==
        JSON.stringify(this.props.categories) ||
      JSON.stringify(prevProps.series) !== JSON.stringify(this.props.series)
    ) {
      this.setState({
        options: {
          ...this.state.options,
          xaxis: {
            ...this.state.options.xaxis,
            categories: this.props.categories
          }
        },
        loading: false
      })
    }
  }

  render () {
    const { series } = this.props

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
            series={series}
            type='line'
            height={300}
            width={800}
          />
        )}
      </Box>
    )
  }
}

export default LineChart
