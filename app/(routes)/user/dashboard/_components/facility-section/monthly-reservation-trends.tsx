import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface LineChartProps {
  reservationsData: {
    month: string
    count: number
    facilities: { [key: string]: number }
  }[]
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

const MonthlyReservationTrends: React.FC<LineChartProps> = ({
  reservationsData
}) => {
  const [isLoading, setIsLoading] = useState(true)

  // Sort reservationsData based on month
  const sortedData = reservationsData.sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  )

  const months = sortedData.map(item => item.month)
  const facilityReservations = sortedData.map(item => item.count)

  // Pre-compute tooltip contents
  const tooltipContents = sortedData.map((item, index) => {
    const facilities = item.facilities
    const facilityList = Object.entries(facilities)
      .map(([name, count]) => `${name} - ${count}`)
      .join('<br>')

    return `
      <div style="padding: 5px; background: #fff; border: 1px solid #ccc;">
        <strong>${months[index]}</strong><br>
        ${facilityList}
      </div>
    `
  })

  const [options, setOptions] = useState<ApexOptions>({
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
      },
      toolbar: {
        show: true
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: [chartColors[0]],
    stroke: {
      curve: 'smooth'
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
    xaxis: {
      categories: months,
      title: {
        text: 'Month',
        style: {
          fontSize: '12px',
          fontFamily: 'font.body',
          fontWeight: '600'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Facility Reservations',
        style: {
          fontSize: '12px',
          fontFamily: 'font.body',
          fontWeight: '600'
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return tooltipContents[dataPointIndex]
      }
    }
  })

  const [series, setSeries] = useState([
    {
      name: 'Facility Reservations',
      data: facilityReservations
    }
  ])

  useEffect(() => {
    setSeries([
      {
        name: 'Facility Reservations',
        data: facilityReservations
      }
    ])

    setOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: months
      }
    }))

    setIsLoading(false)
  }, [months, facilityReservations])

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      {isLoading ? (
        <Spinner size='xl' />
      ) : (
        <Chart
          options={options}
          series={series}
          type='line'
          height={300}
          width={400}
        />
      )}
    </Box>
  )
}

export default MonthlyReservationTrends
