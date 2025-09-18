"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationComponentProps {
  currentPage: number
  totalPages: number
}

export function PaginationComponent({ currentPage, totalPages }: PaginationComponentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("page", page.toString())
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage: number, endPage: number

    if (totalPages <= maxPagesToShow) {
      startPage = 1
      endPage = totalPages
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2)
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1
        endPage = maxPagesToShow
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1
        endPage = totalPages
      } else {
        startPage = currentPage - maxPagesBeforeCurrent
        endPage = currentPage + maxPagesAfterCurrent
      }
    }
    
    if (startPage > 1) {
        pageNumbers.push(
            <Button key={1} variant="outline" size="sm" onClick={() => handlePageChange(1)}>
                1
            </Button>
        );
        if (startPage > 2) {
            pageNumbers.push(<span key="start-ellipsis" className="px-2">...</span>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? "bg-primary text-primary-foreground" : ""}
        >
          {i}
        </Button>
      )
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(<span key="end-ellipsis" className="px-2">...</span>);
        }
        pageNumbers.push(
            <Button key={totalPages} variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
                {totalPages}
            </Button>
        );
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      {renderPageNumbers()}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
