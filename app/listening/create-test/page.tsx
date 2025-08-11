"use client"

import CreateListeningTestNew from "@/components/src/ielts_file/listining_file/CreateListeningTestNew"
import { useRouter } from "next/navigation"

export default function CreateListeningTestPage() {
  const router = useRouter()

  const handleTestCreated = () => {
    // Test yaratilgandan keyin listening sahifasiga qaytamiz
    router.push("/listening")
  }

  const handleCancel = () => {
    // Bekor qilganda listening sahifasiga qaytamiz
    router.push("/listening")
  }

  return (
    <div className="max-w-6xl mx-auto">
      <CreateListeningTestNew
        onTestCreated={handleTestCreated}
        onCancel={handleCancel}
      />
    </div>
  )
}
