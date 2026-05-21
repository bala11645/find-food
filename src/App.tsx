import { useState, useEffect } from 'react';
import { auth, db, bootstrapDatabaseIfEmpty, handleFirestoreError, OperationType } from './services/firebase';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { SidebarTab, Vendor, Zone, Order, Inspector, Complaint, SubscriptionStats, AIAlert, HygieneReport, ContentPost, AdminNotification, AdminUser } from './types';
import {
  initialVendors,
  initialZones,
  initialOrders,
  initialInspectors,
  initialComplaints,
  initialSubscriptions,
  initialAIAlerts,
  initialHygieneReports,
  initialContentPosts,
  initialNotifications
} from './data';

// Screens
import Login from './screens/Login';
import DashboardTab from './screens/DashboardTab';
import VendorApprovalTab from './screens/VendorApprovalTab';
import VendorDetailTab from './screens/VendorDetailTab';
import VendorManagementTab from './screens/VendorManagementTab';
import OrdersMonitoringTab from './screens/OrdersMonitoringTab';
import ContentModerationTab from './screens/ContentModerationTab';
import HygieneControlTab from './screens/HygieneControlTab';
import InspectorManagementTab from './screens/InspectorManagementTab';
import ZoneManagementTab from './screens/ZoneManagementTab';
import TempleModeTab from './screens/TempleModeTab';
import TouristModeTab from './screens/TouristModeTab';
import AIEngineTab from './screens/AIEngineTab';
import AnalyticsTab from './screens/AnalyticsTab';
import SubscriptionManagementTab from './screens/SubscriptionManagementTab';
import NotificationsTab from './screens/NotificationsTab';
import ComplaintsTab from './screens/ComplaintsTab';
import ReportsTab from './screens/ReportsTab';
import RolesTab from './screens/RolesTab';
import SettingsTab from './screens/SettingsTab';

// Icons
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  Video,
  Activity,
  UserPlus,
  Network,
  Landmark,
  Compass,
  Cpu,
  BarChart4,
  CreditCard,
  Bell,
  MessageSquare,
  FileSpreadsheet,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Trophy
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Layout states
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Real-time Toast Queue
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }[]>([]);

  // Shared Master Data State Tree (Mutates on actions or Firestore snapshots)
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inspectors, setInspectors] = useState<Inspector[]>(initialInspectors);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [subscriptions, setSubscriptions] = useState<SubscriptionStats[]>(initialSubscriptions);
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>(initialAIAlerts);
  const [hygieneReports, setHygieneReports] = useState<HygieneReport[]>(initialHygieneReports);
  const [posts, setPosts] = useState<ContentPost[]>(initialContentPosts);
  const [notifications, setNotifications] = useState<AdminNotification[]>(initialNotifications);

  // Selected sub-elements mapping
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedDashboardZoneId, setSelectedDashboardZoneId] = useState<string | null>(null);

  // Firestore status indicators
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const isFirebaseReady = auth.app.options.apiKey && auth.app.options.apiKey !== 'mock-api-key-placeholder';

  // Subscriptions and Initial Hydration
  useEffect(() => {
    if (!isFirebaseReady || !isLoggedIn) return;

    let unsubscribes: (() => void)[] = [];
    setIsDbLoading(true);

    const initFirebaseData = async () => {
      try {
        // Step 1: Bootstrap / Seed with default values if Firestore is empty
        await bootstrapDatabaseIfEmpty({
          zones: initialZones,
          vendors: initialVendors,
          orders: initialOrders,
          inspectors: initialInspectors,
          complaints: initialComplaints,
          aiAlerts: initialAIAlerts,
          hygieneReports: initialHygieneReports,
          contentPosts: initialContentPosts,
          notifications: initialNotifications
        });

        // Step 2: Listen in real-time to each collection and update local React states
        const collectionsToListen = [
          { name: 'vendors', setter: setVendors },
          { name: 'zones', setter: setZones },
          { name: 'orders', setter: setOrders },
          { name: 'inspectors', setter: setInspectors },
          { name: 'complaints', setter: setComplaints },
          { name: 'aiAlerts', setter: setAiAlerts },
          { name: 'hygieneReports', setter: setHygieneReports },
          { name: 'contentPosts', setter: setPosts },
          { name: 'notifications', setter: setNotifications }
        ];

        let loadedCount = 0;
        collectionsToListen.forEach((colInfo) => {
          const unsub = onSnapshot(collection(db, colInfo.name), (snapshot) => {
            const list: any[] = [];
            snapshot.forEach((doc) => {
              list.push({ ...doc.data() });
            });
            colInfo.setter(list);
            
            if (loadedCount < collectionsToListen.length) {
              loadedCount++;
              if (loadedCount >= collectionsToListen.length) {
                setIsDbLoading(false);
              }
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, colInfo.name);
          });
          unsubscribes.push(unsub);
        });

        // Also fetch subscriptions custom ledger list
        const unsubSubs = onSnapshot(collection(db, 'subscriptions'), (snapshot) => {
          const list: any[] = [];
          snapshot.forEach((doc) => {
            list.push({ ...doc.data() });
          });
          setSubscriptions(list);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'subscriptions');
        });
        unsubscribes.push(unsubSubs);

        // Fetch admins
        onSnapshot(collection(db, 'admins'), () => {}, (err) => {
          console.warn('Admins listener info:', err.message);
        });

      } catch (err: any) {
        setDbError(err.message);
        setIsDbLoading(false);
        triggerToast("Failed syncing real-time databases.", "error");
      }
    };

    initFirebaseData();

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [isFirebaseReady, isLoggedIn]);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 6);
    setToasts(prev => [...prev, { id, message: msg, type }]);
    
    // Auto-remove after 4500ms
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Enforce programmatic Client-side RBAC Guard
  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    const role = adminUser.role || 'Super Admin';
    const permissions: Record<string, string[]> = {
      'Super Admin': ['dash', 'approve', 'suspend', 'hygiene', 'content', 'sub', 'revenue', 'settings'],
      'City Admin': ['dash', 'approve', 'suspend', 'hygiene', 'content'],
      'Inspection Manager': ['dash', 'hygiene'],
      'Moderation Team': ['dash', 'content'],
      'Support Team': ['dash']
    };
    return (permissions[role] || []).includes(permission);
  };

  const getTabPermission = (tabId: string): string => {
    switch (tabId) {
      case 'dashboard': return 'dash';
      case 'approval': return 'approve';
      case 'vendors': return 'dash';
      case 'orders': return 'dash';
      case 'temple': return 'hygiene';
      case 'tourist': return 'dash';
      case 'zones': return 'settings';
      case 'inspectors': return 'hygiene';
      case 'content': return 'content';
      case 'hygiene': return 'hygiene';
      case 'ai': return 'dash';
      case 'analytics': return 'revenue';
      case 'subscription': return 'sub';
      case 'notifications': return 'settings';
      case 'complaints': return 'dash';
      case 'reports': return 'dash';
      case 'roles': return 'settings';
      case 'settings': return 'settings';
      default: return 'dash';
    }
  };

  // Mutator Callbacks: Login Actions
  const handleLoginSuccess = (email: string, name: string, role: AdminUser['role']) => {
    setAdminUser({ email, name, role });
    setIsLoggedIn(true);
    triggerToast(`Welcome back, Officer ${name}! SecOps administrative access authorized.`);
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    try {
      if (isFirebaseReady) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Firebase signOut failure:", err);
    }
    triggerToast('Securely logged out from administrative terminal.');
  };

  // Mutator Callback: General Vendor updates
  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    if (!hasPermission('approve') && !hasPermission('hygiene') && !hasPermission('settings')) {
      triggerToast("Access Denied: Your administrative role lacks authority to update vendor records.", "error");
      return;
    }
    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'vendors', updatedVendor.id), updatedVendor);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vendors/${updatedVendor.id}`);
      }
    } else {
      setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    }
  };

  // Mutator: Approve pending vendor
  const handleApproveVendor = async (id: string) => {
    if (!hasPermission('approve')) {
      triggerToast("Access Denied: Your administrative role lacks 'approve' permission to onboard food stalls.", "error");
      return;
    }
    const targetVendor = vendors.find(v => v.id === id);
    if (!targetVendor) return;

    const updatedVendor = {
      ...targetVendor,
      onboardingStatus: 'Approved' as const,
      status: 'Active' as const,
      hygieneScore: Math.max(targetVendor.hygieneScore, 75)
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'vendors', id), updatedVendor);
        
        // Log transaction history
        const approvalId = `app-${id}-${Date.now()}`;
        await setDoc(doc(db, 'vendorApprovals', approvalId), {
          id: approvalId,
          vendorId: id,
          vendorName: targetVendor.stallName,
          status: 'Approved',
          comments: 'Physical/digital credentials cleared. FSSAI state directives approved.',
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vendors/${id}`);
      }
    } else {
      setVendors(prev =>
        prev.map(v => v.id === id ? updatedVendor : v)
      );
    }
  };

  // Mutator: Reject vendor
  const handleRejectVendor = async (id: string, reason?: string) => {
    if (!hasPermission('suspend') && !hasPermission('approve')) {
      triggerToast("Access Denied: Your administrative role lacks authority to suspend or reject vendor onboarding.", "error");
      return;
    }
    const targetVendor = vendors.find(v => v.id === id);
    if (!targetVendor) return;

    const updatedVendor = {
      ...targetVendor,
      onboardingStatus: 'Rejected' as const,
      status: 'Suspended' as const
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'vendors', id), updatedVendor);

        // Log transaction history
        const approvalId = `app-${id}-${Date.now()}`;
        await setDoc(doc(db, 'vendorApprovals', approvalId), {
          id: approvalId,
          vendorId: id,
          vendorName: targetVendor.stallName,
          status: 'Rejected',
          comments: reason || 'Application profile rejected due to risk screening failure.',
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vendors/${id}`);
      }
    } else {
      setVendors(prev =>
        prev.map(v => v.id === id ? updatedVendor : v)
      );
    }
  };

  // Mutator: Update status & onboarding attributes
  const handleUpdateStatusAndOnboarding = async (id: string, status: any, onboarding: any) => {
    if (!hasPermission('suspend') && !hasPermission('approve') && !hasPermission('settings')) {
      triggerToast("Access Denied: Your administrative role lacks authority to modify status & onboarding metrics.", "error");
      return;
    }
    const targetVendor = vendors.find(v => v.id === id);
    if (!targetVendor) return;

    const updatedVendor = { ...targetVendor, status, onboardingStatus: onboarding };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'vendors', id), updatedVendor);

        const approvalId = `app-${id}-${Date.now()}`;
        await setDoc(doc(db, 'vendorApprovals', approvalId), {
          id: approvalId,
          vendorId: id,
          vendorName: targetVendor.stallName,
          status: onboarding,
          comments: `State changed to: ${onboarding} (Platform overall status: ${status})`,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `vendors/${id}`);
      }
    } else {
      setVendors(prev =>
        prev.map(v => v.id === id ? updatedVendor : v)
      );
    }
  };

  // Mutator: Permanent expulsion delete vendor
  const handleDeleteVendor = async (id: string) => {
    if (!hasPermission('settings')) {
      triggerToast("Access Denied: Permanently expelling food stalls is a restricted Super Admin configuration action.", "error");
      return;
    }
    if (isFirebaseReady) {
      try {
        await deleteDoc(doc(db, 'vendors', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `vendors/${id}`);
      }
    } else {
      setVendors(prev => prev.filter(v => v.id !== id));
    }
  };

  // Mutator: Assign inspector
  const handleAssignInspector = async (vendorId: string, inspectorName: string) => {
    const targetVendor = vendors.find(v => v.id === vendorId);
    const targetInspector = inspectors.find(ins => ins.name === inspectorName);

    if (isFirebaseReady) {
      try {
        if (targetVendor) {
          const updatedVendor = {
            ...targetVendor,
            onboardingStatus: 'Inspection Required' as const,
            status: 'Pending' as const
          };
          await setDoc(doc(db, 'vendors', vendorId), updatedVendor);

          // Log transaction
          const approvalId = `app-${vendorId}-${Date.now()}`;
          await setDoc(doc(db, 'vendorApprovals', approvalId), {
            id: approvalId,
            vendorId,
            vendorName: targetVendor.stallName,
            status: 'Inspection Required',
            comments: `Administrative physical audits scheduled. Inspector ${inspectorName} designated.`,
            assignedInspectorId: inspectorName,
            updatedAt: new Date().toISOString()
          });
        }

        if (targetInspector) {
          const updatedInspector = {
            ...targetInspector,
            assignedVendors: [...targetInspector.assignedVendors, vendorId],
            completedVisits: targetInspector.completedVisits + 1
          };
          await setDoc(doc(db, 'inspectors', targetInspector.id), updatedInspector);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `inspectors`);
      }
    } else {
      if (targetVendor) {
        setVendors(prev =>
          prev.map(v => v.id === vendorId ? { ...v, onboardingStatus: 'Inspection Required' as const, status: 'Pending' as const } : v)
        );
      }
      setInspectors(prev =>
        prev.map(ins =>
          ins.name === inspectorName
            ? { ...ins, assignedVendors: [...ins.assignedVendors, vendorId], completedVisits: ins.completedVisits + 1 }
            : ins
        )
      );
    }
  };

  // Mutator: View detail routing helper
  const handleViewDetail = (id: string) => {
    setSelectedVendorId(id);
    setActiveTab('vendors'); // direct routing inside vendors screen
  };

  // Mutator: Update orders
  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'orders', orderId), { ...targetOrder, status });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
      }
    } else {
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
    }
  };

  // Mutator: Resolve AI high risk alerts
  const handleResolveAlert = async (id: string) => {
    const alert = aiAlerts.find(a => a.id === id);
    if (!alert) return;

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'aiAlerts', id), { ...alert, resolved: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `aiAlerts/${id}`);
      }
    } else {
      setAiAlerts(prev =>
        prev.map(alert => alert.id === id ? { ...alert, resolved: true } : alert)
      );
    }
  };

  // Mutator: Update posts status (Approve / Remove Content)
  const handleUpdatePostStatus = async (id: string, status: 'Approved' | 'Flagged' | 'Removed', aiResult?: any) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    if (isFirebaseReady) {
      try {
        const updatedPost = { ...post, status };
        if (aiResult) {
          (updatedPost as any).aiModerationResult = aiResult;
        }
        await setDoc(doc(db, 'contentPosts', id), updatedPost);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `contentPosts/${id}`);
      }
    } else {
      setPosts(prev =>
        prev.map(p => p.id === id ? { ...p, status, aiModerationResult: aiResult || (p as any).aiModerationResult } : p)
      );
    }
  };

  // Mutator: Add City sub precinct
  const handleAddZone = async (newZone: Zone) => {
    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'zones', newZone.id), newZone);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `zones/${newZone.id}`);
      }
    } else {
      setZones(prev => [...prev, newZone]);
    }
  };

  const handleUpdateZoneStatus = async (id: string, status: 'Active' | 'Disabled', aiZoneInsights?: any) => {
    const zone = zones.find(z => z.id === id);
    if (!zone) return;

    if (isFirebaseReady) {
      try {
        const updated = { ...zone, status };
        if (aiZoneInsights) {
          (updated as any).aiZoneInsights = aiZoneInsights;
        }
        await setDoc(doc(db, 'zones', id), updated);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `zones/${id}`);
      }
    } else {
      setZones(prev =>
        prev.map(z => z.id === id ? { ...z, status, aiZoneInsights: aiZoneInsights || (z as any).aiZoneInsights } : z)
      );
    }
  };

  // Mutator: Upgrade vendor Saas plan
  const handleUpgradePlan = async (vendorName: string, plan: 'Free' | 'Starter' | 'Growth' | 'Premium') => {
    let priceMultiplier = 0;
    if (plan === 'Premium') priceMultiplier = 1499;
    else if (plan === 'Growth') priceMultiplier = 699;
    else if (plan === 'Starter') priceMultiplier = 299;

    const subId = `sub-${vendorName.replace(/[^a-zA-Z0-9]/g, '-')}`;

    const newSub: SubscriptionStats = {
      plan,
      vendorName,
      amount: priceMultiplier,
      renewalDate: '2026-06-25',
      activeSince: new Date().toISOString().split('T')[0],
      autoRenew: true
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'subscriptions', subId), newSub);

        // Also update vendor document plan
        const v = vendors.find(x => x.stallName === vendorName);
        if (v) {
          await setDoc(doc(db, 'vendors', v.id), { ...v, subscriptionPlan: plan });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `subscriptions/${subId}`);
      }
    } else {
      setVendors(prev =>
        prev.map(v => v.stallName === vendorName ? { ...v, subscriptionPlan: plan } : v)
      );
      setSubscriptions(prev => {
        const exists = prev.find(s => s.vendorName === vendorName);
        if (exists) {
          return prev.map(s =>
            s.vendorName === vendorName ? { ...s, plan, amount: priceMultiplier } : s
          );
        } else {
          return [...prev, newSub];
        }
      });
    }
  };

  // Mutator: Add news notification alert
  const handleAddNotification = async (newNotif: AdminNotification) => {
    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotif.id}`);
      }
    } else {
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Mutator: Resolve grievance complaint tickets
  const handleResolveComplaint = async (id: string) => {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'complaints', id), { ...complaint, status: 'Resolved' as const });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `complaints/${id}`);
      }
    } else {
      setComplaints(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'Resolved' as const } : c)
      );
    }
  };

  // Audit Submit mock/real inspection
  const handleAuditSubmit = async (vendorId: string, score: number, remarks: string) => {
    const targetVendor = vendors.find(v => v.id === vendorId);
    if (!targetVendor) return;

    // Apply the requested hygiene status transition flow:
    // Normal -> Warning -> Inspection Scheduled -> Trusted / Suspended
    let newStatus: Vendor['status'] = 'Normal';
    let isTrustedBadge = targetVendor.isTrustedBadge;

    if (score >= 95) {
      newStatus = 'Trusted' as any;
      isTrustedBadge = true;
    } else if (score >= 75) {
      newStatus = 'Normal' as any;
      isTrustedBadge = false;
    } else if (score >= 60) {
      newStatus = 'Warning' as any;
      isTrustedBadge = false;
    } else {
      newStatus = 'Suspended' as any;
      isTrustedBadge = false;
    }

    const updatedVendor = {
      ...targetVendor,
      hygieneScore: score,
      status: newStatus,
      isTrustedBadge
    };

    const targetName = targetVendor.stallName;
    const reportId = `rep-${vendorId}`;

    const newReport: HygieneReport = {
      vendorId,
      vendorName: targetName,
      aiPhotoScore: Math.max(50, score - 8),
      customerFeedbackScore: Math.max(60, score - 4),
      inspectorReviewScore: score,
      foodSafetyStatus: score >= 75 ? 'Pass' as const : 'Fail' as const,
      lastInspectionDate: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseReady) {
      try {
        await setDoc(doc(db, 'vendors', vendorId), updatedVendor);
        await setDoc(doc(db, 'hygieneReports', reportId), newReport);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `hygieneReports/${reportId}`);
      }
    } else {
      setVendors(prev =>
        prev.map(v => v.id === vendorId ? updatedVendor : v)
      );
      setHygieneReports(prev => {
        const exists = prev.find(r => r.vendorId === vendorId);
        if (exists) {
          return prev.map(r => r.vendorId === vendorId ? newReport : r);
        } else {
          return [...prev, newReport];
        }
      });
    }
  };

  // Skip Login bypass on client request OR require Login by default
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Categories of navigational tabs
  const sidebarCategories = [
    {
      title: 'CORE CONTROL',
      tabs: [
        { id: 'dashboard', label: 'Main Control Room', icon: LayoutDashboard },
        { id: 'approval', label: 'Onboarding Queue', icon: UserCheck, badge: vendors.filter(v => v.onboardingStatus === 'Pending').length },
        { id: 'vendors', label: 'Stalls Register', icon: Users },
        { id: 'orders', label: 'Order Telemetry', icon: ShoppingBag }
      ]
    },
    {
      title: 'AUDIT & SPECIALTIES',
      tabs: [
        { id: 'temple', label: 'Temple Sathvik Mode', icon: Landmark },
        { id: 'tourist', label: 'Tourist Legacy Mode', icon: Compass },
        { id: 'zones', label: 'Municipal Zoning', icon: Network },
        { id: 'inspectors', label: 'Sanitary Inspectors', icon: UserPlus }
      ]
    },
    {
      title: 'ALGORITHMS & FEED',
      tabs: [
        { id: 'content', label: 'Content Screener', icon: Video, badge: posts.filter(p => p.status === 'Flagged').length },
        { id: 'hygiene', label: 'Safety Intelligence', icon: Activity, badge: vendors.filter(v => v.hygieneScore < 75).length },
        { id: 'ai', label: 'AI Engine Monitor', icon: Cpu },
        { id: 'analytics', label: 'Performance BI', icon: BarChart4 }
      ]
    },
    {
      title: 'LEDGER & GRIEVCANCE',
      tabs: [
        { id: 'subscription', label: 'SaaS Subscriptions', icon: CreditCard },
        { id: 'notifications', label: 'Alert Dispatcher', icon: Bell },
        { id: 'complaints', label: 'Dispute Desk', icon: MessageSquare, badge: complaints.filter(c => c.status === 'Open').length },
        { id: 'reports', label: 'Secure PDF Reports', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'SYSTEM SECURITY',
      tabs: [
        { id: 'roles', label: 'RBAC Access Matrix', icon: ShieldAlert },
        { id: 'settings', label: 'App Preferences', icon: Settings }
      ]
    }
  ];

  // Helper matching tab to component view
  const renderTabContent = () => {
    // If selected vendor exists on master stalls screen, overlay or subrout the profile detail directly!
    if (activeTab === 'vendors' && selectedVendorId !== null) {
      return (
        <VendorDetailTab
          vendors={vendors}
          selectedVendorId={selectedVendorId}
          onUpdateVendor={handleUpdateVendor}
          onBackToManagement={() => setSelectedVendorId(null)}
          onTriggerActionToast={triggerToast}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            vendors={vendors}
            zones={zones}
            orders={orders}
            aiAlerts={aiAlerts}
            selectedZone={selectedDashboardZoneId}
            onSelectZone={setSelectedDashboardZoneId}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setSelectedVendorId(null);
            }}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'approval':
        return (
          <VendorApprovalTab
            vendors={vendors}
            inspectors={inspectors}
            onApproveVendor={handleApproveVendor}
            onRejectVendor={handleRejectVendor}
            onUpdateStatus={handleUpdateStatusAndOnboarding}
            onAssignInspector={handleAssignInspector}
            onViewDetail={(id) => {
              setSelectedVendorId(id);
              setActiveTab('vendors');
            }}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'vendors':
        return (
          <VendorManagementTab
            vendors={vendors}
            onUpdateStatus={handleUpdateStatusAndOnboarding}
            onUpdateVendor={handleUpdateVendor}
            onViewDetail={(id) => setSelectedVendorId(id)}
            onTriggerActionToast={triggerToast}
            onDeleteVendor={handleDeleteVendor}
          />
        );
      case 'orders':
        return (
          <OrdersMonitoringTab
            orders={orders}
            onTriggerActionToast={triggerToast}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );
      case 'content':
        return (
          <ContentModerationTab
            posts={posts}
            onUpdatePostStatus={handleUpdatePostStatus}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'hygiene':
        return (
          <HygieneControlTab
            vendors={vendors}
            hygieneReports={hygieneReports}
            onUpdateVendor={handleUpdateVendor}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'inspectors':
        return (
          <InspectorManagementTab
            inspectors={inspectors}
            vendors={vendors}
            onTriggerActionToast={triggerToast}
            onAuditSubmit={handleAuditSubmit}
          />
        );
      case 'zones':
        return (
          <ZoneManagementTab
            zones={zones}
            onAddZone={handleAddZone}
            onUpdateZoneStatus={handleUpdateZoneStatus}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'temple':
        return (
          <TempleModeTab
            vendors={vendors}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'tourist':
        return (
          <TouristModeTab
            vendors={vendors}
            onUpdateVendor={handleUpdateVendor}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'ai':
        return (
          <AIEngineTab
            aiAlerts={aiAlerts}
            vendors={vendors}
            onResolveAlert={handleResolveAlert}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'analytics':
        return (
          <AnalyticsTab
            onTriggerActionToast={triggerToast}
          />
        );
      case 'subscription':
        return (
          <SubscriptionManagementTab
            subscriptions={subscriptions}
            vendors={vendors}
            onUpgradePlan={handleUpgradePlan}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'notifications':
        return (
          <NotificationsTab
            notifications={notifications}
            onAddNotification={handleAddNotification}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'complaints':
        return (
          <ComplaintsTab
            complaints={complaints}
            onResolveComplaint={handleResolveComplaint}
            onTriggerActionToast={triggerToast}
          />
        );
      case 'reports':
        return (
          <ReportsTab
            onTriggerActionToast={triggerToast}
          />
        );
      case 'roles':
        return (
          <RolesTab
            onTriggerActionToast={triggerToast}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            onTriggerActionToast={triggerToast}
          />
        );
      default:
        return (
          <div className="p-8 text-slate-400">
            Tab execution engine is currently under development.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex font-sans select-none antialiased relative overflow-x-hidden">
      
      {/* GLOW BACKGROUND ORNAMENTS */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* MULTI-TOAST FLOATING NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-2.5 max-w-sm w-full select-none pointer-events-none p-4 sm:p-0">
        {toasts.map((t) => {
          let borderStyle = 'border-emerald-500/25 bg-[#161618]';
          let icon = <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />;
          
          if (t.type === 'error') {
            borderStyle = 'border-rose-500/25 bg-[#161618]';
            icon = <X className="w-4 h-4 text-rose-455 shrink-0" />;
          } else if (t.type === 'warning') {
            borderStyle = 'border-amber-500/25 bg-[#161618]/95';
            icon = <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />;
          } else if (t.type === 'info') {
            borderStyle = 'border-blue-500/25 bg-[#161618]';
            icon = <Cpu className="w-4 h-4 text-blue-400 shrink-0" />;
          }
          
          return (
            <div
              key={t.id}
              className={`pointer-events-auto border ${borderStyle} rounded-2xl px-4 py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.55)] flex items-center gap-3 animate-slide-up transition-all duration-300`}
            >
              <div className="shrink-0">{icon}</div>
              <span className="text-xs font-semibold font-sans leading-normal text-slate-105 flex-1">
                {t.message}
              </span>
              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-slate-500 hover:text-slate-200 ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden lg:flex w-64 bg-[#121214] border-r border-slate-900 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
        
        {/* LOGO STRIP */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold font-display text-base">
              FC
            </div>
            <div>
              <h1 className="text-white font-bold tracking-tight text-base font-display">FoodCourt AI</h1>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold mt-0.5">ADMIN SEC-CONSOLE</span>
            </div>
          </div>
        </div>

        {/* NAV SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar">
          {sidebarCategories.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-2">
              <span className="text-[9px] font-mono text-slate-500 block px-3 tracking-widest font-bold uppercase mb-1">
                {cat.title}
              </span>
              <div className="space-y-1">
                {cat.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isTabActive = activeTab === tab.id;
                  const hasViewAccess = hasPermission(getTabPermission(tab.id));
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (!hasViewAccess) {
                          triggerToast(`Access Denied: Your staff profile lacks approval to access the ${tab.label} desk.`, "warning");
                          return;
                        }
                        setActiveTab(tab.id as any);
                        setSelectedVendorId(null); // Clear detailed subroute selection
                      }}
                      className={`w-full px-3 py-2 text-xs rounded-lg flex items-center justify-between text-left transition-all cursor-pointer font-medium ${
                        !hasViewAccess
                          ? 'opacity-40 hover:bg-red-500/5'
                          : isTabActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                            : 'text-slate-405 hover:bg-white/5 hover:text-white transition-colors'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="uppercase font-semibold tracking-wide text-[10px]">{tab.label}</span>
                        {!hasViewAccess && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                      </div>
                      {tab.badge && tab.badge > 0 && hasViewAccess ? (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                          isTabActive ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800/80 text-slate-300'
                        }`}>
                          {tab.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* AI HEALTH MONITOR PANEL */}
        <div className="px-4 py-3 border-t border-white/5 bg-slate-900/5">
          <div className="bg-slate-800/20 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">AI SYSTEM HEALTH</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-zinc-500 italic font-mono leading-normal">Scanning 142 food stalls in Bangalore...</div>
          </div>
        </div>

        {/* USER PROFILE INFO FOOTER */}
        <div className="p-4 border-t border-white/5 bg-slate-900/20 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10 text-white font-display">
              CG
            </span>
            <div className="truncate flex-1">
              <span className="text-xs font-semibold text-white block truncate leading-tight">{adminUser?.name || 'Administrator'}</span>
              <span className="text-[10px] font-mono text-emerald-400 block font-bold leading-normal">{adminUser?.role || 'Super Admin'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-1.5 px-3 bg-red-500/5 hover:bg-red-500/15 text-rose-450 hover:text-rose-400 border border-red-500/10 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Close Session
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR PANEL OVERLAY */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/80 backdrop-blur-sm">
          <div className="w-64 bg-[#0a0f1d] border-r border-slate-900 flex flex-col justify-between h-full p-4 animate-slide-right">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <span className="font-semibold text-slate-205 text-sm uppercase font-display select-none">Food Court AI</span>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-1 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar pr-1">
                {sidebarCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-1">
                    <span className="text-[8px] font-mono text-slate-500 block px-2 tracking-wider font-bold">
                      {cat.title}
                    </span>
                    <div className="space-y-0.5">
                      {cat.tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isTabActive = activeTab === tab.id;
                        const hasViewAccess = hasPermission(getTabPermission(tab.id));
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              if (!hasViewAccess) {
                                triggerToast(`Access Denied: Your staff profile lacks approval to access the ${tab.label} desk.`, "warning");
                                return;
                              }
                              setActiveTab(tab.id as any);
                              setSelectedVendorId(null);
                              setShowMobileSidebar(false);
                            }}
                            className={`w-full px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between text-left ${
                              !hasViewAccess
                                ? 'opacity-40 hover:bg-red-500/5'
                                : isTabActive
                                  ? 'bg-slate-900 text-emerald-400 font-semibold'
                                  : 'text-slate-400 hover:bg-white/5 transition-colors'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                              {!hasViewAccess && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                            </div>
                            {tab.badge && tab.badge > 0 && hasViewAccess ? (
                              <span className="text-[8px] font-mono bg-slate-800 text-slate-350 px-1 py-0.2 rounded">
                                {tab.badge}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-900 pt-3 space-y-2">
              <span className="text-[10px] text-slate-405 block">User: {adminUser?.name}</span>
              <button
                onClick={handleLogout}
                className="w-full py-1 bg-red-950/40 text-rose-455 text-xs rounded-lg font-mono transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN MAIN VIEW SHELL */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10 custom-scrollbar select-none">
        
        {/* DESKTOP HEADER BAR */}
        <header className="hidden lg:flex h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md items-center justify-between px-8 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium px-2.5 py-1.5 bg-white/5 rounded border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">System:</span>
              <span className="text-emerald-400 font-mono font-bold">STABLE</span>
            </div>
            <div className="text-xs font-medium text-slate-400">
              Koramangala Zone: <span className="text-amber-400">High Demand</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-[#09090b] flex items-center justify-center text-[9px] font-bold text-white shadow">AD</div>
              <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-[#09090b] flex items-center justify-center text-[9px] font-bold text-white shadow">IN</div>
            </div>
            <button 
              onClick={() => {
                setActiveTab('notifications');
                triggerToast('Navigating to announcement dispatch control tower.');
              }}
              className="bg-white hover:bg-slate-200 text-black px-4 py-1.5 rounded text-xs font-bold uppercase tracking-tight transition cursor-pointer"
            >
              Broadcast Notice
            </button>
          </div>
        </header>

        {/* MOBILE UPPER HEADER BAR */}
        <header className="lg:hidden bg-[#0a0f1d] border-b border-slate-920 p-4 shrink-0 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold font-mono">⚡</span>
            <span className="font-display font-medium text-sm text-slate-205">Food Court Admin AI</span>
          </div>
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-1 px-2.5 bg-slate-900 hover:bg-slate-850 rounded-xl text-slate-405 border border-slate-850 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* CONTAINER SCREEN AREA */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {renderTabContent()}
        </div>
      </main>

    </div>
  );
}
