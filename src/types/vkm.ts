export type VKMLevel = "NLQF5" | "NLQF6";
export type VKMLocation = "Breda" | "Den Bosch" | "Tilburg" | "Den Bosch en Tilburg" | "Breda en Den Bosch";
export type VKMStudyCredit = 15 | 30;

export interface VKMModule {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  studyCredit: VKMStudyCredit;
  location: VKMLocation;
  contactId: string;
  level: VKMLevel;
  learningOutcomes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isFavorited: boolean;
}

export interface VKMFilters {
  location?: VKMLocation;
  level?: VKMLevel;
  studyCredit?: VKMStudyCredit;
  isActive?: boolean;
  search?: string;
}
