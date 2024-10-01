'use client';
import {  useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_FAMILY_MEMBERS } from '@/graphQL/Query/Query';
import { Key } from 'react';
import  formatDate from '@/lib/dateConvert';
import calculateAge  from '@/lib/dateConvert';
import React from 'react';
import Link from 'next/link';

interface FamilyMember {
    id: string;
    FullName: string;
    Gender: string;
    Category: string;
    FamilyPosition: string;
    BirthDate: string;
  }


const FamilyMembersPage = () => {
   


  const params = useParams();
  const  id  = params.id

  const { loading, error, data } = useQuery(GET_FAMILY_MEMBERS, {
    variables: { queryGetFamilyByIdId: id },
    skip: !id,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const familyMembers = data?.queryGetFamilyByID?.FamilyMembers || [];



  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Family Members</h1>
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
          {familyMembers.map((member : FamilyMember) => (
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
    const age = calculateAge(birthDate);
    
    return (
      <>
        {formattedDate}
        <br />
        <span className="text-sm text-gray-500">
          ({age} tahun)
        </span>
      </>
    );
  })()}
</TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FamilyMembersPage;