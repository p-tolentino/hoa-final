'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Stack,
  Text,
  Box,
  Divider,
  Button,
  Avatar,
  HStack,
  Textarea,
  ButtonGroup,
  Badge
} from '@chakra-ui/react'
import { PiThumbsUpFill } from 'react-icons/pi'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { useState, useEffect, FormEvent } from 'react'

import { Comment, PersonalInfo } from '@prisma/client'
import { getPersonalInfo } from '@/server/data/user-info'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createComment, getComments } from '@/server/actions/post'

interface CommentProps {
  post: string
  postTitle: string
  postCategory: string
  user: string
}

interface CombinedComment {
  id: string
  text: string
  createdAt: Date
  user: PersonalInfo | null // Combine the comment with user's personal info
}

const categoryColors = {
  MEETING: 'purple.200',
  ELECTION: 'pink.200',
  INQUIRY: 'blue.200',
  EVENT: 'orange.200',
  FOODANDDRINK: 'purple.200',
  CLOTHING: 'pink.200',
  HOUSEHOLDITEMS: 'blue.200',
  HOMESERVICES: 'orange.200',
  OTHER: 'teal.200'
}

const CommentButton: React.FC<CommentProps> = ({
  post,
  postTitle,
  postCategory,
  user
}) => {
  const router = useRouter()
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [combinedComments, setCombinedComments] = useState<CombinedComment[]>(
    []
  )

  useEffect(() => {
    const fetchCommentsAndUsers = async () => {
      const comments: Comment[] = await getComments(post)
      const commentsWithUserInfoPromises = comments.map(async comment => {
        const userInfo = await getPersonalInfo(comment.userId)
        return { ...comment, user: userInfo } // Combine the comment with the fetched user info
      })
      const combinedComments = await Promise.all(commentsWithUserInfoPromises)
      setCombinedComments(combinedComments)
    }

    fetchCommentsAndUsers()
  }, [post])
  console.log('the compilation of comments:', comments)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault() // Prevent the form from submitting in the traditional way
    try {
      await createComment(post, commentText) // Assume createComment is an async operation
      setCommentText('') // Clear the comment text area
      // Fetch comments again to include the new comment
      const fetchCommentsAndUsers = async () => {
        const fetchedComments: Comment[] = await getComments(post)
        const commentsWithUserInfo = await Promise.all(
          fetchedComments.map(async comment => {
            const userInfo = await getPersonalInfo(comment.userId)
            return { ...comment, user: userInfo } // Combine the comment with fetched user info
          })
        )
        setCombinedComments(commentsWithUserInfo)
      }
      fetchCommentsAndUsers()
    } catch (error) {
      console.error('Failed to create comment:', error)
      // Handle error state here, if needed
    }
  }

  //const dateDistance = formatDistanceToNowStrict(datePosted);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='xs' colorScheme='yellow' variant='outline'>
          Comment
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[500px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            <>
              <Badge
                bg={categoryColors[postCategory as keyof typeof categoryColors]}
                fontFamily='font.heading'
                fontSize='xs'
                fontWeight='semibold'
                p='3px'
                pr='8px'
                pl='8px'
                mb={1}
                textAlign='center'
                rounded='md'
              >
                {postCategory}
              </Badge>
              <br />
              {postTitle}
            </>
          </DialogTitle>
          <DialogDescription>
            Add a comment to this board discussion post.
          </DialogDescription>
        </DialogHeader>

        {/* Example comment list (Replace with actual comments from your application's data) */}
        {combinedComments.length !== 0 ? (
          <>
            <Box p='10px' maxH='150px' overflowY='auto'>
              {combinedComments.map(combinedComment => (
                <Box
                  key={combinedComment.id}
                  border='1px'
                  borderColor='gray.200'
                  borderRadius='10px'
                  p='10px'
                  mb='1%'
                >
                  <HStack>
                    <Avatar />{' '}
                    {/* Ideally, you would fetch and display the user's avatar based on combinedComment.user data */}
                    <Stack spacing='0.5px'>
                      {/* Display user's name if available, otherwise show a placeholder */}
                      <Text
                        fontSize='sm'
                        fontWeight='bold'
                        fontFamily='font.body'
                      >
                        {combinedComment.user
                          ? `${combinedComment.user.firstName} ${combinedComment.user.lastName}`
                          : 'Unknown User'}
                      </Text>
                      {/* Display user's position if available, otherwise show a placeholder */}
                      <Text
                        fontSize='sm'
                        fontWeight='bold'
                        fontFamily='font.body'
                      >
                        {combinedComment.user
                          ? combinedComment.user.position
                          : 'Unknown Position'}
                      </Text>
                    </Stack>
                  </HStack>
                  {/* Display the comment content */}
                  <Text ml='7.5%' fontSize='sm' p='5px' fontFamily='font.body'>
                    {combinedComment.text}
                  </Text>
                  {/* Format and display the comment's posting date */}
                  <Text
                    ml='8%'
                    color='grey'
                    fontSize='xs'
                    fontFamily='font.body'
                  >
                    Posted{' '}
                    {formatDistanceToNowStrict(
                      new Date(combinedComment.createdAt)
                    )}{' '}
                    ago
                  </Text>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <div className='text-center text-sm text-gray-300'>
            There are no comments in this post yet.
          </div>
        )}

        <Divider />

        {/* Comment submission form */}
        <form onSubmit={onSubmit}>
          <Box border='1px' borderColor='gray.200' borderRadius='10px' p='10px'>
            <Textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder='Write something...'
              resize='none'
              fontSize='sm'
              fontFamily='font.body'
            />
          </Box>
          <DialogFooter className='align-right'>
            <Button
              w='min-content'
              size='sm'
              colorScheme='yellow'
              type='submit'
              mt='2%'
            >
              Comment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CommentButton
