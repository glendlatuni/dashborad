"use client";
import { GET_FAMILY_QUERY } from "@/graphQL/Query/Query";
import { useQuery } from "@apollo/client";
import router from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const { loading, error } = useQuery(GET_FAMILY_QUERY);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
  }, []);

  if (error) {
    <div>{error.message}</div>;
  }
  if (loading) return <div>Loading</div>;

  return (
    <>
      <h1>
        Selamat datang
        {user.Member.Category === "PKB"
          ? ` Bapak ${user.Member.FullName.split(" ")[0]}`
          : user.Member.Category === "PW"
          ? ` Ibu ${user.Member.FullName.split(" ")[0]}`
          : user.Member.Category === "PAM"
          ? ` Saudara ${user.Member.FullName.split(" ")[0]}`
          : user.Member.Category === "PAR"
          ? ` Anak ${user.Member.FullName.split(" ")[0]}`
          : user.Member.FullName.split(" ")[0]}
      </h1>
    </>
  );
}
