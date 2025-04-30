import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@site-tracker/contractors/components/ui/card'
import { Input } from '@site-tracker/contractors/components/ui/input'
import { Button } from '@site-tracker/contractors/components/ui/button'
import { Search, Plus, GripVertical } from 'lucide-react'
import { FormField } from '@site-tracker/contractors/services/forms'

interface FormFieldBuilderProps {
  fields: FormField[]
  onFieldsChange: (fields: FormField[]) => void
}

const fieldTypes = [
  { value: 'TEXT', label: 'Text', icon: 'T' },
  { value: 'TEXTAREA', label: 'Text Area', icon: '📝' },
  { value: 'NUMBER', label: 'Number', icon: '#' },
  { value: 'DATE', label: 'Date', icon: '📅' },
  { value: 'SELECT', label: 'Select', icon: '▼' },
  { value: 'MULTISELECT', label: 'Multi Select', icon: '▼▼' },
  { value: 'RADIO', label: 'Radio', icon: '⚪' },
  { value: 'CHECKBOX', label: 'Checkbox', icon: '☑️' },
  { value: 'FILE', label: 'File Upload', icon: '📎' },
]

export default function FormFieldBuilder({
  fields,
  onFieldsChange,
}: FormFieldBuilderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddField = () => {
    const newField: FormField = {
      label: '',
      type: 'TEXT',
      required: false,
    }
    onFieldsChange([...fields, newField])
  }

  const handleRemoveField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index))
  }

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    onFieldsChange(newFields)
  }

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields]
    const [removed] = newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, removed)
    onFieldsChange(newFields)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col space-y-6">
        {/* Field Types */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-4">
            <CardTitle>Field Types</CardTitle>
            <CardDescription>
              Drag field types to create your form
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search field types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {fieldTypes
                .filter((type) =>
                  type.label.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((type) => (
                  <div
                    key={type.value}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'source',
                          field: {
                            label: '',
                            type: type.value,
                            required: false,
                          },
                        })
                      )
                    }}
                  >
                    <span className="text-lg">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b pb-4">
            <CardTitle>Form Fields</CardTitle>
            <CardDescription>Configure your form fields</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div
              className="space-y-3 min-h-[200px]"
              onDrop={(e) => {
                e.preventDefault()
                const data = JSON.parse(e.dataTransfer.getData('text/plain'))
                if (data.type === 'source') {
                  onFieldsChange([...fields, data.field])
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'text/plain',
                      JSON.stringify({
                        type: 'target',
                        field,
                        index,
                      })
                    )
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    const target = e.currentTarget
                    const rect = target.getBoundingClientRect()
                    const midY = rect.top + rect.height / 2
                    target.style.borderTop =
                      e.clientY < midY ? '2px solid var(--primary)' : 'none'
                    target.style.borderBottom =
                      e.clientY >= midY ? '2px solid var(--primary)' : 'none'
                  }}
                  onDragLeave={(e) => {
                    const target = e.currentTarget
                    target.style.borderTop = 'none'
                    target.style.borderBottom = 'none'
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const target = e.currentTarget
                    target.style.borderTop = 'none'
                    target.style.borderBottom = 'none'
                    const data = JSON.parse(
                      e.dataTransfer.getData('text/plain')
                    )
                    if (data.type === 'target' && data.index !== undefined) {
                      const dragIndex = data.index
                      const hoverIndex = index
                      if (dragIndex !== hoverIndex) {
                        moveField(dragIndex, hoverIndex)
                      }
                    }
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <select
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      value={field.type}
                      onChange={(e) =>
                        handleUpdateField(index, { type: e.target.value })
                      }
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveField(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Field Label
                    </label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        handleUpdateField(index, { label: e.target.value })
                      }
                      placeholder="e.g., Project Name"
                      required
                    />
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      checked={field.required}
                      onChange={(e) =>
                        handleUpdateField(index, { required: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <label htmlFor={`required-${index}`}>Required</label>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={handleAddField}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  )
}
