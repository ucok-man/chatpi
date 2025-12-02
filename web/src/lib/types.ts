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

export type Room = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  roomType: "private";
  lastMessageId: string | null;
};

export type Message = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  content: string | null;
  roomId: string;
  senderId: string;
  replyToId: string | null;
};
