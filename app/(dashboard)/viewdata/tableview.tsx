"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_FAMILY_QUERY } from "@/graphQL/Query/Query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Family = {
  id: string;
  FamilyName: string;
  Rayon: number;
  KSP: string;
  Address: string;
};

import React from "react";
import { TableSkeleton } from "./tableSkeleton";
import Link from "next/link";

const TableView = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, error, data } = useQuery(GET_ALL_FAMILY_QUERY);

  const family = data?.queryGetFamily;

  if (loading) return <TableSkeleton />;

  if (error) return <div>{error.message}</div>;



  return (
    <div className="contsiner mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Family Name</TableHead>
            <TableHead>Rayon</TableHead>
            <TableHead>KSP</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {family.map((family: Family) => (
            <TableRow key={family.id}>
              <TableCell>
                <Link href={`/viewdata/${family.id}`}>{family.FamilyName}</Link>
              </TableCell>

              <TableCell>{family.Rayon}</TableCell>
              <TableCell>{family.KSP}</TableCell>
              <TableCell>{family.Address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;
