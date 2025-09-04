import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { X, User, Copy,CheckCircle,UserCheck,Loader} from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/store/store';
import { closeUserDetailsModal } from '@/store/slices/userSlice';
import { adminFetchUserById } from '@/utils/apis/userApi';
import type { User as UserType } from '@/types/entities/user';

const UserDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUserId } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserData();
    }
  }, [selectedUserId]);

  const fetchUserData = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    try {
      const response = await adminFetchUserById(selectedUserId);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUserId = async () => {
    if (!user) return;
    
    try {
      await navigator.clipboard.writeText(user._id.toString());
      setCopied(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy User ID');
    }
  };

  const handleClose = () => {
    dispatch(closeUserDetailsModal());
  };

  if (!selectedUserId) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-black">
          <div className="flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-black" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-black">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-black">
              <UserCheck className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">User Not Found</h2>
            <p className="text-black mb-6">The user you're looking for doesn't exist.</p>
            <Button onClick={handleClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black">
                <UserCheck className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">User Details</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-white transition-colors text-black hover:text-black"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto bg-white">
          <div className="p-6 space-y-4">
            {/* User Profile */}
            <div className="text-center pb-4 border-b border-black">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 border border-black">
                <User className="h-10 w-10 text-black" />
              </div>
              <h2 className="text-xl font-bold text-black">{user.fullName}</h2>
              <p className="text-black text-sm">#{user.serialNumber}</p>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                <span className="text-black text-sm font-medium">Email</span>
                <span className="text-black text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                <span className="text-black text-sm font-medium">Role</span>
                <span className="text-black text-sm font-medium">{user.role}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                <span className="text-black text-sm font-medium">Status</span>
                <span className="text-black text-sm font-medium">
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                <span className="text-black text-sm font-medium">Verified</span>
                <span className="text-black text-sm font-medium">
                  {user.isVerified ? 'Yes' : 'No'}
                </span>
              </div>

              {user.phone && (
                <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                  <span className="text-black text-sm font-medium">Phone</span>
                  <span className="text-black text-sm">{user.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
                <span className="text-black text-sm font-medium">User ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-black font-mono text-xs">{user._id.toString().slice(-8)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUserId}
                    className="h-6 w-6 p-0 hover:bg-white"
                    title="Copy full User ID"
                  >
                    {copied ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-black" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;