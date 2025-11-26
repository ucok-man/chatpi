import { relations } from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// User table
export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Session table
export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Account table
export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Verification table
export const verification = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room table
export const RoomTypeValue = ["private"] as const;
export const RoomTypeEnum = pgEnum("room_type", RoomTypeValue);

export const room = pgTable("room", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  roomType: RoomTypeEnum("room_type").notNull(),
  lastMessageId: uuid("last_message_id"),
});

// Room participants junction table
export const roomParticipant = pgTable("room_participant", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Message table
export const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  content: text("content"),
  image: text("image"),

  roomId: uuid("room_id")
    .notNull()
    .references(() => room.id, { onDelete: "cascade" }),

  senderId: uuid("sender_id")
    .notNull()
    .references(() => user.id),

  replyToId: uuid("reply_to_id").references((): AnyPgColumn => message.id),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  session: many(session),
  account: many(account),
  createdRoom: many(room),
  sentMessage: many(message),
  roomParticipant: many(roomParticipant),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const roomRelations = relations(room, ({ one, many }) => ({
  lastMessage: one(message, {
    fields: [room.lastMessageId],
    references: [message.id],
  }),
  participants: many(roomParticipant),
  message: many(message),
}));

export const roomParticipantRelations = relations(
  roomParticipant,
  ({ one }) => ({
    room: one(room, {
      fields: [roomParticipant.roomId],
      references: [room.id],
    }),
    user: one(user, {
      fields: [roomParticipant.userId],
      references: [user.id],
    }),
  })
);

export const messageRelations = relations(message, ({ one }) => ({
  room: one(room, {
    fields: [message.roomId],
    references: [room.id],
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
  replyTo: one(message, {
    fields: [message.replyToId],
    references: [message.id],
  }),
}));

// TypeScript types
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Room = typeof room.$inferSelect;
export type RoomParticipant = typeof roomParticipant.$inferSelect;
export type NewroomParticipant = typeof roomParticipant.$inferInsert;
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
