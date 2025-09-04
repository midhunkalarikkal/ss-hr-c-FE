
export interface User {
  _id: string;
  serialNumber : string;
  fullName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isBlocked: boolean;
  profileImage: string;
  verificationToken: string;
  otp: string;
  phone: string;
  phoneTwo: string;
  googleId: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = 'user' | 'admin' | 'superAdmin' | "systemAdmin";
