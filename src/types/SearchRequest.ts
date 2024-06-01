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
  Name?: { contains: string };
  Id?: string;
  ApplicantId?: string;
  CFId?: string;
  AcessDate?: { gte: Date; lte: Date };
}

export interface QueryIngredientConditions {
  IGId?: string;
}

export interface QueryBenefitConditions {
  BFId?: string;
}

export interface OrderByConditions {
  Id?: "asc" | "desc";
  CurCommentNum?: "asc" | "desc";
  CurPoint?: "asc" | "desc";
  AcessDate?: "asc" | "desc";
}
