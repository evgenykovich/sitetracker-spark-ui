export interface FormApproval {
  id: string
  formName: string
  contractorName: string
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected'
  description?: string
  notes?: string
}

// Mock data
const mockApprovals: FormApproval[] = [
  {
    id: '1',
    formName: 'Safety Training Form',
    contractorName: 'John Doe',
    submittedDate: '2024-03-15T10:00:00Z',
    status: 'pending',
    description: 'Annual safety training completion form',
    notes: 'Please review the attached safety certificates',
  },
  {
    id: '2',
    formName: 'Equipment Inspection',
    contractorName: 'Jane Smith',
    submittedDate: '2024-03-14T15:30:00Z',
    status: 'pending',
    description: 'Monthly equipment inspection report',
    notes: 'All equipment passed inspection',
  },
  {
    id: '3',
    formName: 'Work Permit',
    contractorName: 'Mike Johnson',
    submittedDate: '2024-03-13T09:15:00Z',
    status: 'approved',
    description: 'High voltage work permit',
    notes: 'Approved by safety officer',
  },
]

class FormApprovalsService {
  private static async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static async getFormApprovals(): Promise<FormApproval[]> {
    // Simulate network delay
    await this.delay(500)
    return mockApprovals
  }

  static async approveForm(approvalId: string): Promise<void> {
    await this.delay(300)
    const approval = mockApprovals.find((a) => a.id === approvalId)
    if (approval) {
      approval.status = 'approved'
    }
  }

  static async rejectForm(approvalId: string): Promise<void> {
    await this.delay(300)
    const approval = mockApprovals.find((a) => a.id === approvalId)
    if (approval) {
      approval.status = 'rejected'
    }
  }
}

export default FormApprovalsService
