// auth.config.ts
import type { AuthConfig } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    nextAuthLogin(Email: $email, Password: $password) {
      success
      error
      user {
        id
        Email
        Member {
          id
          FullName
          Category
          Role
          IsLeaders
        }
      }
    }
  }
`;

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              email: credentials?.email,
              password: credentials?.password
            }
          });

          const result = data.nextAuthLogin;

          if (!result.success) {
            return null;
          }

          const user = result.user;
          
          return {
            id: user.id,
            email: user.Email,
            memberData: user.Member
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.memberData = user.memberData;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
          email: token.email,
          memberData: token.memberData,
        }
      };
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET
} satisfies AuthConfig;