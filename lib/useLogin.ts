"use client";

import {  useApolloClient, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { LOGIN_MUTATION } from "@/graphQL/Mutation/Mutation";



export function useLogin() {
  const client = useApolloClient();
  const router = useRouter();
  const [loginMutation] = useMutation(LOGIN_MUTATION,{
    onError: (error) => {
      console.error("Login error:", error);
      return error;
    
      
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data && data.login) {
        const {token, refreshToken, user} = data.login;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        
        console.log("Token diterima:", token);
        console.log("Refresh Token diterima:", refreshToken);
        console.log("User:", user);

        await client.resetStore();
        localStorage.setItem("user", JSON.stringify(data.login.user));
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
  
    }
  };

  return { login };
}
