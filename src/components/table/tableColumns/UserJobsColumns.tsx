import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const UserJobsTableColumns: ColumnDef<UserfetchAllJobsResponse>[] = [
  {
    accessorKey: "designation",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Designation" />)
  },
  {
    accessorKey: "vacancy",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Vacancy" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: () => {
      //   const provider = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropDownItemGetProviderDetailPage providerId={provider._id} />
            {!provider.isAdminVerified && (
              <DropDownItemApproveProvider providerId={provider._id} />
            )} */}
            {/* <DropDownItemChangeProviderBlockStatus providerId={provider._id} isBlocked={provider.isBlocked} /> */}
            {/* <DropDownItemChangeProviderTrustTag providerId={provider._id} trustedBySlotflow={provider.trustedBySlotflow} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]