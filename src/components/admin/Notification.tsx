
import { Check, AlertCircle } from "lucide-react"
import { type NotificationType } from "@/app/admin/page"

interface NotificationProps {
  notification: NotificationType | null
}

export function Notification({ notification }: NotificationProps) {
  if (!notification) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
        notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {notification.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <span>{notification.message}</span>
    </div>
  )
}
