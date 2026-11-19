import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CategoryForm } from "../category-form"

type EditCategoryPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const categoryId = Number(id)

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    notFound()
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  })

  if (!category) {
    notFound()
  }

  return <CategoryForm initialData={category} />
}