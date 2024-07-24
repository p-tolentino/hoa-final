import { format } from 'date-fns'

import { PropertyClient } from './_components/client'
import { PropertyColumn } from './_components/columns'
import { currentUser } from '@/lib/auth'
import { getAllProperties } from '@/server/data/property'
import { getHoaInfo } from '@/server/data/hoa-info'

const Properties = async () => {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const properties = await getAllProperties()

  if (!properties) {
    return null
  }

  const hoaInfo = await getHoaInfo()
  if (!hoaInfo) {
    return null
  }

  const formattedProperties: PropertyColumn[] = properties.map(item => ({
    id: item.id || '',
    address: item.address || '',
    lotNumber: item.lotNumber || '',
    lotSize: item.lotSize || '',
    purchaseDate: item.purchaseDate
      ? format(
          new Date(item.purchaseDate)?.toISOString().split('T')[0],
          'dd MMMM yyyy'
        )
      : '',
    user: user || ''
  }))

  return (
    <div className='flex'>
      <div className='flex-1 space-y-4'>
        <PropertyClient data={formattedProperties} hoaInfo={hoaInfo} />
      </div>
    </div>
  )
}

export default Properties
