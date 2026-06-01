import { Activity, BackendGroup } from "@/lib/data";
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
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let response: Response;

    try {
        response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    } catch {
        throw new ApiError("Erreur de connexion, veuillez réessayer.", 0);
    }

    if (response.status === 401 || response.status === 403) {
        clearSession();
        window.location.href = "/connexion?session=expired";
        throw new ApiError("Votre session a expiré.", response.status);
    }

    if (response.status >= 500) {
        throw new ApiError("Une erreur est survenue, veuillez réessayer plus tard.", response.status);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new ApiError(data.message || "Une erreur est survenue.", response.status);
    }

    return data as T;
}

export async function loginApi(email: string, password: string) {
    return apiRequest<{ token: string; user: object }>("/api/auth/login", {
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
}) {
    return apiRequest<{ token: string; user: object }>("/api/auth/register", {
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

export async function updateProfileApi(_userId: number, data: { firstName?: string; lastName?: string; city?: string; origin?: string; birthDate?: string; language?: string; interests?: string[] }) {
    return apiRequest(`/api/users/me`, { method: "PUT", body: JSON.stringify(data) });
}

export async function getActivitiesApi(city?: string, category?: string) {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (category) params.append("category", category);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Activity[]>(`/api/activities${query}`, { method: "GET" });
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