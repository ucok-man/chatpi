import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "../prisma/generated/client";

dotenv.config({
  path: [".env", ".env.development", ".env.production"],
});

const AVATAR_TOP_TYPES = [
  "NoHair",
  "Eyepatch",
  "Hat",
  "Hijab",
  "Turban",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
  "LongHairBigHair",
  "LongHairBob",
  "LongHairBun",
  "LongHairCurly",
  "LongHairCurvy",
  "LongHairDreads",
  "LongHairFrida",
  "LongHairFro",
  "LongHairFroBand",
  "LongHairNotTooLong",
  "LongHairShavedSides",
  "LongHairMiaWallace",
  "LongHairStraight",
  "LongHairStraight2",
  "LongHairStraightStrand",
  "ShortHairDreads01",
  "ShortHairDreads02",
  "ShortHairFrizzle",
  "ShortHairShaggyMullet",
  "ShortHairShortCurly",
  "ShortHairShortFlat",
  "ShortHairShortRound",
  "ShortHairShortWaved",
  "ShortHairSides",
  "ShortHairTheCaesar",
  "ShortHairTheCaesarSidePart",
];

const AVATAR_FACIAL_HAIR_TYPES = [
  "Blank",
  "BeardMedium",
  "BeardLight",
  "BeardMajestic",
  "MoustacheFancy",
  "MoustacheMagnum",
];

const AVATAR_FACIAL_HAIR_COLORS = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "Platinum",
  "Red",
];

const AVATAR_CLOTHES_TYPES = [
  "BlazerShirt",
  "BlazerSweater",
  "CollarSweater",
  "GraphicShirt",
  "Hoodie",
  "Overall",
  "ShirtCrewNeck",
  "ShirtScoopNeck",
  "ShirtVNeck",
];

const AVATAR_EYE_TYPES = [
  "Close",
  "Cry",
  "Default",
  "Dizzy",
  "EyeRoll",
  "Happy",
  "Hearts",
  "Side",
  "Squint",
  "Surprised",
  "Wink",
  "WinkWacky",
];

const AVATAR_EYE_BROW_TYPES = [
  "Angry",
  "AngryNatural",
  "Default",
  "DefaultNatural",
  "FlatNatural",
  "RaisedExcited",
  "RaisedExcitedNatural",
  "SadConcerned",
  "SadConcernedNatural",
  "UnibrowNatural",
  "UpDown",
  "UpDownNatural",
];

const AVATAR_MOUT_TYPES = [
  "Concerned",
  "Default",
  "Disbelief",
  "Eating",
  "Grimace",
  "Sad",
  "ScreamOpen",
  "Serious",
  "Smile",
  "Tongue",
  "Twinkle",
  "Vomit",
];

const AVATAR_SKIN_COLORS = [
  "Tanned",
  "Yellow",
  "Pale",
  "Light",
  "Brown",
  "DarkBrown",
  "Black",
];

export const AVATAR_ACCESSORIES_TYPES = [
  "Blank",
  "Kurt",
  "Prescription01",
  "Prescription02",
  "Round",
  "Sunglasses",
  "Wayfarers",
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toQueryString(params: Record<string, string>) {
  const usp = new URLSearchParams(params);
  return usp.toString();
}

export function randomAvatarUrl() {
  const props = {
    avatarStyle: "Transparent",
    topType: pickRandom(AVATAR_TOP_TYPES),
    facialHairType: pickRandom(AVATAR_FACIAL_HAIR_TYPES),
    facialHairColor: pickRandom(AVATAR_FACIAL_HAIR_COLORS),
    clotheType: pickRandom(AVATAR_CLOTHES_TYPES),
    eyeType: pickRandom(AVATAR_EYE_TYPES),
    eyebrowType: pickRandom(AVATAR_EYE_BROW_TYPES),
    mouthType: pickRandom(AVATAR_MOUT_TYPES),
    skinColor: pickRandom(AVATAR_SKIN_COLORS),
    accessoriesType: pickRandom(AVATAR_ACCESSORIES_TYPES),
  };

  const query = toQueryString(props);
  return `https://avataaars.io/?${query}`;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 3 * 60 * 1000,
});
const db = new PrismaClient({
  adapter,
  transactionOptions: {
    timeout: 3 * 60 * 1000,
  },
});

async function main() {
  const userinputs = [
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Michael Johnson", email: "michael.johnson@example.com" },
    { name: "Emily Davis", email: "emily.davis@example.com" },
    { name: "Daniel Wilson", email: "daniel.wilson@example.com" },
    { name: "Sophia Martinez", email: "sophia.martinez@example.com" },
    { name: "David Anderson", email: "david.anderson@example.com" },
    { name: "Olivia Thomas", email: "olivia.thomas@example.com" },
    { name: "William Harris", email: "william.harris@example.com" },
    { name: "Ava Clark", email: "ava.clark@example.com" },
    { name: "James Lewis", email: "james.lewis@example.com" },
    { name: "Mia Walker", email: "mia.walker@example.com" },
    { name: "Benjamin Young", email: "benjamin.young@example.com" },
    { name: "Isabella King", email: "isabella.king@example.com" },
    {
      name: "Alexander Wright",
      email: "alexander.wright@example.com",
    },
  ];

  const password =
    "418273f35b6412858448deb9b265067b:ffc4e79b2aad698663a182e3d4fe4872659b21e7aecd5dbce7b6cd55672e62afbf06367276fe19104d115e30408fd0066a937d3e3f25559d24a122e74eee95b8"; // @Password123

  await db.$transaction(async (tx) => {
    const users = await Promise.all(
      userinputs.map(async (u) => {
        return await tx.user.create({
          data: {
            name: u.name,
            email: u.email,
            image: randomAvatarUrl(),
            emailVerified: true,
          },
        });
      })
    );

    const account = await tx.account.createMany({
      data: users.map((u) => ({
        accountId: u.id,
        providerId: "credential",
        password: password,
        userId: u.id,
      })),
    });
  });
}
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
