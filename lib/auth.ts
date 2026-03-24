import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Demo users for MVP (replace with Convex DB in production)
const DEMO_USERS = [
  {
    id: "user_admin_001",
    name: "Dr. Admin User",
    email: "admin@davshon.com",
    password: "admin123",
    role: "admin",
    image: null,
  },
  {
    id: "user_doc_001",
    name: "Dr. James Wilson",
    email: "doctor@davshon.com",
    password: "doctor123",
    role: "doctor",
    image: null,
  },
  {
    id: "user_nurse_001",
    name: "Nurse Sarah Johnson",
    email: "nurse@davshon.com",
    password: "nurse123",
    role: "nurse",
    image: null,
  },
  {
    id: "user_rec_001",
    name: "Mary Receptionist",
    email: "receptionist@davshon.com",
    password: "rec123",
    role: "receptionist",
    image: null,
  },
  {
    id: "user_lab_001",
    name: "Lab Tech Tom",
    email: "lab@davshon.com",
    password: "lab123",
    role: "lab_technician",
    image: null,
  },
  {
    id: "user_pharm_001",
    name: "Pharmacist Alice",
    email: "pharmacist@davshon.com",
    password: "pharm123",
    role: "pharmacist",
    image: null,
  },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
