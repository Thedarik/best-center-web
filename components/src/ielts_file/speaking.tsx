
"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Plus } from "lucide-react"

export default function Speaking() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Speaking Testlari</h2>
          <p className="text-muted-foreground">IELTS Speaking bo'limiga oid testlar va ma'lumotlar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl">
            <Filter className="mr-2 h-4 w-4" />
            Filtr
          </Button>
          <Button className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            Yangi Speaking Test
          </Button>
        </div>
      </div>
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle>Speaking Testlar Ro'yxati</CardTitle>
          <CardDescription>IELTS Speaking testlari va ularning statistikasi</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hozircha Speaking testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
