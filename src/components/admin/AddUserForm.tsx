import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, User, Mail, Lock, Phone, UserCheck, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '@/store/store';
import { closeAddUserModal } from '@/store/slices/userSlice';
import { adminCreateUser } from '@/utils/apis/userApi';
import { useQueryClient } from '@tanstack/react-query';

interface AddUserFormData {
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone: string;
  phoneTwo: string;
}

const AddUserForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddUserFormData>({
    fullName: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    phoneTwo: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddUserFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddUserFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddUserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await adminCreateUser(formData);
      
      if (response.data.success) {
        toast.success(response.data.message || 'User created successfully!');
        
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        
        dispatch(closeAddUserModal());
        
        setFormData({
          fullName: '',
          email: '',
          password: '',
          role: 'user',
          phone: '',
          phoneTwo: ''
        });
        setErrors({});
      } else {
        toast.error('Failed to create user');
      }
    } catch (error: any) {
      console.error('Create user error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeAddUserModal());
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'user',
      phone: '',
      phoneTwo: ''
    });
    setErrors({});
  };

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
              <h3 className="text-xl font-bold text-black">Add New User</h3>
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

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-black">
              <Lock className="h-4 w-4 text-black" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter password"
              className={`transition-all duration-200 bg-white border-black text-black placeholder-black ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'focus:border-black focus:ring-black'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium text-black">
              <UserCheck className="h-4 w-4 text-black" />
              Role
            </Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
                Creating...
              </div>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;