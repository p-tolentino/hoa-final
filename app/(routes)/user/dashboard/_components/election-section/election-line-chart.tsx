import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface VoteResponse {
  candidateName: string
  voteCount: number
}

interface ElectionLineChartProps {
  votes: VoteResponse[]
  loading: boolean
}

const ElectionLineChart: React.FC<ElectionLineChartProps> = ({
  votes,
  loading
}) => {
  const candidateNames = votes.map(vote => vote.candidateName)
  const voteCounts = votes.map(vote => vote.voteCount)

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true,
        zoomedArea: {
          fill: {
            color: '#335A39',
            opacity: 0.4
          }
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    colors: ['#6D936A'],
    stroke: {
      curve: 'smooth'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 8,
      colors: ['#49563A']
    },
    xaxis: {
      categories: candidateNames,
      title: {
        text: 'Candidates',
        style: {
          fontSize: '12px',
          fontFamily: 'font.body',
          fontWeight: '600'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Votes',
        style: {
          fontSize: '12px',
          fontFamily: 'font.body',
          fontWeight: '600'
        }
      }
    }
  }

  const chartSeries = [
    {
      name: 'Votes',
      data: voteCounts
    }
  ]

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      {loading ? (
        <Spinner size='xl' />
      ) : (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type='line'
          height={300}
          width={400}
        />
      )}
    </Box>
  )
}

export default ElectionLineChart
