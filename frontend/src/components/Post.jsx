import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Book, Bookmark, MessageCircle, MoreHorizontal, Send, Share } from 'lucide-react/dist/cjs/lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from './ui/button'
import { FaHeart , FaRegHeart} from 'react-icons/fa';

export default function Post() {
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src=""
              alt="post_image"
              className="w-full h-full object-cover rounded-full"
            />
            <AvatarFallback className="w-full h-full object-cover rounded-full">
              CN
            </AvatarFallback>
          </Avatar>
          <h1>usename</h1>
        </div>
        <div>
          <Dialog className="bg-white">
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer " />
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center text-sm bg-white ">
              <Button
                variant="outline"
                className="border-black text-[#ED4956] hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Unfollow
              </Button>

              <Button variant="ghost" className="cursor-pointer w-fit ">
                Report
              </Button>
              <Button variant="ghost" className="cursor-pointer w-fit ">
                Delete
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <img
        src=" https://cdn.pixabay.com/photo/2024/02/29/19/58/winter-8605108_1280.jpg"
        alt="post_image "
        className="w-full h-full object-cover rounded-sm mt-4 aspect-square"
      />
      
         <div className="flex items-center justify-between my-2">
          <div className='flex items-center gap-3'>
            <FaRegHeart size={'22px'} className='cursor-pointer hove:text-grey-600' />
            <MessageCircle size={'22px'} className='cursor-pointer hove:text-grey-600' />
            <Send size={'22px'} className='cursor-pointer hove:text-grey-600' />
          </div>
          <Bookmark size={'22px'} className='cursor-pointer hove:text-grey-600' />
         </div> 
         <span className='font-medium mb-2'>12 likes</span>
    </div>
  );
}
