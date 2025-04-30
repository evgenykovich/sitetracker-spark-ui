import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@site-tracker/contractors/components/page-header'
import { Button } from '@site-tracker/contractors/components/ui/button'
import { Input } from '@site-tracker/contractors/components/ui/input'
import { Textarea } from '@site-tracker/contractors/components/ui/textarea'
import { useToast } from '@site-tracker/contractors/hooks/use-toast'
import FormsService, {
  CreateFormDto,
} from '@site-tracker/contractors/services/forms'
import FormFieldBuilder from '@site-tracker/contractors/components/forms/form-field-builder'

export default function FormCreatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<CreateFormDto>({
    title: '',
    description: '',
    formItems: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await FormsService.create(form)
      toast({
        title: 'Success',
        description: 'Form created successfully',
      })
      navigate('/forms')
    } catch (error) {
      console.error('Error creating form:', error)
      toast({
        title: 'Error',
        description: 'Failed to create form',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 pb-0">
        <PageHeader
          title="Create Form"
          description="Create a new form for contractors to fill out."
        />
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
        <div className="space-y-6 min-h-full max-h-[700px]">
          {/* Form Details */}
          <div className="space-y-4 max-w-2xl">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Form Title
              </label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="h-24"
              />
            </div>
          </div>

          {/* Form Builder */}
          <div className="border-t pt-6">
            <FormFieldBuilder
              fields={form.formItems}
              onFieldsChange={(formItems) =>
                setForm((prev) => ({ ...prev, formItems }))
              }
            />
          </div>

          <div className="flex justify-end space-x-4 sticky bottom-0 bg-background py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/forms')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Form'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
