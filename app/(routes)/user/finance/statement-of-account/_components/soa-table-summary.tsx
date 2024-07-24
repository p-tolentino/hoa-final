import { format } from 'date-fns'
import { PayNow } from './pay-now'
import { MonthlySoa, SoaPayment, UserTransaction } from '@prisma/client'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel
} from '@chakra-ui/react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const SoaTableSummary2 = ({
  data,
  transactionsToUpdate,
  soa,
  payments
}: {
  data: {
    purpose: string
    debit: number
    credit: number
  }[]
  transactionsToUpdate: UserTransaction[]
  soa: MonthlySoa | null | undefined
  payments: SoaPayment[] | null | undefined
}) => {
  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numericAmount)
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='border rounded-md mb-3 w-[500px]'>
        <Table>
          <TableHeader className='bg-[#F0CB5B]'>
            <TableRow className='font-black'>
              <TableHead>Fees</TableHead>
              <TableHead className='text-right pr-[120px]'>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((summary, index) => {
              const filteredTransactions = transactionsToUpdate.filter(
                transaction => transaction.purpose === summary.purpose
              )

              return (
                <TableRow key={index}>
                  <TableCell colSpan={2} style={{ width: '100%' }}>
                    <Accordion
                      allowMultiple
                      overflowY='auto'
                      style={{ height: '100%' }}
                    >
                      <AccordionItem
                        isDisabled={filteredTransactions.length === 0}
                      >
                        <AccordionButton className='w-full'>
                          <span className='font-bold'>{summary.purpose}</span>
                          <span className='ml-auto font-semibold'>
                            {formatCurrency(summary.credit)}
                          </span>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          {filteredTransactions.map((transaction, index) => (
                            <div key={index}>
                              {transaction.description} -
                              {formatCurrency(transaction.amount)}
                            </div>
                          ))}
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow>
              <TableCell className='font-bold'>Total</TableCell>
              <TableCell className='font-semibold text-right'>
                {soa && formatCurrency(parseFloat(soa?.total.toString()))}
              </TableCell>
            </TableRow>
            {payments &&
              payments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell className='flex flex-col font-bold'>
                    {format(new Date(payment.datePaid), 'MMMM dd, yyyy ')}
                    Payment
                    <span className='text-xs italic text-gray-500'>
                      {format(
                        new Date(payment.datePaid),
                        '(dd MMM yyyy - hh:mm a)'
                      )}
                    </span>
                  </TableCell>
                  <TableCell className='font-semibold text-right text-green-700'>
                    {formatCurrency(payment.amount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell className='text-lg font-bold'>Balance Due</TableCell>
              <TableCell className='text-xl font-bold text-right text-red-700'>
                {soa && formatCurrency(parseFloat(soa?.balance.toString()))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {soa?.balance && soa?.balance > 0 ? (
        <PayNow
          soa={soa}
          amountToPay={soa?.balance.toString()}
          transactionsToUpdate={transactionsToUpdate}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default SoaTableSummary2
