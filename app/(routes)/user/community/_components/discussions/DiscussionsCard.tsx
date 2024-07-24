'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input, Flex, Spacer, HStack } from '@chakra-ui/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import React from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useState } from 'react'

import DiscussionPost from './_components/DiscussionPost'
import CreateDiscussionPostButton from './_components/CreateDiscussionPostButton'
import { getPosts } from '@/server/data/posts'
import { Post, User } from '@prisma/client'
import { getPersonalInfo } from '@/server/data/user-info'
import { useEffect } from 'react'

interface PostProps {
  posts: Post[]
  user: string
  // userInfos: UserInfos
}

interface UserInfo {
  lastName: string | null
  firstName: string | null
  position: string | null
}

interface UserInfos {
  [userId: string]: UserInfo | null
}

export default function DiscussionsCard ({ posts, user }: PostProps) {
  const [selectedCategory, setSelectedCategory] = useState('showAll')
  const [searchInput, setSearchInput] = useState('')

  const sortedPosts = React.useMemo(
    () =>
      [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [posts]
  )

  const filteredPosts = sortedPosts
    .filter(
      post =>
        selectedCategory === 'showAll' || post.category === selectedCategory
    )
    .filter(post =>
      post.title.toLowerCase().includes(searchInput.toLowerCase())
    )

  const [usersInfo, setUsersInfo] = useState<UserInfos>({})

  useEffect(() => {
    const fetchUserInfos = async () => {
      // Extract unique userIds from polls to avoid redundant fetches
      const uniqueUserIds = Array.from(new Set(posts.map(post => post.userId)))

      // Fetch user info for each unique userId
      const userInfoPromises = uniqueUserIds.map(async userId => {
        const userInfo = await getPersonalInfo(userId)
        return { userId, userInfo }
      })

      // Resolve all promises and update state
      const userInfosArray = await Promise.all(userInfoPromises)
      const userInfosObj = userInfosArray.reduce<UserInfos>(
        (acc, { userId, userInfo }) => {
          acc[userId] = userInfo
          return acc
        },
        {}
      )

      setUsersInfo(userInfosObj)
    }

    fetchUserInfos()
  }, [posts])

  return (
    <>
      <Card className='w-[57.8vw] h-[68vh]'>
        <Flex justifyContent='space-between'>
          <CardHeader>
            <CardTitle className='font-bold'>Discussions</CardTitle>
            <CardDescription>
              Create, view, and participate in discussions of Homeowners.
            </CardDescription>
          </CardHeader>
          <HStack p='20px'>
            {/* Create Discussion Post Button*/}
            <CreateDiscussionPostButton />
          </HStack>
        </Flex>
        <CardContent className='space-y-2'>
          <Flex justifyContent='space-between' mb='1%'>
            <Input
              size='md'
              w='350px'
              type='string'
              placeholder='Search by Discussion Title'
              borderRadius={5}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <Spacer />
            {/* Select category to show */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Show All Categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='showAll' className='font-semibold'>
                    Show All Categories
                  </SelectItem>
                  <SelectItem value='MEETING'>Meeting</SelectItem>
                  <SelectItem value='ELECTION'>Election</SelectItem>
                  <SelectItem value='INQUIRY'>Inquiry</SelectItem>
                  <SelectItem value='EVENT'>Event</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Flex>

          {/* Wrap the PollPosts and SurveyPosts inside ScrollArea */}
          <ScrollArea
            style={{ maxHeight: 'calc(70vh - 180px)', overflowY: 'auto' }}
          >
            <DiscussionPost
              posts={filteredPosts}
              user={user}
              userInfos={usersInfo}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
