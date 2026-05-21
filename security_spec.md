# Security Specification: Food Court AI Telemetry Guard

This document outlines the attribute-based access control guidelines and strict database validation principles for the Firestore collections.

## 1. Core Data Invariants

1. **Relation Consistency (REL)**: A vendor record must have a valid `zoneId` pointing to an existing municipal boundary document.
2. **Access Control (RBAC)**: All administrative states (approvals, suspensions, inspector assignments) are restricted to users registered under the `/admins` collection. Users cannot elevate their own roles.
3. **Operational Immutability (IMM)**: Records like `createdAt` and user email linkages cannot be changed once written.
4. **Validation Blueprints (VAL)**: Values such as sizes of strings, limits of counts, scores between boundaries (0-100) must be validated.
5. **PII Sandboxing**: Inspection records, full stall owner phone numbers, and license papers must be read-restricted to prevent leakages to anonymous public searches.

---

## 2. The "Dirty Dozen" Poison Payloads

The following payloads attempt to breach security boundaries and must be blocked with `PERMISSION_DENIED`.

1. **Privilege Overwrite**: An authenticated user writing to `/admins/user_uid` with role `Super Admin` to gain admin status.
2. **Ghost Vendor Registration**: Creating a vendor document with a forged `id` string containing 2KB of random characters.
3. **Direct Approval Shortrouting**: A vendor updating their own `onboardingStatus` directly from `Pending` to `Approved` to bypass inspections.
4. **State Backdoor Lockoutout**: A suspended vendor updating their `status` directly to `Active` or changing `riskLevel` to `Low` bypassing audits.
5. **Rating Forgery (Boundary Breach)**: Submitting a hygiene scoring update with `inspectorReviewScore: 9999` to cheat health ratings.
6. **Orphaned Order Creation**: Creating an order referenced to a non-existent vendor.
7. **Abuse Complaint Creation**: Forging a public complaint that sets `priority: "Critical"` with forged assignees.
8. **Malicious Analytics Spawns**: Creating simulated insights in forbidden collection branches.
9. **Fake AI Detection Overriding**: Submitting spoofed automated alerts stating `resolved: true` when only administrators are allowed to resolve threats.
10. **Zoning Collision Override**: Disabling a central food market active zone bypass.
11. **Impersonating a Health Inspector**: Modifying an inspector's assigned vendor checklist or current active inspector zones.
12. **PII Traversal Scam**: Traversing and scraping private owner phone numbers without being registered as an admin.

---

## 3. The Test Runner Reference

A typical `firestore.rules.test.ts` scenario validates these payloads against the security rules.

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Food Court AI Telemetry Guard Security tests', () => {
  it('forbids normal users from writing their admin status', async () => {
    const db = testEnv.authenticatedContext('malicious_user_id').firestore();
    await assertFails(
      db.doc('admins/malicious_user_id').set({ role: 'Super Admin', name: 'Malicious' })
    );
  });
  
  it('forbids untrusted onboarding state updates', async () => {
    const db = testEnv.authenticatedContext('vendor_id').firestore();
    await assertFails(
      db.doc('vendors/v-1').update({ onboardingStatus: 'Approved' })
    );
  });
});
```
