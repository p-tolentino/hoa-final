import { currentUser } from '@/lib/auth'
import UserInfo from './_components/user-info'
import {
  getInfoById,
  getPropertyById,
  getVehicleById
} from '@/server/data/user-info'

const Profile = async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const info = await getInfoById(user?.id)

  if (!info) {
    return null
  }

  const vehicles = await getVehicleById(user?.id)

  if (!vehicles) {
    return null
  }

  const property = await getPropertyById(user?.id)

  if (!property) {
    return null
  }

  return (
    <div className='flex-1 space-y-4'>
      <UserInfo
        user={user}
        info={info}
        vehicles={vehicles}
        property={property}
      />
    </div>
  )
}

export default Profile
