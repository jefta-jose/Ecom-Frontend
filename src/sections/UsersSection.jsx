import { useGetUsersQuery } from '@/redux/userSlice';
import AdminCreateUser from '@/ui/AdminCreateUser';
import { useEffect, useState } from 'react'

const UsersSection = () => {
  const [allUsers , setAllUsers] = useState([]);
  const {data: users , isLoading:isFetchingUsers} = useGetUsersQuery();

  const [addUserModal , setAddUserModal] = useState(false);
  const USERS_PER_PAGE = 8; // Define items per page
  const [userPage, setUserPage] = useState(1);

  const paginateUsers = (data, page) => {
    const startIndex = (page - 1) * USERS_PER_PAGE;
    return data.slice(startIndex, startIndex + USERS_PER_PAGE);
  };

  const paginatedUsers = paginateUsers(allUsers, userPage);
  const totalUserPages = Math.ceil(allUsers.length / USERS_PER_PAGE);

  useEffect(()=> {
    const fetchAllUsers = async () => {
        try {
            setAllUsers(users);
        }
        catch (error) {
        console.error("Error fetching data", error);
        }
    };

    if(!isFetchingUsers){
      fetchAllUsers();
    }

  } , [users])
    
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
              
    <div className=" flex items-center gap-x-2">
    <h2 className=" md:text-2xl font-bold text-indigo-600 mb-4">
      {allUsers.filter((user) => user.role !== "admin").length}
    </h2>
    <h2 className=" md:text-2xl font-semibold text-gray-700 mb-4">Registered Users</h2>
    </div>

    <div className=" flex items-center gap-x-2">
    <h2 className=" md:text-2xl font-bold text-indigo-600 mb-4">
      {allUsers.filter((user) => user.role === "admin").length}
    </h2>
    <h2 className=" md:text-2xl font-semibold text-gray-700 mb-4">Admin Users</h2>
    </div>

    <button
    onClick={() => setAddUserModal(true)}
        className="px-4 py-2 my-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
      >
        Add User
      </button>
      {addUserModal && <AdminCreateUser setAddUserModal={setAddUserModal}/>}

      <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-md shadow">
        <caption className="text-lg font-semibold py-2">Users List</caption>
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Avatar</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-gray-800">
                {user.firstName} {user.lastName}
              </td>
              <td className="py-2 px-4 text-gray-800">{user.email}</td>
              <td className="py-2 px-4 text-gray-800">{user.role}</td>
              <td className="py-2 px-4">
                <img
                  src={user.avatar}
                  alt={`${user.firstName}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>



    {/* Pagination Controls */}
    <div className="mt-4 flex justify-between">
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
        disabled={userPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-700 text-sm p-2">Page {userPage} of {totalUserPages}</span>
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setUserPage((prev) => Math.min(prev + 1, totalUserPages))}
        disabled={userPage === totalUserPages}
      >
        Next
      </button>
    </div>
  </div>
  )
}

export default UsersSection