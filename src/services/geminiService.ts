/**
 * Gemini AI Integration Client Services
 * Coordinates requests from the food administrative dashboard to the custom full-stack server endpoints.
 */

export interface HygienePhotoResult {
  vendorId: string;
  vendorName: string;
  aiPhotoScore: number;
  foodSafetyStatus: 'Pass' | 'Fail';
  findings: string[];
  timestamp: string;
  hazardCount: number;
  inspectorAlertTriggered: boolean;
  confidence: number;
}

export interface ReviewSpamResult {
  id: string;
  text: string;
  user: string;
  isSpam: boolean;
  confidence: number;
  reason: string;
}

export interface FakeReviewResponse {
  success: boolean;
  mode: string;
  spamCount: number;
  analyzedReviews: ReviewSpamResult[];
}

export interface VendorRiskResult {
  riskLevel: 'Safe' | 'Medium Risk' | 'High Risk';
  recommendedAction: string;
  explanation: string;
  confidence: number;
}

export interface HiddenGemResult {
  stallName: string;
  underRatedFactor: string;
  spikeProbability: string;
  sentimentScore: number;
  gemClassification: string;
  suggestedCampaign: string;
  confidence: number;
}

export interface SearchTrendsResult {
  success: boolean;
  mode: string;
  summary: string;
  activeFads: string[];
  zoningSuggestion: string;
  confidence: number;
}

export interface ContentModerationResult {
  success: boolean;
  mode: string;
  status: 'Approved' | 'Flagged' | 'Removed';
  confidence: number;
  reason: string;
  safesensors?: {
    medical: string;
    violence: string;
    unhygienicSigns: string;
  };
}

export interface ZoneInsightsResult {
  success: boolean;
  mode: string;
  congestionWarning: string;
  recommendation: string;
  safetyIncidentRating: string;
  forecastDemand: string;
  confidence: number;
}

export interface ComplaintClassificationResult {
  success: boolean;
  mode: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  issueCategory: string;
  dispatchedUnit: string;
  automatedResponseDraft: string;
  confidence: number;
}

// ----------------------------------------------------------------------------
// SERVICE FUNCTIONS
// ----------------------------------------------------------------------------

export async function analyzeHygienePhoto(
  vendorId: string,
  vendorName: string,
  photoUrl: string,
  mockOnly = false
): Promise<HygienePhotoResult> {
  const res = await fetch('/api/ai/hygiene-photo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorId, vendorName, photoUrl, mockOnly }),
  });
  if (!res.ok) throw new Error(`Hygiene scanner failed: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

export async function detectFakeReviews(
  vendorName: string,
  reviews: any[],
  mockOnly = false
): Promise<FakeReviewResponse> {
  const res = await fetch('/api/ai/fake-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorName, reviews, mockOnly }),
  });
  if (!res.ok) throw new Error(`Fake review scan failed: ${res.statusText}`);
  return res.json();
}

export async function getVendorRiskScore(
  vendorId: string,
  vendorName: string,
  hygieneScore: number,
  onboardingStatus: string,
  complaintsCount: number,
  mockOnly = false
): Promise<VendorRiskResult> {
  const res = await fetch('/api/ai/vendor-risk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorData: { vendorId, vendorName, hygieneScore, onboardingStatus, complaintsCount },
      mockOnly,
    }),
  });
  if (!res.ok) throw new Error(`Risk scorer failed: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

export async function getHiddenGemsDetail(
  vendor: any,
  reviews: any[],
  mockOnly = false
): Promise<HiddenGemResult> {
  const res = await fetch('/api/ai/hidden-gems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendor, reviews, mockOnly }),
  });
  if (!res.ok) throw new Error(`Hidden gem predictor failed: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

export async function summarizeSearchTrends(
  trends: any[],
  mockOnly = false
): Promise<SearchTrendsResult> {
  const res = await fetch('/api/ai/search-trends', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trends, mockOnly }),
  });
  if (!res.ok) throw new Error(`Search trends summary failed: ${res.statusText}`);
  return res.json();
}

export async function checkContentModeration(
  post: any,
  mockOnly = false
): Promise<ContentModerationResult> {
  const res = await fetch('/api/ai/content-moderation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post, mockOnly }),
  });
  if (!res.ok) throw new Error(`Content moderation failed: ${res.statusText}`);
  return res.json();
}

export async function getZoneIntelligence(
  zoneId: string,
  zoneName: string,
  crowdLevel: string,
  trafficIntensity: string,
  activeVendorsCount: number,
  mockOnly = false
): Promise<ZoneInsightsResult> {
  const res = await fetch('/api/ai/zone-insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zone: { id: zoneId, name: zoneName, crowdLevel, trafficIntensity, activeVendorsCount },
      mockOnly,
    }),
  });
  if (!res.ok) throw new Error(`Zone insights query failed: ${res.statusText}`);
  return res.json();
}

export async function classifyComplaintTicket(
  complaintId: string,
  complaintText: string,
  mockOnly = false
): Promise<ComplaintClassificationResult> {
  const res = await fetch('/api/ai/complaint-classification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaintId, complaintText, mockOnly }),
  });
  if (!res.ok) throw new Error(`Complaint classification failed: ${res.statusText}`);
  return res.json();
}
