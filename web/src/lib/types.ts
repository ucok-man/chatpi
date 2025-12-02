export type User = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  email: string;
  emailVerified: boolean;
  role: string;
};

export type Metadata = {
  total: number;
  pageSize: number;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
};
