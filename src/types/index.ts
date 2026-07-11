export interface User {
  id: string;
  name: string;
  email: string;
  role: 'supporter' | 'creator' | 'admin';
  credits: number;
  image?: string;
}

export interface CreatorDetails {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  image: string;
  creatorId: CreatorDetails;
  status: 'pending' | 'active' | 'rejected' | 'completed';
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  _id: string;
  campaignId: Campaign;
  supporterId: User;
  amount: number;
  createdAt: string;
}

export interface Withdrawal {
  _id: string;
  creatorId: User;
  campaignId: Campaign;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  _id: string;
  reporterId: User;
  campaignId: Campaign;
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
