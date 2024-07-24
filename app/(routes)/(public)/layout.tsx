import { Footer } from '@/components/system/Footer'
import { Navbar } from '@/components/system/Navbar'
import { getHoaInfo } from '@/server/data/hoa-info'

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const existingHoa = await getHoaInfo()
  if (!existingHoa) {
    return null
  }

  return (
    <>
      <Navbar existingHoa={existingHoa} />
      <div className='min-h-full'>{children}</div>
      <Footer existingHoa={existingHoa} />
    </>
  )
}
export default PublicLayout
