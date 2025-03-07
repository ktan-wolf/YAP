import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsEmojiSmileFill } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { User } from "../../utils/db/dummy";

interface MutateType {
	text: string;
    img: string | null;
}
function CreatePost() {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<null | string>(null);

  const imgRef = useRef<HTMLInputElement>(null);

  const {data:authUser} : {data: User | undefined} = useQuery({queryKey: ["authUser"]});
  const queryClient = useQueryClient();


  const {mutate: createPost, isPending, isError, error} = useMutation({
	mutationFn: async ({text, img} : MutateType) => {
		try {
			const res = await axios.post('https://yap-backend-p489.onrender.com/api/posts/create',{
				text,
				img
			},{
				headers: {
					"Content-Type": "application/json"
                },
				withCredentials : true,
			});			
			
            return res.data;
		} catch (error) {
			if (axios.isAxiosError(error)){
			throw error;
			} else{
			throw new Error('Server error');
			}
		}
	},
	onSuccess: ()=>{
		toast.success("Post created successfully");
		// refetching
		queryClient.invalidateQueries({queryKey:["posts"]})
		setText("");
		setImg(null);
	},
	onError: ()=>{
        toast.error("Post creation failed");
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    createPost({text, img})
  }

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file: File | undefined = e.target.files?.[0];
    if(file){
      const reader: FileReader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>

      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								{imgRef.current? imgRef.current.value = "": null}
							}}
						/>
            
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
            
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current?.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' 
          accept="image/*"
          hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && !img && !text && <div className='text-red-500'>{axios.isAxiosError(error)? error.response?.data.message: "Server Error"}</div>}
			</form>
    </div>
  )
}

export default CreatePost