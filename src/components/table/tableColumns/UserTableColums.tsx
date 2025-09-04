import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../types/entities/user";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Button } from "../../ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { openUserDetailsModal, openEditUserModal } from "../../../store/slices/userSlice";
import { adminDeleteUser } from "../../../utils/apis/userApi";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export const UserTableColumns: ColumnDef<User>[] = [
{
  accessorKey: "serialNumber",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Serial No." />,
  cell: ({ row }) => {
    const serialNumber = row.getValue("serialNumber") as string;
    return <div className="font-medium">{serialNumber || row.original.serialNumber || 'N/A'}</div>;
  },
},

  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "isVerified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified");
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isVerified ? 'Yes' : 'No'}
        </span>
      );
    },
  },
  {
    accessorKey: "isBlocked",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked");
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {isBlocked ? 'Blocked' : 'Active'}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const queryClient = useQueryClient();
      const user = row.original;

      const handleDelete = async () => {
        toast.warn(
          <div>
      
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{user.fullName}"?
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.dismiss()}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  toast.dismiss();
                  try {
                    const response = await adminDeleteUser(user._id.toString());
                    if (response.data.success) {
                      toast.success('User deleted successfully');
                      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
                    }
                  } catch (error) {
                    toast.error('Failed to delete user');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                Delete
              </Button>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            closeButton: false,
          }
        );
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(openUserDetailsModal(user._id.toString()))}
            className="text-gray-400 hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(openEditUserModal(user._id.toString()))}
            className="text-gray-400 hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];