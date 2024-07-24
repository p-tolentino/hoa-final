'use server'

import * as z from 'zod'

import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/server/data/user'
import { PaymentStatus } from '@prisma/client'
import { getHoaInfo } from '../data/hoa-info'
import { getSoaByDate } from '../data/soa'
import { createSoa } from './soa'
import { format } from 'date-fns'

export const createAssocDue = async (soaId: string | null) => {
  const user = await currentUser()

  // No Current User
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  const hoa = await getHoaInfo()

  if (!hoa) {
    return { error: 'Unregistered HOA' }
  }

  await db.userTransaction.create({
    data: {
      soaId,
      purpose: 'Association Dues',
      description: `${format(new Date(), 'MMMM').toUpperCase()} Monthly Dues`,
      amount: hoa.fixedDue!!,
      addressId: dbUser.info?.address
    }
  })

  return { success: 'Association Dues billed successfully' }
}

export const newUserTransaction = async (values: any) => {
  const user = await currentUser()

  // No Current User
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await db.userTransaction.create({
    data: {
      ...values
    }
  })

  return { success: 'Transaction created successfully' }
}

export const updateTransactionSoaId = async (id: string, soaId: string) => {
  const user = await currentUser()

  // No Current User
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await db.userTransaction.update({
    where: { id },
    data: {
      soaId
    }
  })

  return { success: 'Transaction SOA ID updated successfully' }
}

export const updateTransaction = async (id: string, values: any) => {
  const user = await currentUser()

  // No Current User
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validation if user is in database (not leftover session)
  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await db.userTransaction.update({
    where: { id },
    data: {
      ...values
    }
  })

  return { success: 'Transaction STATUS updated successfully' }
}

// export const updateTransaction = async (transactionId: string) => {
//   const user = await currentUser();

//   // No Current User
//   if (!user) {
//     return { error: "Unauthorized" };
//   }

//   // Validation if user is in database (not leftover session)
//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" };
//   }

//   await db.userTransaction.update({
//     where: { id: transactionId },
//     data: {
//       status: PaymentStatus.PAID,
//       datePaid: new Date(),
//       paidBy: dbUser.id,
//     },
//   });

//   return { success: "Payment updated successfully" };
// };

// export const overdueTransaction = async (transactionId: string) => {
//   const user = await currentUser();

//   // No Current User
//   if (!user) {
//     return { error: "Unauthorized" };
//   }

//   // Validation if user is in database (not leftover session)
//   const dbUser = await getUserById(user.id);

//   if (!dbUser) {
//     return { error: "Unauthorized" };
//   }

//   await db.userTransaction.update({
//     where: { id: transactionId },
//     data: {
//       status: PaymentStatus.OVERDUE,
//     },
//   });

//   return { success: "Payment updated successfully" };
// };
