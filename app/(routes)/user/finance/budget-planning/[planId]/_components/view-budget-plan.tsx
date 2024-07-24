'use client'

import { useRef } from 'react'
import { Heading } from '@/components/ui/heading'
import { FaFilePdf } from 'react-icons/fa'
import { BudgetPlan, Hoa } from '@prisma/client'
import { useReactToPrint } from 'react-to-print'
import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import PdfView from './pdf-view'
import BackButton from '@/components/system/BackButton'
import ViewExpenseTable from './expenses-view'
import ViewRevenueTable from './revenue-view'
import ViewTotalTable from './totals-view'

interface ViewFormProps {
  initialData: BudgetPlan | null
  previous: BudgetPlan | null
  hoaInfo: Hoa
}

export const ViewBudgetPlan: React.FC<ViewFormProps> = ({
  initialData,
  previous,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `${initialData?.forYear} Budget Plan`
  const pageDescription = `Access a specific budget plan of the Homeowners' Association.`

  // Report Title and Subtitle
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}`

  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null
  })

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <Button
              size='sm'
              variant='outline'
              colorScheme='orange'
              leftIcon={<FaFilePdf />}
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* PDF View */}
      <div className='hidden'>
        <div ref={componentPDF} style={{ width: '100%' }}>
          <PdfView
            initialData={initialData}
            previous={previous}
            hoaInfo={hoaInfo}
            reportTitle={reportTitle}
            reportSubtitle={reportSubtitle}
          />
        </div>
      </div>

      {/* Budget Planning Tables */}
      <Stack spacing={10}>
        <ViewRevenueTable plan={initialData} previous={previous} />
        <ViewExpenseTable plan={initialData} previous={previous} />
        <ViewTotalTable plan={initialData} previous={previous} />
      </Stack>
    </>
  )
}

export default ViewBudgetPlan
