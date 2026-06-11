import { Activity, BackendGroup, Friend, FriendRequest, FriendStatus, Message } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseResponseBody(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function getApiMessage(data: unknown, fallback: string) {
  const raw = data as { message?: string; error?: string };
  return raw?.message || raw?.error || fallback;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new ApiError("Impossible de joindre le serveur API. Vérifie que le backend tourne sur le bon port.", 0);
  }

  const data = await parseResponseBody(response);
  const isAuthEndpoint = endpoint === "/api/auth/login" || endpoint === "/api/auth/register";

  if ((response.status === 401 || response.status === 403) && !isAuthEndpoint) {
    clearSession();
    if (typeof window !== "undefined") window.location.href = "/connexion?session=expired";
    throw new ApiError("Votre session a expiré.", response.status, data);
  }

  if (response.status >= 500) {
    throw new ApiError(getApiMessage(data, "Le serveur API a renvoyé une erreur interne."), response.status, data);
  }

  if (!response.ok) {
    throw new ApiError(getApiMessage(data, "Une erreur est survenue."), response.status, data);
  }

  return data as T;
}

export async function loginApi(email: string, password: string) {
  return apiRequest<{ token: string; user: Record<string, unknown> }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(form: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  origin?: string;
  birthDate?: string;
}) {
  return apiRequest<{ token: string; user: Record<string, unknown> }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export async function forgotPasswordApi(email: string) {
  return apiRequest<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function joinGroupApi(groupId: number) {
  return apiRequest(`/api/groups/${groupId}/join`, { method: "POST" });
}

export async function leaveGroupApi(groupId: number) {
  return apiRequest(`/api/groups/${groupId}/leave`, { method: "DELETE" });
}

export async function createGroupApi(data: object) {
  return apiRequest("/api/groups", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteGroupApi(groupId: number) {
  return apiRequest(`/api/groups/${groupId}`, { method: "DELETE" });
}

export async function updateProfileApi(
  _userId: number,
  data: {
    firstName?: string;
    lastName?: string;
    city?: string;
    origin?: string;
    birthDate?: string;
    language?: string;
    interests?: string[];
  },
) {
  return apiRequest(`/api/users/me`, { method: "PUT", body: JSON.stringify(data) });
}

export async function getActivitiesApi(city?: string, category?: string) {
  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (category) params.append("category", category);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<Activity[]>(`/api/activities${query}`, { method: "GET" });
}

export async function createActivityApi(data: {
  title: string;
  description: string;
  category: string;
  city: string;
}) {
  return apiRequest<Activity>("/api/activities", { method: "POST", body: JSON.stringify(data) });
}

export async function getActivityByIdApi(activityId: number) {
  return apiRequest<Activity>(`/api/activities/${activityId}`, { method: "GET" });
}

export async function getMyGroupsApi() {
  return apiRequest("/api/users/me/groups", { method: "GET" });
}

export async function getGroupByIdApi(groupId: number) {
  return apiRequest<BackendGroup>(`/api/groups/${groupId}`, { method: "GET" });
}

export async function getUserByIdApi(userId: number) {
  return apiRequest<Record<string, unknown>>(`/api/users/${userId}`, { method: "GET" });
}

export async function sendFriendRequestApi(userId: number) {
  return apiRequest(`/api/friends/request/${userId}`, { method: "POST" });
}

export async function acceptFriendRequestApi(requestId: number) {
  return apiRequest(`/api/friends/accept/${requestId}`, { method: "PUT" });
}

export async function refuseFriendRequestApi(requestId: number) {
  return apiRequest(`/api/friends/refuse/${requestId}`, { method: "PUT" });
}

export async function getFriendsApi() {
  return apiRequest<Friend[]>("/api/friends", { method: "GET" });
}

export async function getFriendRequestsApi() {
  return apiRequest<FriendRequest[]>("/api/friends/requests", { method: "GET" });
}

export async function getFriendStatusApi(userId: number) {
  return apiRequest<FriendStatus>(`/api/friends/status/${userId}`, { method: "GET" });
}

export async function getGroupMessagesApi(groupId: number) {
  return apiRequest<Message[]>(`/api/messages/group/${groupId}`, { method: "GET" });
}

export async function getPrivateMessagesApi(userId: number) {
  return apiRequest<Message[]>(`/api/messages/private/${userId}`, { method: "GET" });
}

export async function sendMessageApi(data: { content: string; group_id?: number; receiver_id?: number }) {
  return apiRequest<Message>("/api/messages", { method: "POST", body: JSON.stringify(data) });
}
