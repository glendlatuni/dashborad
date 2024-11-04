'use client'

import { useParams } from "next/navigation"
import { useQuery } from "@apollo/client"
import { GET_MEMBER_BY_ID } from "@/graphQL/Query/Query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, User } from "lucide-react"
import formatDate from "@/lib/dateConvert"

interface isLeader {
  id : string
  onDuty: boolean
  Title: string
}

interface Schedule {
  id: string
  Day: string
  Date: string
  Category: string
  Month: string
  Time: string
  Years: string
}

interface FamilyMember  {
  id: string
  FullName: string
  Gender: string
  Category: string
  FamilyPosition: string
  BirthDate: string
  BirthPlace: string
  Leaders: boolean
  Liturgos: boolean
  IsLeaders: isLeader[]
  Schedule: Schedule[]
  Role: string
}

export default function ProfilePage() {
  const params = useParams()
  const memberId = params.memberId

  const { loading, error, data } = useQuery(GET_MEMBER_BY_ID, {
    variables: { getMemberByIdId: memberId },
    skip: !memberId,
  })

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  if (error) return <div className="flex items-center justify-center h-screen">Error: {error.message}</div>

  const  FamilyMembers: FamilyMember = data?.getMemberByID || console.log("no data")

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }



  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder-avatar.jpg" alt={FamilyMembers.FullName} />
            <AvatarFallback>{getInitials(FamilyMembers.FullName)}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-2xl font-bold">{FamilyMembers.FullName}</CardTitle>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2" />
            {FamilyMembers.Role}
            <span className="mx-2">•</span>
            {FamilyMembers.Gender}
            <span className="mx-2">•</span>
            {FamilyMembers.IsLeaders?.Title}
           
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{FamilyMembers.BirthPlace}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span className="text-sm">{formatDate(parseInt(FamilyMembers.BirthDate))}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{FamilyMembers.Gender}</Badge>
              <Badge variant="secondary">{FamilyMembers.Category}</Badge>
              <Badge variant="secondary">{FamilyMembers.FamilyPosition}</Badge>
              {FamilyMembers.Leaders && <Badge variant="default">Leader</Badge>}
              {FamilyMembers.Liturgos && <Badge variant="default">Liturgos</Badge>}
            </div>
            {FamilyMembers.IsLeaders && FamilyMembers.IsLeaders.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Leadership Roles</h3>
                {FamilyMembers.IsLeaders.map((leadership:isLeader,) => (
                  <div key={leadership.id} className="flex items-center justify-between text-sm">
                    <span>{leadership.Title}</span>
                    <Badge variant={leadership.onDuty ? "default" : "secondary"}>
                      {leadership.onDuty ? "On Duty" : "Off Duty"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            {FamilyMembers.Schedule && FamilyMembers.Schedule.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Upcoming Schedule</h3>
                {FamilyMembers.Schedule.slice(0, 3).map((event:Schedule) => (
                  <Card key={event.id} className="mb-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{event.Category}</h4>
                          <p className="text-sm text-muted-foreground">{event.Day}, {event.Date} {event.Month} {event.Years}</p>
                        </div>
                        <Badge>{event.Time}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}