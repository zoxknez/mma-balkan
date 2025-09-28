import { apiClient, API_CONFIG, buildQueryParams, type ApiResponse } from "./client";

export type Club = {
  id: string;
  name: string;
  city: string;
  country: string;
  address?: string | null;
  website?: string | null;
  phone?: string | null;
  members?: number | null;
};

export type ClubQuery = Partial<{
  page: number;
  limit: number;
  search: string;
  city: string;
  country: string;
}>;

export async function getClubs(params: ClubQuery = {}): Promise<ApiResponse<Club[]>> {
  const qs = buildQueryParams(params);
  return apiClient.get<Club[]>(`${API_CONFIG.ENDPOINTS.CLUBS}${qs}`);
}

export async function getClubById(id: string): Promise<ApiResponse<Club>> {
  return apiClient.get<Club>(API_CONFIG.ENDPOINTS.CLUB_BY_ID(id));
}

const ClubAPI = { getClubs, getClubById };
export default ClubAPI;
