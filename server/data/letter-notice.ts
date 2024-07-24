'use server'

import { db } from '@/lib/db'

export const getAllLetters = async () => {
  try {
    const letters = await db.letter.findMany()

    return letters
  } catch {
    return null
  }
}

export const getLetterById = async (id: string) => {
  try {
    const letter = await db.letter.findUnique({
      where: { id }
    })

    return letter
  } catch {
    return null
  }
}

export const getLetterByUserId = async (recipient: string) => {
  try {
    const letter = await db.letter.findMany({
      where: { recipient }
    })

    return letter
  } catch {
    return null
  }
}

export const getAllNotices = async () => {
  try {
    const notices = await db.notice.findMany()

    return notices
  } catch {
    return null
  }
}

export const getNoticeById = async (id: string) => {
  try {
    const notice = await db.notice.findUnique({
      where: { id }
    })

    return notice
  } catch {
    return null
  }
}

export const getLetterByDisputeId = async (idToLink: string) => {
  try {
    const letter = await db.letter.findFirst({
      where: { idToLink }
    })

    return letter
  } catch {
    return null
  }
}

// temporary fix
export const getLetterByViolationId = async (idToLink: string) => {
  try {
    const letter = await db.letter.findFirst({
      where: { idToLink }
    })

    return letter
  } catch {
    return null
  }
}
