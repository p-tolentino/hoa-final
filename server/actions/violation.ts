'use server'

import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { getUserById } from '@/server/data/user'
import { ReportStatus } from '@prisma/client'

export const createViolation = async (values: any) => {
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

  const result = await db.violation.create({
    data: {
      ...values,
      submittedBy: dbUser.id
    }
  })

  return { success: 'Submitted report successfully', violation: { ...result } }
}

export const updateViolation = async (id: string, values: any) => {
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

  await db.violation.update({
    where: { id },
    data: {
      ...values
    }
  })

  return { success: 'Violation report updated successfully' }
}

export const updateOfficerAssigned = async (
  id: string,
  officerAssigned: string
) => {
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

  await db.violation.update({
    where: { id },
    data: {
      officerAssigned,
      status: ReportStatus.PENDING_LETTER_TO_BE_SENT,
      step: 2,
      progress: 'Step 2: Review by Security Committee'
    }
  })

  return {
    success: 'Officer assigned successfully, violation now under review'
  }
}

export const updateLetterSent = async (id: string, letterSent: boolean) => {
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

  await db.violation.update({
    where: { id },
    data: {
      letterSent
    }
  })

  return {
    success: 'Letter/notice sent successfully to persons involved.'
  }
}

export const updateStatus = async (id: string, status: ReportStatus) => {
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

  await db.violation.update({
    where: { id },
    data: {
      status
    }
  })

  return {
    success: 'Officer assigned successfully, violation now under review'
  }
}

export const updateClosed = async (id: string) => {
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

  await db.violation.update({
    where: { id },
    data: {
      step: 3,
      progress: 'Step 3: Issue Resolution and Enforcement with Penalty Fee',
      status: ReportStatus.CLOSED
    }
  })

  return {
    success: 'Report marked closed.'
  }
}

export const createOfficerTasks = async (values: any) => {
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

  await db.violationOfficerActivity.createMany({
    data: {
      ...values
    }
  })

  return {
    success: 'Tasks successfully created.'
  }
}

export const createViolationProgressReport = async (values: any) => {
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

  await db.violationProgress.createMany({
    data: {
      ...values
    }
  })

  return {
    success: 'Progress report for violation successfully created.'
  }
}

export const updateViolationOfficerTask = async (
  id: string,
  isDone: boolean
) => {
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

  await db.violationOfficerActivity.update({
    where: { id },
    data: {
      isDone,
      dateCompleted: new Date()
    }
  })

  return {
    success: 'Officer activity marked done.'
  }
}
