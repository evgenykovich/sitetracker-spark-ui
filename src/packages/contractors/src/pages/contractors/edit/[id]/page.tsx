import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@contractors/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { ContractorForm } from '@contractors/components/contractors/contractor-form'
import ContractorsService, { Contractor } from '@/lib/services/contractors'

export default function EditContractorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [contractor, setContractor] = useState<Contractor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchContractor() {
      try {
        setIsLoading(true)
        const data = await ContractorsService.getContractor(id as string)

        setContractor(data)
      } catch (error) {
        console.error('Failed to load contractor:', error)
        toast({
          title: 'Error',
          description: 'Failed to load contractor details.',
          variant: 'destructive',
        })
        navigate('/contractors')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchContractor()
    }
  }, [id, navigate, toast])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/contractors')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Edit Contractor</h1>
            <p className="text-sm text-muted-foreground">
              Update contractor information
            </p>
          </div>
        </div>
      </div>

      {!isLoading && contractor && (
        <ContractorForm mode="edit" initialData={contractor} />
      )}
    </>
  )
}
