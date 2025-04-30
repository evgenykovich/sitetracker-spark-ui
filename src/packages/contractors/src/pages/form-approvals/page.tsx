import { useState, useEffect } from 'react'
import { PageHeader } from '@site-tracker/contractors/components/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@site-tracker/contractors/components/ui/card'
import { Button } from '@site-tracker/contractors/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@site-tracker/contractors/hooks/use-toast'
import FormApprovalsService, {
  FormApproval,
} from '@site-tracker/contractors/services/form-approvals'

export default function FormApprovalsPage() {
  const [approvals, setApprovals] = useState<FormApproval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchApprovals() {
      try {
        setIsLoading(true)
        const data = await FormApprovalsService.getFormApprovals()
        setApprovals(data)
      } catch (error) {
        console.error('Error fetching approvals:', error)
        toast({
          title: 'Error',
          description: 'Failed to load form approvals',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApprovals()
  }, [toast])

  const handleApprove = async (approvalId: string) => {
    try {
      await FormApprovalsService.approveForm(approvalId)
      // Refresh approvals
      const data = await FormApprovalsService.getFormApprovals()
      setApprovals(data)
      toast({
        title: 'Success',
        description: 'Form approved successfully',
      })
    } catch (error) {
      console.error('Error approving form:', error)
      toast({
        title: 'Error',
        description: 'Failed to approve form',
        variant: 'destructive',
      })
    }
  }

  const handleReject = async (approvalId: string) => {
    try {
      await FormApprovalsService.rejectForm(approvalId)
      // Refresh approvals
      const data = await FormApprovalsService.getFormApprovals()
      setApprovals(data)
      toast({
        title: 'Success',
        description: 'Form rejected successfully',
      })
    } catch (error) {
      console.error('Error rejecting form:', error)
      toast({
        title: 'Error',
        description: 'Failed to reject form',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader
          title="Form Approvals"
          description="Review and approve contractor form submissions."
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (approvals.length === 0) {
    return (
      <div className="flex flex-col space-y-6 p-6">
        <PageHeader
          title="Form Approvals"
          description="Review and approve contractor form submissions."
        />
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No pending approvals</CardTitle>
            <CardDescription>
              There are no forms waiting for your approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              All forms have been reviewed. Check back later for new
              submissions.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <PageHeader
        title="Form Approvals"
        description="Review and approve contractor form submissions."
      />

      <div className="grid gap-6">
        {approvals.map((approval) => (
          <Card key={approval.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{approval.formName}</CardTitle>
                  <CardDescription>
                    Submitted by {approval.contractorName} on{' '}
                    {new Date(approval.submittedDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {approval.status === 'pending' ? (
                    <>
                      <Button
                        onClick={() => handleApprove(approval.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(approval.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <div
                      className={`flex items-center ${
                        approval.status === 'approved'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {approval.status === 'approved' ? (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      {approval.status.charAt(0).toUpperCase() +
                        approval.status.slice(1)}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Form Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {approval.description || 'No description provided'}
                  </p>
                </div>
                {approval.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Submission Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {approval.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
