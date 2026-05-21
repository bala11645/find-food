import { Vendor, Order, Zone, Inspector, Complaint, SubscriptionStats, AIAlert, HygieneReport, ContentPost, AdminNotification } from './types';

export const initialZones: Zone[] = [
  {
    id: 'z-vvpuram',
    name: 'VV Puram Food Street',
    activeVendorsCount: 42,
    hiddenGemsCount: 8,
    crowdLevel: 'Overloaded',
    trafficIntensity: 'Gridlock',
    category: 'Night Food Street',
    status: 'Active',
    coordinates: { x: 35, y: 70 }
  },
  {
    id: 'z-koramangala',
    name: 'Koramangala Tech & Food Zone',
    activeVendorsCount: 56,
    hiddenGemsCount: 12,
    crowdLevel: 'High',
    trafficIntensity: 'Heavy',
    category: 'SaaS Hub',
    status: 'Active',
    coordinates: { x: 65, y: 60 }
  },
  {
    id: 'z-iskcon',
    name: 'ISKCON Temple Sacred Food Zone',
    activeVendorsCount: 22,
    hiddenGemsCount: 4,
    crowdLevel: 'Moderate',
    trafficIntensity: 'Busy',
    category: 'Temple Zone',
    status: 'Active',
    coordinates: { x: 25, y: 25 }
  },
  {
    id: 'z-tourist',
    name: 'Malleshwaram Heritage Corridor',
    activeVendorsCount: 34,
    hiddenGemsCount: 9,
    crowdLevel: 'High',
    trafficIntensity: 'Busy',
    category: 'Tourist Zone',
    status: 'Active',
    coordinates: { x: 30, y: 35 }
  },
  {
    id: 'z-indiranagar',
    name: 'Indiranagar Late Night Hub',
    activeVendorsCount: 48,
    hiddenGemsCount: 11,
    crowdLevel: 'High',
    trafficIntensity: 'Busy',
    category: 'Night Food Street',
    status: 'Active',
    coordinates: { x: 80, y: 45 }
  },
  {
    id: 'z-jayanagar',
    name: 'Jayanagar 4th Block Street',
    activeVendorsCount: 29,
    hiddenGemsCount: 5,
    crowdLevel: 'Moderate',
    trafficIntensity: 'Clear',
    category: 'Residential',
    status: 'Active',
    coordinates: { x: 45, y: 80 }
  }
];

export const initialVendors: Vendor[] = [
  {
    id: 'v-1',
    stallName: 'Ravi Dosa Corner',
    ownerName: 'Ravi Gowda',
    phone: '+91 98450 12345',
    category: 'South Indian Breakfast',
    onboardingStatus: 'Approved',
    riskLevel: 'Low',
    location: 'Stall 4, Near Sajjan Rao Circle, VV Puram',
    zoneId: 'z-vvpuram',
    nearbyFoodStreet: 'VV Puram Food Street',
    documents: {
      license: 'FSSAI-2026-88493120',
      idProof: 'Aadhaar-XXXX-XXXX-8921',
      gst: '29AAAAA0000A1Z5'
    },
    photos: {
      kitchen: 'Clean steel counters, LPG burners, fresh filter coffee vessels',
      counter: 'Ravi serving his signature hot Butter Ghee Roast Dosa, crowded standing tables',
      foodPrep: 'Organic butter cubes, locally-sourced red dry chilies chutney paste'
    },
    hygieneScore: 94,
    hiddenGemScore: 98,
    isTrustedBadge: true,
    subscriptionPlan: 'Premium',
    status: 'Active',
    ordersCount: 4520,
    createdDate: '2025-01-12',
    aiFlags: []
  },
  {
    id: 'v-2',
    stallName: 'VV Puram Chaat House',
    ownerName: 'Manoj Mishra',
    phone: '+91 99001 54321',
    category: 'Chaat & North Indian Street Food',
    onboardingStatus: 'Pending',
    riskLevel: 'Medium',
    location: 'Stall 12, Main Food Street, VV Puram',
    zoneId: 'z-vvpuram',
    nearbyFoodStreet: 'VV Puram Food Street',
    documents: {
      license: 'FSSAI-PND-9941',
      idProof: 'PAN-XXXXXX781A',
    },
    photos: {
      kitchen: 'Gas pipes lack pressure check certification badge',
      counter: 'Open food display, colorful sweet and spicy chutneys in containers',
      foodPrep: 'Pre-cut onions and potato mash left uncovered for inspection check'
    },
    hygieneScore: 68,
    hiddenGemScore: 82,
    isTrustedBadge: false,
    subscriptionPlan: 'Growth',
    status: 'Pending',
    ordersCount: 120,
    createdDate: '2026-05-18',
    aiFlags: ['Uncovered food ingredients', 'FSSAI pending renewal validation']
  },
  {
    id: 'v-3',
    stallName: 'Koramangala Shawarma Spot',
    ownerName: 'Abid Khan',
    phone: '+91 88844 99112',
    category: 'Middle Eastern Food / Shawarma',
    onboardingStatus: 'Approved',
    riskLevel: 'High',
    location: 'Opposite Jyoti Nivas College Road, Koramangala',
    zoneId: 'z-koramangala',
    nearbyFoodStreet: 'Koramangala 5th Block Hub',
    documents: {
      license: 'FSSAI-2025-22449012',
      idProof: 'Aadhaar-XXXX-XXXX-9931',
      gst: '29BBBBB1111B1Z2'
    },
    photos: {
      kitchen: 'Dripping grease under vertical rotisserie burner',
      counter: 'Wrapping station exposed directly to passing roadside exhaust smoke',
      foodPrep: 'Frozen chicken defrosted non-regulation temperature'
    },
    hygieneScore: 52,
    hiddenGemScore: 95,
    isTrustedBadge: false,
    subscriptionPlan: 'Free',
    status: 'Suspended',
    ordersCount: 3820,
    createdDate: '2024-06-15',
    aiFlags: ['Extreme high-temperature broiler exhaust risk', 'Low water temperature washing basin']
  },
  {
    id: 'v-4',
    stallName: 'ISKCON Prasadam Snacks',
    ownerName: 'Radhavallabha Dasa',
    phone: '+91 80234 50000',
    category: 'Sacred Vegetarian Food / Temple Prasadam',
    onboardingStatus: 'Approved',
    riskLevel: 'Low',
    location: 'Temple exit walkway, Hare Krishna Hill, Rajajinagar',
    zoneId: 'z-iskcon',
    nearbyFoodStreet: 'ISKCON Temple Precincts',
    documents: {
      license: 'FSSAI-DEVC-110022',
      idProof: 'NOC-TempleDevTrust-09',
    },
    photos: {
      kitchen: 'Sandalwood-fragrant heavy-duty wood ovens, pristine solid silver storage kettles',
      counter: 'Highly disciplined eco-friendly leaf plate servings of Sweet Pongal & Puliyogare',
      foodPrep: 'Hygienic standard triple-stage filtered water, wearing sacred hair and beard covers'
    },
    hygieneScore: 99,
    hiddenGemScore: 92,
    isTrustedBadge: true,
    subscriptionPlan: 'Premium',
    status: 'Active',
    ordersCount: 8940,
    createdDate: '2023-08-01',
    aiFlags: []
  },
  {
    id: 'v-5',
    stallName: 'Hidden Biryani Cart',
    ownerName: 'Imran Ahmed',
    phone: '+91 97433 11223',
    category: 'Bangalore-style Mutton Biryani',
    onboardingStatus: 'Needs Docs',
    riskLevel: 'Medium',
    location: 'Under Flyover Pillar 104, Indiranagar Access Road',
    zoneId: 'z-indiranagar',
    nearbyFoodStreet: 'Indiranagar Extension Night Road',
    documents: {
      license: 'EXPIRED-FSSAI-2023',
      idProof: 'Aadhaar-XXXX-XXXX-1120',
    },
    photos: {
      kitchen: 'Open air tandoori mud pot with live active amber coal bed',
      counter: 'No sneeze guards, heavy street crowd congestion directly pushing past main stand',
      foodPrep: 'Meat stored in portable standard thermal ice coolers'
    },
    hygieneScore: 71,
    hiddenGemScore: 99,
    isTrustedBadge: false,
    subscriptionPlan: 'Starter',
    status: 'Pending',
    ordersCount: 450,
    createdDate: '2026-04-10',
    aiFlags: ['Missing local zone municipality commercial permit NOC', 'No GST record link', 'Expired FSSAI document']
  },
  {
    id: 'v-6',
    stallName: 'Veena Stores Malleshwaram Legacy',
    ownerName: 'Pradeep Sharma',
    phone: '+91 80233 45432',
    category: 'Melt-in-mouth Idli & Filter Coffee',
    onboardingStatus: 'Approved',
    riskLevel: 'Low',
    location: 'Margosa Road, Malleshwaram',
    zoneId: 'z-tourist',
    nearbyFoodStreet: 'Malleshwaram Heritage Corridor',
    documents: {
      license: 'FSSAI-2021-39492',
      idProof: 'Aadhaar-XXXX-XXXX-4422',
      gst: '29CCCCC2222C1Z6'
    },
    photos: {
      kitchen: 'Steam autoclaves for idlis, fresh milk boilers running 100% capacity',
      counter: 'High turn-over counter, biodegradable patravali plates, stainless steel dispensers',
      foodPrep: 'Direct delivery of clean wet ground batter tanks from centralized secure kitchen'
    },
    hygieneScore: 96,
    hiddenGemScore: 97,
    isTrustedBadge: true,
    subscriptionPlan: 'Premium',
    status: 'Active',
    ordersCount: 15400,
    createdDate: '2020-04-12',
    aiFlags: []
  },
  {
    id: 'v-7',
    stallName: 'Central Silk Board Gobi Cart',
    ownerName: 'Manju Gowda',
    phone: '+91 91100 88221',
    category: 'Indo-Chinese Gobi Manchurian',
    onboardingStatus: 'Needs Docs',
    riskLevel: 'High',
    location: 'Silk Board Junction bus stand side',
    zoneId: 'z-koramangala',
    nearbyFoodStreet: 'Silk Board Night Junction',
    documents: {
      license: 'None provided',
      idProof: 'VoterId-XXXXXXX990',
    },
    photos: {
      kitchen: 'Single kerosene pressure burner sitting directly on dirt ground floor',
      counter: 'Rusty iron wok with excessive re-fried palm oil fumes',
      foodPrep: 'Color food dyes (synthetic red tartrazine) found on preparation table'
    },
    hygieneScore: 41,
    hiddenGemScore: 89,
    isTrustedBadge: false,
    subscriptionPlan: 'Free',
    status: 'Suspended',
    ordersCount: 1100,
    createdDate: '2025-05-11',
    aiFlags: ['Toxic dye classification risk', 'Unauthorized public utility tap integration']
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9843',
    vendorName: 'Ravi Dosa Corner',
    customerName: 'Ananth Narayanan',
    amount: 180,
    status: 'Completed',
    type: 'Pickup',
    timestamp: '2026-05-21T02:35:00Z',
    prepTimeMinutes: 8
  },
  {
    id: 'ORD-9844',
    vendorName: 'Koramangala Shawarma Spot',
    customerName: 'Priya Sundaram',
    amount: 240,
    status: 'Delayed',
    type: 'Delivery',
    timestamp: '2026-05-21T02:40:00Z',
    prepTimeMinutes: 28
  },
  {
    id: 'ORD-9845',
    vendorName: 'Veena Stores Malleshwaram Legacy',
    customerName: 'Sanjay Kamath',
    amount: 110,
    status: 'Completed',
    type: 'Pickup',
    timestamp: '2026-05-21T02:42:00Z',
    prepTimeMinutes: 4
  },
  {
    id: 'ORD-9846',
    vendorName: 'Hidden Biryani Cart',
    customerName: 'Vikramjit Singh',
    amount: 450,
    status: 'Processing',
    type: 'Delivery',
    timestamp: '2026-05-21T02:45:00Z',
    prepTimeMinutes: 15
  },
  {
    id: 'ORD-9847',
    vendorName: 'ISKCON Prasadam Snacks',
    customerName: 'Venkatesh Prasad',
    amount: 320,
    status: 'Completed',
    type: 'Pickup',
    timestamp: '2026-05-21T02:22:00Z',
    prepTimeMinutes: 5
  },
  {
    id: 'ORD-9848',
    vendorName: 'VV Puram Chaat House',
    customerName: 'Nisha Hegde',
    amount: 140,
    status: 'Cancelled',
    type: 'Pickup',
    timestamp: '2026-05-21T02:15:00Z',
    prepTimeMinutes: 12
  },
  {
    id: 'ORD-9849',
    vendorName: 'Ravi Dosa Corner',
    customerName: 'Karthik Rao',
    amount: 220,
    status: 'Processing',
    type: 'Pickup',
    timestamp: '2026-05-21T02:46:00Z',
    prepTimeMinutes: 6
  }
];

export const initialInspectors: Inspector[] = [
  {
    id: 'INS-01',
    name: 'Inspector Sandeep Kumar',
    assignedVendors: ['v-1', 'v-2'],
    completedVisits: 48,
    pendingInspections: 3,
    currentZone: 'VV Puram Food Street',
    avatar: '🎯'
  },
  {
    id: 'INS-02',
    name: 'Inspector Meera Reddy',
    assignedVendors: ['v-3', 'v-7'],
    completedVisits: 39,
    pendingInspections: 5,
    currentZone: 'Koramangala Tech & Food Zone',
    avatar: '🌟'
  },
  {
    id: 'INS-03',
    name: 'Inspector Raghunath Hegde',
    assignedVendors: ['v-4', 'v-6'],
    completedVisits: 62,
    pendingInspections: 1,
    currentZone: 'Malleshwaram Heritage Corridor',
    avatar: '👨‍✈️'
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'TKT-1082',
    targetName: 'Koramangala Shawarma Spot',
    issueType: 'Hygiene',
    priority: 'Critical',
    assignedTo: 'Sandeep Kumar',
    status: 'Open',
    description: 'Multiple users reporting raw uncooked chicken being served. Two cases of stomach upset logged on Twitter last evening near Jyoti Nivas College area.',
    createdDate: '2026-05-20'
  },
  {
    id: 'TKT-1083',
    targetName: 'Central Silk Board Gobi Cart',
    issueType: 'Quality',
    priority: 'High',
    assignedTo: 'Meera Reddy',
    status: 'Open',
    description: 'Suspicion of artificial color powders and synthetic vinegar being used excessively in Gobi Manchurian preparation. FSSAI ban code violation.',
    createdDate: '2026-05-20'
  },
  {
    id: 'TKT-1084',
    targetName: 'VV Puram Chaat House',
    issueType: 'Vendor Delay',
    priority: 'Low',
    assignedTo: 'Support Team Auto',
    status: 'Resolved',
    description: 'Vendor did not accept pre-order within 15 minutes window buffer during peak Sunday evening rush.',
    createdDate: '2026-05-19'
  }
];

export const initialSubscriptions: SubscriptionStats[] = [
  {
    plan: 'Premium',
    vendorName: 'Ravi Dosa Corner',
    amount: 1499,
    renewalDate: '2026-06-12',
    activeSince: '2025-01-12',
    autoRenew: true
  },
  {
    plan: 'Growth',
    vendorName: 'VV Puram Chaat House',
    amount: 699,
    renewalDate: '2026-06-18',
    activeSince: '2026-05-18',
    autoRenew: true
  },
  {
    plan: 'Premium',
    vendorName: 'Veena Stores Malleshwaram Legacy',
    amount: 1499,
    renewalDate: '2026-07-01',
    activeSince: '2020-04-12',
    autoRenew: true
  },
  {
    plan: 'Starter',
    vendorName: 'Hidden Biryani Cart',
    amount: 299,
    renewalDate: '2026-06-10',
    activeSince: '2026-04-10',
    autoRenew: false
  }
];

export const initialAIAlerts: AIAlert[] = [
  {
    id: 'AI-ALRT-01',
    type: 'Abnormal Traffic',
    severity: 'High Risk',
    target: 'ISKCON Temple Sacred Food Zone',
    details: 'Sudden influx of 400%+ visitors predicted in next 60 minutes due to temple evening maha-prasadam festival and transit jams. Activating Temple Mode recommendation controls.',
    timestamp: '2026-05-21T02:10:00Z',
    resolved: false
  },
  {
    id: 'AI-ALRT-02',
    type: 'Spam Detection',
    severity: 'Warning',
    target: 'Central Silk Board Gobi Cart',
    details: 'AI content vision detected multiple identical videos of hot crispy Manchurian posted from same IP address within 3 minutes span.',
    timestamp: '2026-05-21T01:45:00Z',
    resolved: false
  },
  {
    id: 'AI-ALRT-03',
    type: 'Suspicious Activity',
    severity: 'High Risk',
    target: 'Koramangala Shawarma Spot',
    details: 'Smart hygiene analyzer flagged low cooler temperature of 14°C (regulation must be < 4°C for raw poultry ingredients). Critical food safety breach warning.',
    timestamp: '2026-05-21T02:05:00Z',
    resolved: false
  },
  {
    id: 'AI-ALRT-04',
    type: 'Fake Reviews',
    severity: 'Info',
    target: 'Ravi Dosa Corner',
    details: 'Clean-up filter flagged 12 5-star positive ratings coming from a generic device cluster in a different state. Neutralized and removed from master ranking matrix.',
    timestamp: '2026-05-20T21:00:00Z',
    resolved: true
  }
];

export const initialHygieneReports: HygieneReport[] = [
  {
    vendorId: 'v-1',
    vendorName: 'Ravi Dosa Corner',
    aiPhotoScore: 95,
    customerFeedbackScore: 92,
    inspectorReviewScore: 95,
    foodSafetyStatus: 'Pass',
    lastInspectionDate: '2026-05-10'
  },
  {
    vendorId: 'v-2',
    vendorName: 'VV Puram Chaat House',
    aiPhotoScore: 65,
    customerFeedbackScore: 72,
    inspectorReviewScore: 68,
    foodSafetyStatus: 'Under Investigation',
    lastInspectionDate: '2026-05-18'
  },
  {
    vendorId: 'v-3',
    vendorName: 'Koramangala Shawarma Spot',
    aiPhotoScore: 42,
    customerFeedbackScore: 58,
    inspectorReviewScore: 55,
    foodSafetyStatus: 'Fail',
    lastInspectionDate: '2026-05-15'
  },
  {
    vendorId: 'v-4',
    vendorName: 'ISKCON Prasadam Snacks',
    aiPhotoScore: 99,
    customerFeedbackScore: 98,
    inspectorReviewScore: 100,
    foodSafetyStatus: 'Pass',
    lastInspectionDate: '2026-05-12'
  },
  {
    vendorId: 'v-6',
    vendorName: 'Veena Stores Malleshwaram Legacy',
    aiPhotoScore: 94,
    customerFeedbackScore: 97,
    inspectorReviewScore: 96,
    foodSafetyStatus: 'Pass',
    lastInspectionDate: '2026-05-09'
  }
];

export const initialContentPosts: ContentPost[] = [
  {
    id: 'POST-001',
    vendorName: 'Ravi Dosa Corner',
    videoPlaceholderText: 'Ghee roast bubbling on heavy cast-iron tandoor',
    foodPhotoUrl: '🧀 Signature Golden Butter Ghee Crispy Dosa',
    caption: 'Voted Bengaluru\'s crispest dosa! 🤤 Thick organic homemade pure butter melting in real-time. Come experience Sajjan Rao circle legendary taste! #NammaBengaluru #DosaLove #BangaloreFoodStreet',
    views: 45200,
    likes: 8900,
    reportCount: 0,
    aiFlags: [],
    status: 'Approved'
  },
  {
    id: 'POST-002',
    vendorName: 'VV Puram Chaat House',
    videoPlaceholderText: 'Hot spicy floating golgappa sweet mint water mix',
    foodPhotoUrl: '🥙 Floating Dahi Puri & Special Samosa Chaat Combo',
    caption: 'Satisfy your sweet teeth cravings! Full high-carb spicy masala crush direct from VV Puram! Grab before 11 PM 🚀 #StreetFoodIndia #ChaatMasters',
    views: 12000,
    likes: 1800,
    reportCount: 4,
    aiFlags: ['Potential duplicate caption spam', 'Low resolution content compression'],
    status: 'Flagged'
  },
  {
    id: 'POST-003',
    vendorName: 'Koramangala Shawarma Spot',
    videoPlaceholderText: 'Vertical double rotisserie slicing raw chicken stack',
    foodPhotoUrl: '🌯 Double Cheese Overloaded Grilled Lava Shawarma Roll',
    caption: 'Late night midnight hunger saviour in Koramangala! Open till 2:30 AM every SINGLE night. Pocket friendly bites with extra mayo! 🔥',
    views: 31000,
    likes: 4200,
    reportCount: 15,
    aiFlags: ['Suspected duplicate marketing profile', 'Cleanliness hazard reported in nearby comments'],
    status: 'Flagged'
  }
];

export const initialNotifications: AdminNotification[] = [
  {
    id: 'NTF-101',
    title: 'FSSAI Hygiene Licensing Mandate 2026',
    body: 'All active street vendors must renew and upload their valid FSSAI certificate under the renewed state licensing guidelines before May 31, 2026.',
    audience: 'All Vendors',
    type: 'Hygiene Alert',
    scheduleTime: '2026-05-21T10:00:00Z',
    sentStatus: 'Sent'
  },
  {
    id: 'NTF-102',
    title: 'Namma Bengaluru Food Street Carnival 2026 Special Provisions',
    body: 'Get extra visibility boosts of 2.5x during the monsoon state food festival starting this weekend. Premium tier vendors get featured directly on high-traffic home feed carousel banner.',
    audience: 'Premium Only',
    type: 'Festival Notice',
    scheduleTime: '2026-05-23T12:00:00Z',
    sentStatus: 'Scheduled'
  }
];

export const initialAIInsights = [
  '🚨 Action Required: Koramangala Shawarma Spot food safety indicators dropped to low-risk limit critical status.',
  '📈 Traffic Hub Indicator: Koramangala food street activity increased 28% in the past 4 hours.',
  '🕉️ Devotee Pilgrimage Alert: Sweet Pongal and Puliyogare demand rising near ISKCON area. Temp vendors activated.',
  '🌙 Late-Night Shawarma & Biryani trending across Indiranagar & Koramangala zones between 11:00 PM and 2:30 AM.',
  '💎 New Hidden Gem Identified: Hidden Biryani Cart near flyover Pillar 104 has reached 99/100 ranking score.',
  '🌱 Pure Vegetarian high-density crowd cluster is forming at Jayanagar 4th Block Street.'
];

export const trendingSearchQueries = [
  { query: 'Best butter ghee dosa under ₹100', count: 4890, spike: '+42%' },
  { query: 'Late-night biryani open near Indiranagar', count: 3200, spike: '+88%' },
  { query: 'Prasadam breakfast today near ISKCON temple', count: 1850, spike: '+54%' },
  { query: 'Clean street food cert with hygiene badge near me', count: 2100, spike: '+30%' },
  { query: 'Hidden legendary gems in Koramangala 5th block', count: 5200, spike: '+120%' }
];
