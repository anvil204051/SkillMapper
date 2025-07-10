"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

export function BreadcrumbNavigation() {
  const pathname = usePathname()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`

      let label = path.charAt(0).toUpperCase() + path.slice(1)

      // Custom labels for specific routes
      switch (path) {
        case "roadmap":
          label = "My Roadmap"
          break
        case "community":
          label = "Community"
          break
        case "dashboard":
          label = "Dashboard"
          break
        case "profile":
          label = "Profile"
          break
        case "auth":
          label = "Sign In"
          break
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        current: index === paths.length - 1,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}

          {breadcrumb.current ? (
            <span className="font-medium text-foreground">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="hover:text-primary transition-colors flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
