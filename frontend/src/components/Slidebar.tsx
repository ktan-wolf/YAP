import { Link } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User as DataType } from "../utils/db/dummy";
import axios, { isAxiosError } from "axios";
import logo from "../assets/logo.jpg"

function Slidebar() {
	const queryClient = useQueryClient()
	const {mutate: logoutMutate} = useMutation({
		mutationFn : async () =>{
			try {
				await axios.post("https://yap-backend-p489.onrender.com/api/auth/logout" , {} , {
					withCredentials : true,
				})
			} catch (error) {
		console.log(error);
				const errorMsg = isAxiosError(error) ? error.response?.data?.message : "Something went wrong";
				toast.error(errorMsg);
			}
		},
		onSuccess: ()=>{
			toast.success("Logout Successfully");
			//Fetching again
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
	});
	let value = false;
	const { data: { username, fullname, profileImg } = {} }: { data?: Partial<DataType> } = useQuery({ queryKey: ["authUser"] });
	if(username) value = true;

  return (
    <div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<img src={logo} className='px-2 h-14 mt-2 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{value && (
					<Link
						to={`/profile/${username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{fullname}</p>
								<p className='text-slate-500 text-sm'>@{username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer' 
							onClick={(e) => {
								e.preventDefault();
								logoutMutate();
							}}
							/>

						</div>
					</Link>
				)}
			</div>
		</div>
  )
}

export default Slidebar