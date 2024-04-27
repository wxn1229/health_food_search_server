export interface SearchRequest {
  keypoint?: string;
  id?: string;
  start_date?: {
    calendar: { identifier: string };
    era: string;
    year: number;
    month: number;
    day: number;
  };
  end_date?: {
    calendar: { identifier: string };
    era: string;
    year: number;
    month: number;
    day: number;
  };
  applicant?: string;
  certification?: string;
  ingredient?: string;
  benefit?: string;
  start_rate_point?: number;
  end_rate_point?: number;
}

export interface QueryHealthFoodConditions {
  Name?: string;
  Id?: string;
  ApplicantId?: string;
  CFId?: string;
}
