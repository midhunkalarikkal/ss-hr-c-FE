export interface UserSliceState {
  isAddUserModalOpen: boolean;
  isEditUserModalOpen: boolean;
  isUserDetailsModalOpen: boolean;
  selectedUserId: string | null;
}