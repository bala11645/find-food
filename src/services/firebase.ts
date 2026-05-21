import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection, setDoc, query, limit } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth();

// Error handling types and helper as specified by the Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Global connectivity check
export async function testConnection() {
  try {
    const testDocRef = doc(db, 'zones', 'z-vvpuram');
    await getDoc(testDocRef);
    console.log('[Firebase] Connection online.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('[Firebase] Connection offline. Please verify config endpoints.');
    }
  }
}

// Automatic Firestore Seeder
// Seeds collections with initial values from 'src/data.ts' if they are empty
export async function bootstrapDatabaseIfEmpty(initialData: {
  zones: any[];
  vendors: any[];
  orders: any[];
  inspectors: any[];
  complaints: any[];
  aiAlerts: any[];
  hygieneReports: any[];
  contentPosts: any[];
  notifications: any[];
}) {
  try {
    const collectionsToSeed = [
      { name: 'zones', key: 'id', data: initialData.zones },
      { name: 'vendors', key: 'id', data: initialData.vendors },
      { name: 'orders', key: 'id', data: initialData.orders },
      { name: 'inspectors', key: 'id', data: initialData.inspectors },
      { name: 'complaints', key: 'id', data: initialData.complaints },
      { name: 'aiAlerts', key: 'id', data: initialData.aiAlerts },
      { name: 'hygieneReports', key: 'vendorId', data: initialData.hygieneReports },
      { name: 'contentPosts', key: 'id', data: initialData.contentPosts },
      { name: 'notifications', key: 'id', data: initialData.notifications }
    ];

    for (const colInfo of collectionsToSeed) {
      const colRef = collection(db, colInfo.name);
      const q = query(colRef, limit(1));
      const snap = await getDocs(q);

      if (snap.empty) {
        console.log(`[Firebase Seeding] Collection ${colInfo.name} is empty. Seeding defaults...`);
        for (const item of colInfo.data) {
          const docId = String(item[colInfo.key]);
          const docRef = doc(db, colInfo.name, docId);
          await setDoc(docRef, item);
        }
      }
    }

    // Seed default subscription structures as well derived from vendors
    const subColRef = collection(db, 'subscriptions');
    const subSnap = await getDocs(query(subColRef, limit(1)));
    if (subSnap.empty) {
      console.log(`[Firebase Seeding] Seeding default subscriptions...`);
      const plans = ['Free', 'Starter', 'Growth', 'Premium'] as const;
      initialData.vendors.forEach(async (v, index) => {
        const plan = plans[index % plans.length];
        const subId = `sub-${v.id}`;
        await setDoc(doc(db, 'subscriptions', subId), {
          plan,
          vendorName: v.stallName,
          amount: plan === 'Free' ? 0 : plan === 'Starter' ? 2000 : plan === 'Growth' ? 5000 : 9999,
          renewalDate: '2026-12-31',
          activeSince: v.createdDate || '2025-01-12',
          autoRenew: true
        });
      });
    }

    // Seed default admin access list (including user's government tester role)
    const adminColRef = collection(db, 'admins');
    const adminSnap = await getDocs(query(adminColRef, limit(1)));
    if (adminSnap.empty) {
      console.log(`[Firebase Seeding] Seeding admin roster list...`);
      const defaultAdmins = [
        { email: 'admin@foodcourtai.gov.in', name: 'Bala Addala', role: 'Super Admin' },
        { email: 'addala.bala@gmail.com', name: 'Bala Admin', role: 'Super Admin' },
        { email: 'officer@muni.gov.in', name: 'Karthik S', role: 'City Admin' }
      ];
      for (const adm of defaultAdmins) {
        // Use clean email as ID or custom format
        const idSafeEmail = adm.email.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'admins', idSafeEmail), adm);
      }
    }

  } catch (error) {
    console.error('[Firebase Seeding] Failed booting seeding queue: ', error);
  }
}
