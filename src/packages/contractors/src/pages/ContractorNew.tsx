import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserPlus, FileSpreadsheet } from 'lucide-react'
import { ContractorForm, ContractorBulkImport } from '../components'
import { useContractors } from '../context/ContractorsContext'
import { useNavigate } from 'react-router-dom'

export function ContractorNewPage() {
  const [activeTab, setActiveTab] = useState('manual')
  const { createContractor, importContractors } = useContractors()
  const navigate = useNavigate()

  const handleSubmit = async (data: Parameters<typeof createContractor>[0]) => {
    await createContractor(data)
    navigate('/contractors')
  }

  const handleImport = async (file: File) => {
    await importContractors(file)
    navigate('/contractors')
  }

  return (
    <div className="flex flex-col space-y-6 p-6 min-h-screen pb-24">
      <PageHeader
        title="Create Contractor"
        description="Add a new contractor to your network"
        backButton={{ href: '/contractors' }}
      />

      <Tabs
        defaultValue="manual"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full overflow-auto max-h-[680px]"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Manual Create
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel Import
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="manual" className="mt-0">
            <ContractorForm onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="import" className="mt-0">
            <ContractorBulkImport onImport={handleImport} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
