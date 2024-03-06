export interface PaginatedList<Type> {
  data: Type[];
  meta: {
    limit: number;
    offset: number;
    total: number;
  };
}
