export interface FdcNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber?: string;
  unitName?: string;
  value?: number;
}

export interface FdcLabelNutrients {
  calories?: {
    unit?: string;
    value?: number;
  };
}

export interface FdcFoodPortion {
  gramWeight?: number;
  amount?: number;
  modifier?: string;
  measureUnit?: {
    abbreviation?: string;
  };
  portionDescription?: string;
}

export interface FdcFoodItem {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  labelNutrients?: FdcLabelNutrients;
  foodPortions?: FdcFoodPortion[];
  foodNutrients?: FdcNutrient[];
}

export interface FdcSearchResponse {
  foods?: FdcFoodItem[];
  totalHits?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface FdcSearchParams {
  query: string;
  pageSize: number;
  pageNumber: number;
}
