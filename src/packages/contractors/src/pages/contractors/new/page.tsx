import { useState } from 'react'
import { PageHeader } from '@site-tracker/contractors/components/page-header'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@site-tracker/contractors/components/ui/tabs'
import { UserPlus, FileSpreadsheet } from 'lucide-react'
import {
  ContractorForm,
  ContractorBulkImport,
} from '@site-tracker/contractors/components/contractors/index'

export default function NewContractorPage() {
  const [activeTab, setActiveTab] = useState('manual')

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
            <ContractorForm />
          </TabsContent>

          <TabsContent value="import" className="mt-0">
            <ContractorBulkImport />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
