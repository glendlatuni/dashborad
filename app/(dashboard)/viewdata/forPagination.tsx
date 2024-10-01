'use client'

import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const GET_FAMILIES = gql`
  query GetFamilies($rayon: Int!, $page: Int!, $pageSize: Int!) {
    queryGetFamilyPagination(rayon: $rayon, page: $page, pageSize: $pageSize) {
      data {
        id
        FamilyMembers {
          id
          FullName
          Category
          Gender
          IsLeaders
          BirthPlace
          BirthDate
        }
      }
      totalCount
      totalPages
    }
  }
`

export default function FamilyTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [rayon, setRayon] = useState(1) // Assuming rayon 1 as default
  const [sortLetter, setSortLetter] = useState('')

  const { loading, error, data } = useQuery(GET_FAMILIES, {
    variables: { rayon, page, pageSize },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const { data: families, totalCount, totalPages } = data.queryGetFamilyPagination

  const sortedFamilies = families.slice().sort((a, b) => {
    if (sortLetter) {
      const aName = a.FamilyMembers[0]?.FullName || ''
      const bName = b.FamilyMembers[0]?.FullName || ''
      if (aName.charAt(0).toLowerCase() === sortLetter.toLowerCase() && bName.charAt(0).toLowerCase() !== sortLetter.toLowerCase()) return -1
      if (aName.charAt(0).toLowerCase() !== sortLetter.toLowerCase() && bName.charAt(0).toLowerCase() === sortLetter.toLowerCase()) return 1
    }
    return 0
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Family Table</h2>
        <Select value={sortLetter} onValueChange={setSortLetter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by first letter" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
              <SelectItem key={letter} value={letter.toLowerCase()}>{letter}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Is Leader</TableHead>
            <TableHead>Birth Place</TableHead>
            <TableHead>Birth Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFamilies.map((family) => (
            family.FamilyMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.FullName}</TableCell>
                <TableCell>{member.Category}</TableCell>
                <TableCell>{member.Gender}</TableCell>
                <TableCell>{member.IsLeaders ? 'Yes' : 'No'}</TableCell>
                <TableCell>{member.BirthPlace}</TableCell>
                <TableCell>{formatDate(member.BirthDate)}</TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalCount} total families
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            <input
              className="w-12 h-8 text-center border rounded"
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => setPage(Math.min(Math.max(1, parseInt(e.target.value) || 1), totalPages))}
            />
            <span className="text-sm text-muted-foreground">
              of {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}