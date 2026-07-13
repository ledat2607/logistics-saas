"use client"

import { authClient } from "@/lib/auth-clients"
import { useRouter } from "next/navigation"

export default function DashboardProfile() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) return <div>Đang tải...</div>
  if (!session) return <div>Bạn chưa đăng nhập</div>

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login")
      }
    })
  }

  return (
    <div className="p-4 border rounded bg-zinc-50">
      <p>Xin chào, <strong>{session.user.name}</strong> ({session.user.email})</p>
      <button onClick={handleSignOut} className="mt-2 text-sm text-red-600 hover:underline">
        Đăng xuất
      </button>
    </div>
  )
}