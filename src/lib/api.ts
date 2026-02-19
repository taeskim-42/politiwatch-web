const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

// Auth
export function register(email: string, password: string, nickname: string) {
  return request<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, nickname }),
  });
}

export function login(email: string, password: string) {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Persons
export function getPersons(query?: string, electionType?: string) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (electionType) params.set("electionType", electionType);
  const qs = params.toString();
  return request<Person[]>(`/persons${qs ? `?${qs}` : ""}`);
}

export function getPerson(id: string) {
  return request<Person>(`/persons/${id}`);
}

export function getPersonClips(id: string) {
  return request<Clip[]>(`/persons/${id}/clips`);
}

// Clips
export function getRecentClips() {
  return request<Clip[]>("/clips");
}

export function createClip(
  data: {
    personId: string;
    videoUrl: string;
    timestamp?: string;
    description: string;
    clipDate: string;
  },
  token: string
) {
  return request<Clip>("/clips", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

// Types
export interface User {
  id: string;
  email: string;
  nickname: string;
}

export interface Person {
  id: string;
  name: string;
  party: string;
  position: string;
  electionType: string;
  clipCount?: number;
}

export interface Clip {
  id: string;
  personId: string;
  personName?: string;
  videoUrl: string;
  timestamp?: string;
  description: string;
  clipDate: string;
  createdAt: string;
}
