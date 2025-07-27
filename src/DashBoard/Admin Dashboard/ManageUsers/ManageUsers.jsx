import { useQuery } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../UrlInstance/UseURlSecure';
import { AuthContext } from '../../../Context/AuthContext';

const USERS_PER_PAGE = 7;

const ManageUsers = () => {
  const axiosSecure = UseAxiosSecure();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toggleDarkMode } = useContext(AuthContext);

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}`);
      return res.data;
    }
  });

  const handleMakeAdmin = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Make this user an admin?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (confirm.isConfirmed) {
      const res = await axiosSecure.patch(`/users/admin/${id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire('Success!', 'User is now admin.', 'success');
        refetch();
      }
    }
  };

  // Pagination logic
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  return (
    <div className={`sha p-6 min-h-screen transition-all duration-300 rounded-2xl border border-gray-100 ${toggleDarkMode
      ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900 text-white border-gray-700'
      : 'bg-gradient-to-b from-green-100 via-blue-100 to-red-100 text-black border-gray-300'
      }`}>
      <h2 className="text-2xl font-semibold mb-6">👥 Manage Users</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to page 1 on new search
        }}
        className={`input input-bordered w-full max-w-xs mb-6 ${toggleDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
      />

      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-xl rounded-xl">
            <table className={`table w-full ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <thead className={`${toggleDarkMode ? 'text-white bg-gray-900' : 'bg-gray-200'} text-sm`}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Make Admin</th>
                  <th>Membership</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover">
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-ghost'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="btn btn-sm btn-outline btn-accent"
                        >
                          Make Admin
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Already Admin</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${user.membership ? 'badge-info' : 'badge-warning'}`}>
                        {user.membership ? 'Member' : 'Free'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Buttons */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
