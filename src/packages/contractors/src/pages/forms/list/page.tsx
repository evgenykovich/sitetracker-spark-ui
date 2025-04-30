import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@site-tracker/contractors/components/ui/card'
import { Input } from '@site-tracker/contractors/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@site-tracker/contractors/components/ui/select'
import { useToast } from '@site-tracker/contractors/hooks/use-toast'
import { CalendarDays, ChevronRight, ListFilter, Plus } from 'lucide-react'
import SalesforceService, { SalesforceForm } from '@/lib/services/salesforce'
import FormsService, { Form } from '@site-tracker/contractors/services/forms'
import { Badge } from '@site-tracker/contractors/components/ui/badge'
import { Button } from '@site-tracker/contractors/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@site-tracker/contractors/components/ui/tabs'

type FormSource = 'all' | 'salesforce' | 'database'

export default function FormsListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [salesforceForms, setSalesforceForms] = useState<SalesforceForm[]>([])
  const [databaseForms, setDatabaseForms] = useState<Form[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [formSource, setFormSource] = useState<FormSource>('all')

  useEffect(() => {
    const loadForms = async () => {
      setIsLoading(true)
      try {
        // Load both types of forms in parallel
        const [sfForms, dbForms] = await Promise.all([
          SalesforceService.getForms(),
          FormsService.getAll(),
        ])

        setSalesforceForms(
          sfForms.map((form) => ({
            ...form,
            createdDate: form.createdDate || undefined,
          }))
        )
        setDatabaseForms(dbForms)
      } catch (error) {
        console.error('Error loading forms:', error)
        toast({
          title: 'Error loading forms',
          description: 'Please try again later',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadForms()
  }, [toast])

  const filteredAndSortedForms = useMemo(() => {
    let allForms: (
      | SalesforceForm
      | (Form & { source: 'salesforce' | 'database' })
    )[] = []

    // Add forms based on selected source
    if (formSource === 'all' || formSource === 'salesforce') {
      allForms = [
        ...allForms,
        ...salesforceForms.map((form) => ({
          ...form,
          source: 'salesforce' as const,
        })),
      ]
    }
    if (formSource === 'all' || formSource === 'database') {
      allForms = [
        ...allForms,
        ...databaseForms.map((form) => ({
          ...form,
          source: 'database' as const,
        })),
      ]
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      allForms = allForms.filter(
        (form) =>
          (form.name || form.title || '').toLowerCase().includes(query) ||
          (form.description || '').toLowerCase().includes(query)
      )
    }

    // Apply status filter (only for Salesforce forms)
    if (statusFilter !== 'all') {
      allForms = allForms.filter((form) =>
        'status' in form ? form.status === statusFilter : true
      )
    }

    // Apply sorting
    allForms.sort((a, b) => {
      if (sortField === 'createdDate' || sortField === 'createdAt') {
        const aDate = new Date(a.createdDate || a.createdAt || 0)
        const bDate = new Date(b.createdDate || b.createdAt || 0)
        return sortOrder === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime()
      }

      // Default string comparison for other fields
      const aValue = String(a[sortField as keyof typeof a] || '').toLowerCase()
      const bValue = String(b[sortField as keyof typeof b] || '').toLowerCase()
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

    return allForms
  }, [
    salesforceForms,
    databaseForms,
    searchQuery,
    statusFilter,
    sortField,
    sortOrder,
    formSource,
  ])

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(
      salesforceForms.map((form) => form.status || '').filter(Boolean)
    )
    return ['all', ...Array.from(statuses)] as const
  }, [salesforceForms])

  const renderFormCard = (
    form: (SalesforceForm | Form) & { source: 'salesforce' | 'database' }
  ) => (
    <Card
      key={form.id}
      className="transition-all duration-200 hover:border-primary cursor-pointer"
      onClick={() =>
        navigate(
          form.source === 'salesforce'
            ? `/forms/${form.id}`
            : `/contractor-forms/${form.id}`
        )
      }
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium line-clamp-2">
                {form.name || form.title || 'Untitled Form'}
              </h4>
              <Badge variant="outline">{form.source}</Badge>
            </div>
            {form.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {form.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {'status' in form && (
            <Badge
              variant={
                form.status === 'Active'
                  ? 'default'
                  : form.status === 'Draft'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {form.status || 'Unknown'}
            </Badge>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            {form.createdDate || form.createdAt
              ? new Date(
                  form.createdDate || form.createdAt
                ).toLocaleDateString()
              : 'No date'}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <Card className="relative min-h-[760px] border-none shadow-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-primary" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative h-[760px] overflow-hidden">
      <CardHeader className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Forms</CardTitle>
            <CardDescription>
              View and manage your forms
              {filteredAndSortedForms.length > 0 && (
                <span className="text-muted-foreground">
                  {' '}
                  • {filteredAndSortedForms.length} total
                </span>
              )}
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/forms/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </div>

        <div className="flex flex-col space-y-4 mt-4">
          <Tabs
            value={formSource}
            onValueChange={(value) => setFormSource(value as FormSource)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Forms</TabsTrigger>
              <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
              <TabsTrigger value="database">Custom Forms</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              {(formSource === 'all' || formSource === 'salesforce') && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center">
                      <ListFilter className="mr-2 h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === 'all' ? 'All Statuses' : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <ListFilter className="mr-2 h-4 w-4" />
                    <span>Sort By</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdDate">Created Date</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
              >
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center">
                    <ListFilter className="mr-2 h-4 w-4" />
                    <span>Order</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto h-[calc(100%-8rem)] absolute inset-x-0 bottom-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedForms.map(renderFormCard)}
        </div>
      </CardContent>
    </Card>
  )
}
