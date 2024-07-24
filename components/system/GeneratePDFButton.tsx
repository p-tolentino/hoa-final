'use client'

import { Hoa } from '@prisma/client'
import { Button } from '@chakra-ui/react'
import { FaFilePdf } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'
import React, { useRef } from 'react'
import PDFTable from '@/components/system/PDFTable'

interface TableColumn {
  header: string
  accessor: string
}

interface GeneratePDFButtonProps {
  reportTitle: string
  reportSubtitle: string
  columns: TableColumn[]
  data: any[]
  hoaInfo: Hoa
}

const GeneratePDFButton: React.FC<GeneratePDFButtonProps> = ({
  reportTitle,
  reportSubtitle,
  columns,
  data,
  hoaInfo
}) => {
  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: reportTitle
  })

  return (
    <>
      {/* Generate PDF Button */}
      <Button
        size='sm'
        variant='outline'
        colorScheme='orange'
        leftIcon={<FaFilePdf />}
        onClick={generatePDF}
      >
        Generate PDF
      </Button>

      {/* Hidden PDF Table */}
      <div className='hidden'>
        <div ref={componentPDF} style={{ width: '100%' }}>
          {hoaInfo && (
            <PDFTable
              reportTitle={reportTitle}
              reportSubtitle={reportSubtitle}
              columns={columns}
              data={data}
              hoaInfo={hoaInfo}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default GeneratePDFButton
