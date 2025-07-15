export type IProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
};

export type IProductFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
};
