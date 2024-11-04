"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GET_FAMILY_MEMBERS } from "@/graphQL/Query/Query";

import formatDate from "@/lib/dateConvert";
// import calculateAge  from '@/lib/dateConvert';
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

type FamilyMember = {
  id: string;
  FullName: string;
  Gender: string;
  Category: string;
  FamilyPosition: string;
  BirthDate: string;
};

const FamilyMembersPage = () => {
  const params = useParams();
  const id = params.id;

  const { loading, error, data } = useQuery(GET_FAMILY_MEMBERS, {
    variables: { queryGetFamilyByIdId: id },
    skip: !id,
  });

  console.log("DATAAAAAAAAAAAAAAAAA ", data?.queryGetFamilyByID)

  if (!id) {  
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1>NO ID FOUND</h1>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const familyMembers = data?.queryGetFamilyByID?.FamilyMembers || [];

  if(familyMembers.length === 0){
    return ( 
      <div className="container mx-auto p-4 max-w-2xl">
        <h1>Something went wrong</h1>
      </div>
    )
  }

  console.log("Family Members:", familyMembers);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        Data Keluarga <span>Keluarga</span>
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Family Position</TableHead>
            <TableHead>Birth Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {familyMembers.map((member: FamilyMember) => (
            <TableRow key={member.id}>
              <TableCell>
                <Link href={`/viewdata/${id}/${member.id}`}>
                  {member.FullName}
                </Link>
              </TableCell>

              <TableCell>{member.Gender}</TableCell>
              <TableCell>{member.Category}</TableCell>
              <TableCell>{member.FamilyPosition}</TableCell>
              <TableCell>
                {(() => {
                  const birthDate = parseInt(member.BirthDate);
                  const formattedDate = formatDate(birthDate);

                  return <>{formattedDate}</>;
                })()}
              </TableCell>
              <TableCell>
                <Link href={`/inputdatabase/inputmember/${member.id}`}>
                  <Button variant="outline" size="sm">
                    <Pencil1Icon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FamilyMembersPage;
