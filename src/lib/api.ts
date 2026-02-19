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
export async function getPersons(query?: string, electionType?: string) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (electionType) params.set("electionType", electionType);
  const qs = params.toString();
  const data = await request<{ persons: Person[] }>(`/persons${qs ? `?${qs}` : ""}`);
  return data.persons;
}

export async function getPerson(id: string) {
  const data = await request<{ person: Person }>(`/persons/${id}`);
  return data.person;
}

export async function getPersonClips(id: string) {
  const data = await request<{ clips: Clip[] }>(`/persons/${id}/clips`);
  return data.clips;
}

// Clips
export async function getRecentClips() {
  const data = await request<{ clips: Clip[] }>("/clips");
  return data.clips;
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
