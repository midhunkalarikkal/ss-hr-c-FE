import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllUsers } from '@/utils/apis/userApi';
import { UserTableColumns } from '@/components/table/tableColumns/UserTableColums';
import { openAddUserModal } from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AddUserForm from '@/components/admin/AddUserForm';
import EditUserForm from '@/components/admin/EditUserForm';
import UserDetails from '@/components/admin/UserDetails';
import type { User } from '@/types/entities/user';
import type { RootState } from '@/store/store';

const AdminUsers: React.FC = () => {
  const dispatch = useDispatch();
  const { isAddUserModalOpen, isEditUserModalOpen, isUserDetailsModalOpen } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="p-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage application users and their permissions</p>
          </div>
          <Button
            onClick={() => dispatch(openAddUserModal())}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Table - Change UserResponse to User */}
        <CommonTable<User>
          fetchApiFunction={adminFetchAllUsers}
          queryKey="admin-users"
          heading=""
          description=""
          column={UserTableColumns}
          columnsCount={6}
          showDummyData={false}
        />
      </div>

      {/* Modals */}
      {isAddUserModalOpen && <AddUserForm />}
      {isEditUserModalOpen && <EditUserForm />}
      {isUserDetailsModalOpen && <UserDetails />}
    </div>
  );
};

export default AdminUsers;