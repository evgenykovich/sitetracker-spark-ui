import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@site-tracker/contractors/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@site-tracker/contractors/components/ui/card'
import { Button } from '@site-tracker/contractors/components/ui/button'
import { ChevronLeft, Loader2, Save } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import SalesforceService, {
  SalesforceFormField,
  FormSubmission,
} from '@/lib/services/salesforce'

type FormFieldValue = string | number | null

export default function ContractorFormPage() {
  const [form, setForm] = useState<{
    id: string
    name: string
    description: string
    fields: SalesforceFormField[]
  } | null>(null)
  const [formData, setFormData] = useState<Record<string, FormFieldValue>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { formId } = useParams()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchForm() {
      try {
        setIsLoading(true)
        const formDetails = await SalesforceService.getFormDetails(
          formId as string
        )
        setForm(formDetails)
        // Initialize form data with empty values
        const initialData: Record<string, FormFieldValue> = {}
        formDetails.fields.forEach((field) => {
          initialData[field.Id] = ''
        })
        setFormData(initialData)
      } catch (error) {
        console.error('Error fetching form:', error)
        toast({
          title: 'Error',
          description: 'Failed to load form details',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (formId) {
      fetchForm()
    }
  }, [formId, toast])

  const handleFieldChange = (fieldId: string, value: FormFieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      const submission: FormSubmission = {
        formId: formId as string,
        data: formData,
      }
      await SalesforceService.submitForm(submission)
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader title="Loading..." description="Please wait" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader title="Error" description="Form not found" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-muted-foreground mb-4">
              The requested form could not be found.
            </p>
            <Link to="/forms">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Forms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="sticky top-[54px] z-30 bg-white">
        <div className="flex items-center justify-between py-4 border-b">
          <div className="flex items-center space-x-4">
            <Link to="/forms">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">{form.name}</h1>
              <p className="text-sm text-muted-foreground">
                {form.description || 'No description provided'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Submit Form
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {form.fields.map((field) => (
          <Card key={field.Id}>
            <CardHeader>
              <CardTitle>{field.Label__c}</CardTitle>
              {field.Help_Text__c && (
                <CardDescription>{field.Help_Text__c}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Render appropriate input based on field type */}
              {field.Type__c === 'Text' && (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData[field.Id] || ''}
                  onChange={(e) => handleFieldChange(field.Id, e.target.value)}
                  required={field.Required__c}
                />
              )}
              {field.Type__c === 'Text Area' && (
                <textarea
                  className="w-full p-2 border rounded"
                  value={formData[field.Id] || ''}
                  onChange={(e) => handleFieldChange(field.Id, e.target.value)}
                  required={field.Required__c}
                  rows={4}
                />
              )}
              {field.Type__c === 'Date' && (
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={formData[field.Id] || ''}
                  onChange={(e) => handleFieldChange(field.Id, e.target.value)}
                  required={field.Required__c}
                />
              )}
              {field.Type__c === 'Currency' && (
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded"
                  value={formData[field.Id] || ''}
                  onChange={(e) =>
                    handleFieldChange(field.Id, parseFloat(e.target.value))
                  }
                  required={field.Required__c}
                />
              )}
              {/* Add more field types as needed */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
