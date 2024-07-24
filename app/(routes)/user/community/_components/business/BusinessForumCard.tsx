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

import BusinessPosts from './_components/BusinessPost'
import CreateBusinessPostButton from './_components/CreateBusinessPostButton'
import { getPosts } from '@/server/data/posts'
import { Post, User } from '@prisma/client'

interface PostProps {
  posts: Post[]
  user: string
}

export default function BusinessForumCard ({ posts, user }: PostProps) {
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

  return (
    <>
      <Card className='w-[57.8vw] h-[68vh]'>
        <Flex justifyContent='space-between'>
          <CardHeader>
            <CardTitle className='font-bold'>Business Forum</CardTitle>
            <CardDescription>
              Promote your business and view the businesses of Homeowners.
            </CardDescription>
          </CardHeader>
          <HStack p='20px'>
            {/* Create BusinessPost Button*/}
            <CreateBusinessPostButton />
          </HStack>
        </Flex>
        <CardContent className='space-y-2'>
          <Flex justifyContent='space-between' mb='1%'>
            <Input
              size='md'
              w='350px'
              type='string'
              placeholder='Search by Business Title'
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
                  <SelectItem value='FOODANDDRINK'>Food and Drink</SelectItem>
                  <SelectItem value='CLOTHING'>Clothing</SelectItem>
                  <SelectItem value='HOUSEHOLDITEMS'>
                    Household Items
                  </SelectItem>
                  <SelectItem value='HOMESERVICES'>HomeServices</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Flex>

          {/* Wrap the PollPosts and SurveyPosts inside ScrollArea */}
          <ScrollArea
            style={{ maxHeight: 'calc(70vh - 180px)', overflowY: 'auto' }}
          >
            <BusinessPosts posts={filteredPosts} user={user} />
            {/* Like and Dislike buttons in all posts reflect the same action since a map function is used to reflect a post for each nature of business  */}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
