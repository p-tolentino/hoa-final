import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface DisputePieChartProps {
  series: number[]
  labels: string[]
}

interface DisputePieChartState {
  options: ApexOptions
  loading: boolean
}

function formatLabel (label: string): string {
  // Insert a space before each uppercase letter, convert the whole string to lowercase, and then capitalize the first letter of each word
  const formattedLabel = label
    // Add space before uppercase letters and convert to lowercase
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    // Split the string into words, capitalize the first letter of each, and join them back
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  return formattedLabel
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

class DisputePieChart extends React.Component<
  DisputePieChartProps,
  DisputePieChartState
> {
  constructor (props: DisputePieChartProps) {
    super(props)
    const formattedLabels = props.labels.map(label => formatLabel(label))
    this.state = {
      options: {
        chart: {
          type: 'pie',
          toolbar: {
            show: true, // Enable toolbar
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true
            }
          }
        },
        labels: formattedLabels,
        responsive: [
          {
            breakpoint: 800,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ],
        colors: chartColors,
        legend: {
          width: 150
        }
      },
      loading: true
    }
  }

  componentDidUpdate (prevProps: DisputePieChartProps) {
    // Check if labels prop has changed
    if (prevProps.labels !== this.props.labels) {
      const formattedLabels = this.props.labels.map(label => formatLabel(label))
      this.setState({
        options: {
          ...this.state.options,
          labels: formattedLabels
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
            series={this.props.series}
            type='pie'
            height={300}
            width={400}
          />
        )}
      </Box>
    )
  }
}

export default DisputePieChart
