import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface BarChartProps {
  series: {
    name: string
    data: number[]
  }[]
  categories: string[]
}

interface BarChartState {
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

class BarChart extends React.Component<BarChartProps, BarChartState> {
  constructor (props: BarChartProps) {
    super(props)
    this.state = {
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
          formatter: function (val) {
            return val + ' days'
          },
          style: {
            fontSize: '12px'
          }
        },
        colors: [chartColors[5]],
        grid: {
          row: {
            colors: gridRowColors,
            opacity: 0.5
          }
        },
        xaxis: {
          categories: props.categories
        }
      },
      loading: true
    }
  }

  componentDidUpdate (prevProps: BarChartProps) {
    if (prevProps.categories !== this.props.categories) {
      this.setState({
        options: {
          ...this.state.options,
          xaxis: {
            categories: this.props.categories
          }
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
