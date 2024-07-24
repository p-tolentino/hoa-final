import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface PieChartProps {
  facilityData: {
    facilityName: string
    reservationCount: number
  }[]
}

const chartColors = [
  '#6D936A', // [0] Dark Sea Green (Base)
  '#49563A', // [1] Dark Olive Green (appplicable to Markers)
  '#A1B4A0', // [2] Light Grayish Green
  '#244B2F', // [3] Dark Green
  '#7CA689', // [4] Green Sheen
  '#335A39', // [5] Hunter Green (applicable to Bar Chart and Zoom Area)
  '#8ABE99' // [6] Light Green
]

const TopFacilitiesReserved: React.FC<PieChartProps> = ({ facilityData }) => {
  const facilities = facilityData.map(item => item.facilityName)
  const counts = facilityData.map(item => item.reservationCount)
  const [isLoading, setIsLoading] = useState(true)

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'pie'
    },
    labels: facilities,
    colors: chartColors,
    legend: {
      position: 'bottom'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  })

  const [series, setSeries] = useState(counts)

  useEffect(() => {
    setSeries(counts)
    setOptions(prevOptions => ({
      ...prevOptions,
      labels: facilities
    }))
    setIsLoading(false)
  }, [facilities, counts])

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
          type='pie'
          height={300}
          width={400}
        />
      )}
    </Box>
  )
}

export default TopFacilitiesReserved
