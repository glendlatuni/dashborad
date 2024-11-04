/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CirclePlus, Trash2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface KSP {
  id?: string
  kspID: string
  name: string
}

interface Rayon {
  id?: string
  rayonID: string
  number: string
  ksps: KSP[]
  isExpanded: boolean
  isValid: boolean
}

interface FormData {

  churchName: string
  rayons: Rayon[]
}

export default function ChurchManagementForm() {
  const [formData, setFormData] = useState<FormData>({
    churchName: "",
    rayons: [{
      rayonID: "1", number: "", ksps: [{
        kspID: "1", name: "",
  
      }], isExpanded: true, isValid: false,
 
    }]
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  // Separate validation state calculation from state updates
  useEffect(() => {
    const isChurchNameValid = formData.churchName.trim() !== ""
    const areRayonsValid = formData.rayons.every(rayon => 
      rayon.number.trim() !== "" && rayon.ksps.every(ksp => ksp.name.trim() !== "")
    )
    
    setIsFormValid(isChurchNameValid && areRayonsValid)
  }, [formData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return


try {
    // Transform data untuk API, menghilangkan clientId dan field yang tidak diperlukan
    const apiData: APIChurchInput = {
      churchName: formData.churchName,
      rayons: formData.rayons.map(rayon => ({
        number: parseInt(rayon.number),
        ksps: rayon.ksps.map(ksp => ({
          name: ksp.name
        }))
      }))
    }

    const result = await registerChurch(apiData)
    
    if (result) {
      // Setelah berhasil, bisa update state dengan ID yang baru dari backend
      setFormData(prev => ({
        ...prev,
        id: result.id,
        rayons: result.rayons.map((rayonFromDB: { rayonNumber: { toString: () => string }; id: any; ksps: any[] }) => ({
          ...prev.rayons.find(r => r.number === rayonFromDB.rayonNumber.toString())!,
          id: rayonFromDB.id,
          ksps: rayonFromDB.ksps.map(kspFromDB => ({
            ...prev.rayons
              .find(r => r.number === rayonFromDB.rayonNumber.toString())!
              .ksps.find(k => k.name === kspFromDB.kspname)!,
            id: kspFromDB.id
          }))
        }))
      }))
      
      setShowAlert(true)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
  }


  }

  const generateClientId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const updateChurchName = (value: string) => {
    setFormData(prev => ({ ...prev, churchName: value }))
  }

  const addRayon = () => {
    setFormData(prev => ({
      ...prev,
      rayons: [...prev.rayons, { 
        rayonID: generateClientId(), 
        number: "", 
        ksps: [], 
        isExpanded: true, 
        isValid: false 
      }]
    }))
  }

  const updateRayonNumber = (rayonClientId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.map(rayon =>
        rayon.rayonID === rayonClientId ? { ...rayon, number: value } : rayon
      )
    }))
  }

  const deleteRayon = (rayonClientId: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.filter(rayon => rayon.rayonID !== rayonClientId)
    }))
  }

  const addKSP = (rayonClientId: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.map(rayon =>
        rayon.rayonID === rayonClientId
          ? { ...rayon, ksps: [...rayon.ksps, { kspID: generateClientId(), name: "" }] }
          : rayon
      )
    }))
  }

  const updateKSPName = (rayonClientId: string, kspClientID: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.map(rayon =>
        rayon.rayonID === rayonClientId
          ? {
              ...rayon,
              ksps: rayon.ksps.map(ksp =>
                ksp.kspID === kspClientID ? { ...ksp, name: value } : ksp
              )
            }
          : rayon
      )
    }))
  }

  const deleteKSP = (rayonClientId: string, kspClientID: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.map(rayon =>
        rayon.rayonID === rayonClientId
          ? { ...rayon, ksps: rayon.ksps.filter(ksp => ksp.kspID !== kspClientID) }
          : rayon
      )
    }))
  }

  const toggleRayonExpansion = (rayonClientId: string) => {
    setFormData(prev => ({
      ...prev,
      rayons: prev.rayons.map(rayon =>
        rayon.rayonID === rayonClientId ? { ...rayon, isExpanded: !rayon.isExpanded } : rayon
      )
    }))
  }

  // Calculate validation status for a rayon
  const isRayonValid = (rayon: Rayon) => {
    return rayon.number.trim() !== "" && rayon.ksps.every(ksp => ksp.name.trim() !== "")
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Church Management Form</CardTitle>
            {formData.churchName.trim() !== "" && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="churchName">Church Name</Label>
                <Input
                  id="churchName"
                  placeholder="Enter Church Name"
                  value={formData.churchName}
                  onChange={(e) => updateChurchName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addRayon}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CirclePlus className="mr-2 h-4 w-4" /> Add Rayon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[60vh] rounded-md border p-4">
          {formData.rayons.map((rayon) => (
            <Card key={rayon.id} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rayon {rayon.number || "Unnamed"}
                </CardTitle>
                <div className="flex space-x-2">
                  {isRayonValid(rayon) && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRayonExpansion(rayon.rayonID)}
                  >
                    {rayon.isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRayon(rayon.rayonID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {rayon.isExpanded && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`rayon-${rayon.id}`}>Rayon Number</Label>
                    <Input
                      id={`rayon-${rayon.id}`}
                      type="number"
                      placeholder="Enter Rayon Number"
                      value={rayon.number}
                      onChange={(e) => updateRayonNumber(rayon.rayonID, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KSPs</Label>
                    {rayon.ksps.map((ksp) => (
                      <div key={ksp.id} className="flex items-center space-x-2">
                        <Input
                          placeholder="Enter KSP Name"
                          value={ksp.name}
                          onChange={(e) => updateKSPName(rayon.rayonID, ksp.kspID, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteKSP(rayon.rayonID, ksp.kspID)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addKSP(rayon.rayonID)}
                    className="w-full"
                  >
                    <CirclePlus className="mr-2 h-4 w-4" /> Add KSP
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}
        </ScrollArea>

        <div className="pt-4 pb-16">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                type="button" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                disabled={!isFormValid}
              >
                Submit Form
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit this form? Please review your information before confirming.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>

      {showAlert && (
        <Alert className="mt-4">
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your form has been successfully submitted.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}