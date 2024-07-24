'use client'

import {
  Flex,
  Box,
  Text,
  Heading,
  Avatar,
  HStack,
  ButtonGroup,
  Button,
  Spacer,
  Spinner
} from '@chakra-ui/react'
import { PiThumbsUpFill } from 'react-icons/pi'
import { formatDistanceToNowStrict } from 'date-fns'
import CommentButton from './_comment/CommentButton'
import { DeleteButton } from '../../actions/delete-post.button'
import { Post } from '@prisma/client'
import {
  createLike,
  deleteLike,
  getLikeCount,
  checkUserLiked
} from '@/server/actions/post'

import React, { useEffect, useState } from 'react'
import { Image, Link } from '@chakra-ui/react'

interface PostProps {
  posts: Post[]
  user: string
  userInfos: UserInfos
}

interface UserInfo {
  lastName: string | null
  firstName: string | null
  position: string | null
}

interface UserInfos {
  [userId: string]: UserInfo | null
}

const DiscussionPost: React.FC<PostProps> = ({ posts, user, userInfos }) => {
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

  const [usersInfo, setUsersInfo] = useState<UserInfos>({})
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>({})
  const [likedByUser, setLikedByUser] = useState<{ [postId: string]: boolean }>(
    {}
  )

  const [processingLike, setProcessingLike] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchUserInfoAndLikes = async () => {
      // const userInfoPromises = posts.map((post) =>
      //   getPersonalInfo(post.userId)
      // );
      const likeCountPromises = posts.map(post => getLikeCount(post.id))
      const likedByUserPromises = posts.map(post =>
        checkUserLiked(user, post.id)
      )

      try {
        // const usersDetails = await Promise.all(userInfoPromises);
        const likesDetails: number[] = await Promise.all(likeCountPromises)
        const likedDetails: boolean[] = await Promise.all(likedByUserPromises)

        // const newUsersInfo: UserInfos = {};
        const newLikeCounts: { [postId: string]: number } = {}
        const newLikedByUser: { [postId: string]: boolean } = {}

        // usersInfo.forEach((user, index) => {
        //   if (user) {
        //     const userId = posts[index].userId;
        //     newUsersInfo[userId] = {
        //       fullname: `${user.firstName} ${userInfo.lastName}`,
        //       position: userInfo.position,
        //     };
        //   }
        // });

        posts.forEach((post, index) => {
          newLikeCounts[post.id] = likesDetails[index]
          newLikedByUser[post.id] = likedDetails[index]
        })

        // setUsersInfo(newUsersInfo);
        setLikeCounts(newLikeCounts)
        setLikedByUser(newLikedByUser)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchUserInfoAndLikes()
  }, [posts, user])

  const handleLike = async (postId: string) => {
    // Prevent further actions if already processing
    if (processingLike.has(postId)) {
      return
    }

    // Mark this postId as being processed
    setProcessingLike(prev => new Set(prev).add(postId))

    const currentlyLiked = likedByUser[postId]

    try {
      if (currentlyLiked) {
        // User already liked this post, so delete the like
        await deleteLike(user, postId)
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] - 1 }))
        setLikedByUser(prev => ({ ...prev, [postId]: false }))
      } else {
        // User hasn't liked this post yet, so create the like
        await createLike(user, postId)
        setLikeCounts(prev => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1
        }))
        setLikedByUser(prev => ({ ...prev, [postId]: true }))
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
      // Optionally, show an error message to the user
    } finally {
      // Once processing is done, remove this postId from the processing set
      setProcessingLike(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const isPdf = (url: string) => {
    return url.toLowerCase().endsWith('.pdf')
  }

  return (
    <>
      {posts.map(post => (
        <Flex p='10px' key={post.id}>
          <Box
            w='100%'
            h='100%'
            p='20px'
            border='1px'
            borderColor='gray.200'
            borderRadius='10px'
            mb='1%'
          >
            <HStack>
              <Heading size='sm' fontFamily='font.heading' mb='1%'>
                {post.title}
              </Heading>
              <Spacer />
              {/* Delete Button */}
              {post.userId === user && (
                <DeleteButton postId={post.id} postTitle={post.title} />
              )}
            </HStack>

            {/* Post Categories */}
            <HStack mb='2%'>
              <Box
                bg={categoryColors[post.category]}
                fontFamily='font.heading'
                fontSize='xs'
                fontWeight='semibold'
                w='wrap'
                p='3px'
                pr='8px'
                pl='8px'
                textAlign='center'
                rounded='md'
              >
                {post.category}
              </Box>
            </HStack>

            {/* Discussion Post Details */}

            <Flex gap='0.5rem'>
              <Avatar /> {/*default size is medium*/}
              <Box>
                {userInfos[post.userId] ? (
                  <Text
                    id='name'
                    fontSize='sm'
                    fontWeight='bold'
                    fontFamily='font.body'
                  >
                    {userInfos[post.userId]?.firstName}{' '}
                    {userInfos[post.userId]?.lastName}
                  </Text>
                ) : (
                  <>
                    <span className='text-gray-400 text-xs'>
                      Please wait...{'  '}
                    </span>
                    <Spinner size='xs' thickness='1px' />
                    <br />
                  </>
                )}

                {userInfos[post.userId]?.position ? (
                  <Text
                    id='position'
                    fontSize='sm'
                    fontWeight='bold'
                    fontFamily='font.body'
                  >
                    {userInfos[post.userId]?.position}
                  </Text>
                ) : (
                  <>
                    <span className='text-gray-400 text-xs'>
                      Please wait...{'  '}
                    </span>
                    <Spinner size='xs' thickness='1px' />
                    <br />
                  </>
                )}

                <Text
                  id='description'
                  fontSize='sm'
                  py='10px'
                  fontFamily='font.body'
                  textAlign='justify'
                >
                  {post.description}
                </Text>

                {/*show media here */}
                {/* Media Display */}
                {post.mediaLink && (
                  <Box>
                    {isPdf(post.mediaLink) ? (
                      <Link
                        href={post.mediaLink}
                        isExternal
                        color='blue.500'
                        fontFamily='font.body'
                        fontSize='sm'
                      >
                        View PDF
                      </Link>
                    ) : (
                      <Image
                        src={post.mediaLink}
                        alt='Post media'
                        boxSize='300px'
                        objectFit='cover'
                        borderRadius='md'
                      />
                    )}
                  </Box>
                )}

                {/* Date distance */}
                <Text fontFamily='font.body' color='grey' fontSize='xs' mt={3}>
                  Posted {formatDistanceToNowStrict(new Date(post.createdAt))}{' '}
                  ago
                </Text>
                {/* Discussion Post Actions */}
                <ButtonGroup size='xs' mt='1rem'>
                  <Button
                    colorScheme='yellow'
                    variant={likedByUser[post.id] ? 'solid' : 'outline'}
                    gap='5px'
                    onClick={() => handleLike(post.id)} // Pass the post.id to handleLike
                  >
                    <PiThumbsUpFill /> Like ({likeCounts[post.id] || 0})
                  </Button>
                  <CommentButton
                    post={post.id}
                    postTitle={post.title}
                    postCategory={post.category}
                    user={user}
                  />
                </ButtonGroup>
              </Box>
            </Flex>
          </Box>
        </Flex>
      ))}
    </>
  )
}
export default DiscussionPost
