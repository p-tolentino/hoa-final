import React, { useEffect, useState } from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { MaintenanceRequestData } from '../../page'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface PendingVsCompletedProps {
  data: MaintenanceRequestData[]
}

// Grid Row Colors
const gridRowColors = ['#f3f3f3', 'transparent']

// Chart Colors
const chartColors = ['#6D936A', '#335A39'] // Adjusted to match your example

const PendingVsCompleted: React.FC<PendingVsCompletedProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true)

  const series = [
    {
      name: 'Pending',
      data: data.map(item => item.pending)
    },
    {
      name: 'Completed',
      data: data.map(item => item.completed)
    }
  ]

  const maintenanceTypes = data.map(item => item.maintenanceType)

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: [chartColors[0], chartColors[1]], // Adjusted colors
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
      title: {
        text: 'Total Requests',
        style: {
          fontSize: '12px',
          fontFamily: 'font.body',
          fontWeight: '600'
        }
      },
      categories: maintenanceTypes,
      labels: {
        style: {
          fontSize: '8px'
        }
      }
    }
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

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
          type='bar'
          height={300}
          width={400}
        />
      )}
    </Box>
  )
}

export default PendingVsCompleted
