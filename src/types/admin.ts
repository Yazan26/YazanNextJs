export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVKMData {
  name: string;
  shortDescription: string;
  description: string;
  content: string;
  studyCredit: 15 | 30;
  location: string;
  contactId: string;
  level: "NLQF5" | "NLQF6";
  learningOutcomes: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: string;
}

export interface UserWithFavorites extends AdminUser {
  favoriteVKMs?: Array<{
    id: string;
    name: string;
    shortDescription: string;
  }>;
}
