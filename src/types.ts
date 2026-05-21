export interface Vendor {
  id: string;
  stallName: string;
  ownerName: string;
  phone: string;
  category: string;
  onboardingStatus: 'Pending' | 'Approved' | 'Rejected' | 'Needs Docs' | 'Under Review' | 'Inspection Required';
  riskLevel: 'Low' | 'Medium' | 'High';
  location: string;
  zoneId: string;
  nearbyFoodStreet: string;
  documents: {
    license: string;
    idProof: string;
    gst?: string;
  };
  photos: {
    kitchen: string;
    counter: string;
    foodPrep: string;
  };
  hygieneScore: number;
  hiddenGemScore: number;
  isTrustedBadge?: boolean;
  subscriptionPlan: 'Free' | 'Starter' | 'Growth' | 'Premium';
  status: 'Active' | 'Suspended' | 'Pending' | 'Normal' | 'Warning' | 'Inspection Scheduled' | 'Trusted';
  ordersCount: number;
  createdDate: string;
  aiFlags: string[];
}

export interface Order {
  id: string;
  vendorName: string;
  customerName: string;
  amount: number;
  status: 'Processing' | 'Completed' | 'Cancelled' | 'Delayed';
  type: 'Pickup' | 'Delivery';
  timestamp: string;
  prepTimeMinutes: number;
}

export interface Zone {
  id: string;
  name: string;
  activeVendorsCount: number;
  hiddenGemsCount: number;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Overloaded';
  trafficIntensity: 'Clear' | 'Busy' | 'Heavy' | 'Gridlock';
  category: 'Night Food Street' | 'Temple Zone' | 'Tourist Zone' | 'SaaS Hub' | 'Residential';
  status: 'Active' | 'Disabled';
  coordinates: { x: number; y: number };
}

export interface Inspector {
  id: string;
  name: string;
  assignedVendors: string[];
  completedVisits: number;
  pendingInspections: number;
  currentZone: string;
  avatar: string;
}

export interface Complaint {
  id: string;
  targetName: string; // user or vendor
  issueType: 'Hygiene' | 'Payment' | 'Customer Conduct' | 'Vendor Delay' | 'Quality';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  status: 'Open' | 'Pending' | 'Resolved';
  description: string;
  createdDate: string;
}

export interface SubscriptionStats {
  plan: 'Free' | 'Starter' | 'Growth' | 'Premium';
  vendorName: string;
  amount: number;
  renewalDate: string;
  activeSince: string;
  autoRenew: boolean;
}

export interface AIAlert {
  id: string;
  type: 'Spam Detection' | 'Fake Reviews' | 'Abnormal Traffic' | 'Suspicious Activity';
  severity: 'Info' | 'Warning' | 'High Risk';
  target: string;
  details: string;
  timestamp: string;
  resolved: boolean;
}

export interface HygieneReport {
  vendorId: string;
  vendorName: string;
  aiPhotoScore: number;
  customerFeedbackScore: number;
  inspectorReviewScore: number;
  foodSafetyStatus: 'Pass' | 'Fail' | 'Under Investigation';
  lastInspectionDate: string;
}

export interface ContentPost {
  id: string;
  vendorName: string;
  videoPlaceholderText: string;
  foodPhotoUrl: string;
  caption: string;
  views: number;
  likes: number;
  reportCount: number;
  aiFlags: string[];
  status: 'Approved' | 'Flagged' | 'Removed';
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  audience: 'All Vendors' | 'Specific Zone' | 'Low Hygiene' | 'Premium Only';
  type: 'Hygiene Alert' | 'Festival Notice' | 'System Maintenance' | 'Promotion';
  scheduleTime: string;
  sentStatus: 'Sent' | 'Scheduled';
}

export interface AdminUser {
  email: string;
  role: 'Super Admin' | 'City Admin' | 'Inspection Manager' | 'Moderation Team' | 'Support Team';
  name: string;
}

export type SidebarTab =
  | 'dashboard'
  | 'vendors'
  | 'approval'
  | 'orders'
  | 'content'
  | 'hygiene'
  | 'inspectors'
  | 'zones'
  | 'temple'
  | 'tourist'
  | 'ai'
  | 'analytics'
  | 'subscription'
  | 'notifications'
  | 'complaints'
  | 'reports'
  | 'roles'
  | 'settings';
