import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Mail, Phone, UserCheck, Loader, Shield, ShieldOff } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/store/store';
import { closeEditUserModal } from '@/store/slices/userSlice';
import { adminUpdateUser, adminFetchUserById } from '@/utils/apis/userApi';
import { useQueryClient } from '@tanstack/react-query';

interface EditUserFormData {
  fullName: string;
  email: string;
  phone: string;
  phoneTwo: string;
  isBlocked: boolean;
  isVerified: boolean;
}

const EditUserForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedUserId } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [formData, setFormData] = useState<EditUserFormData>({
    fullName: '',
    email: '',
    phone: '',
    phoneTwo: '',
    isBlocked: false,
    isVerified: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EditUserFormData, string>>>({});

  useEffect(() => {
    if (selectedUserId) {
      fetchUserData();
    }
  }, [selectedUserId]);

  const fetchUserData = async () => {
    if (!selectedUserId) return;
    
    setLoadingUser(true);
    try {
      const response = await adminFetchUserById(selectedUserId);
      if (response.data.success) {
        const user = response.data.user;
        setFormData({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          phoneTwo: user.phoneTwo || '',
          isBlocked: user.isBlocked,
          isVerified: user.isVerified
        });
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoadingUser(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EditUserFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EditUserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedUserId) return;

    setLoading(true);

    try {
      const response = await adminUpdateUser(selectedUserId, formData);
      
      if (response.data.success) {
        toast.success(response.data.message || 'User updated successfully!');
        
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        
        dispatch(closeEditUserModal());
      } else {
        toast.error('Failed to update user');
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeEditUserModal());
    setErrors({});
  };

  if (!selectedUserId) {
    return null;
  }

  if (loadingUser) {
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black">
                <UserCheck className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Edit User</h3>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-black">
              <User className="h-4 w-4 text-black" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
              className={`transition-all duration-200 bg-white border-black text-black placeholder-black ${
                errors.fullName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'focus:border-black focus:ring-black'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-black">
              <Mail className="h-4 w-4 text-black" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`transition-all duration-200 bg-white border-black text-black placeholder-black ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'focus:border-black focus:ring-black'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-black">
              <Phone className="h-4 w-4 text-black" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              className="transition-all duration-200 bg-white border-black text-black placeholder-black focus:border-black focus:ring-black"
            />
          </div>

          {/* Phone Two */}
          <div className="space-y-2">
            <Label htmlFor="phoneTwo" className="flex items-center gap-2 text-sm font-medium text-black">
              <Phone className="h-4 w-4 text-black" />
              Secondary Phone (Optional)
            </Label>
            <Input
              id="phoneTwo"
              type="tel"
              value={formData.phoneTwo}
              onChange={(e) => handleInputChange('phoneTwo', e.target.value)}
              placeholder="Enter secondary phone number"
              className="transition-all duration-200 bg-white border-black text-black placeholder-black focus:border-black focus:ring-black"
            />
          </div>

          {/* Status Controls */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-black" />
                <span className="text-black font-medium">Verified Status</span>
              </div>
              <Button
                type="button"
                onClick={() => handleInputChange('isVerified', !formData.isVerified)}
                variant="outline"
                size="sm"
                className={`${
                  formData.isVerified 
                    ? 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 border-red-500 text-red-700 hover:bg-red-200'
                }`}
              >
                {formData.isVerified ? 'Verified' : 'Unverified'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
              <div className="flex items-center gap-2">
                <ShieldOff className="h-4 w-4 text-black" />
                <span className="text-black font-medium">Account Status</span>
              </div>
              <Button
                type="button"
                onClick={() => handleInputChange('isBlocked', !formData.isBlocked)}
                variant="outline"
                size="sm"
                className={`${
                  formData.isBlocked 
                    ? 'bg-red-100 border-red-500 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                }`}
              >
                {formData.isBlocked ? 'Blocked' : 'Active'}
              </Button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-black flex gap-3">
          <Button 
            type="button"
            onClick={handleClose}
            variant="outline"
            className="flex-1 hover:bg-white transition-colors border-black text-black hover:text-black"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            ) : (
              'Update User'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;