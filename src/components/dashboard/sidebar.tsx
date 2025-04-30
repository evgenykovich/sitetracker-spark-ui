import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Settings,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Cloud,
  ChevronDown,
  ClipboardList,
  CheckSquare,
  PlusCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ReactNode, useState } from 'react'
import sitetrackerLogoIcon from '../../assets/images/sitetracker_logo_icon.png'

interface NavItemProps {
  href: string
  icon: ReactNode
  label: string
  isActive: boolean
  collapsed?: boolean
  depth?: number
}

interface NavGroupProps {
  icon: ReactNode
  label: string
  isActive: boolean
  collapsed?: boolean
  children?: ReactNode
}

function NavGroup({
  icon,
  label,
  isActive,
  collapsed,
  children,
}: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (collapsed) {
    return (
      <div className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all hover:bg-accent cursor-pointer',
            isActive
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
          onClick={() => setIsOpen(!isOpen)}
          title={label}
        >
          {icon}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent cursor-pointer',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span className="flex-1">{label}</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
        />
      </div>
      {isOpen && <div className="ml-4">{children}</div>}
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  isActive,
  collapsed,
  depth = 0,
}: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
        isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
        collapsed && 'justify-center px-2',
        depth > 0 && !collapsed && 'pl-6'
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

interface SidebarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Sidebar({ isSidebarOpen, onToggleSidebar }: SidebarProps) {
  const pathname = useLocation().pathname

  const isContractorsActive = pathname.startsWith('/contractors')
  const isFormsActive = pathname.startsWith('/forms')
  const isFormApprovalsActive = pathname.startsWith('/form-approvals')

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? 240 : 64,
      }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r bg-background overflow-hidden"
    >
      <div className="flex h-14 items-center justify-center border-b">
        <Link
          to="/dashboard"
          className={cn(
            'flex items-center gap-2 font-semibold transition-all',
            !isSidebarOpen && 'px-2'
          )}
        >
          {!isSidebarOpen ? (
            <img
              src={sitetrackerLogoIcon}
              alt="SiteTracker Spark"
              width={24}
              height={24}
            />
          ) : (
            <div className="flex items-center">
              <img
                src={sitetrackerLogoIcon}
                alt="SiteTracker Spark"
                width={50}
                height={50}
              />
              <span className="text-xl font-bold px-3">Spark</span>
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-hidden">
        <nav className="space-y-4 px-3 py-4">
          <div className="space-y-1">
            <h2
              className={cn(
                'mb-2 px-2 text-lg font-semibold tracking-tight',
                !isSidebarOpen && 'sr-only'
              )}
            >
              Overview
            </h2>
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              isActive={pathname === '/dashboard'}
              collapsed={!isSidebarOpen}
            />

            <NavGroup
              icon={<Users className="h-4 w-4" />}
              label="Contractors"
              isActive={
                isContractorsActive || isFormsActive || isFormApprovalsActive
              }
              collapsed={!isSidebarOpen}
            >
              <NavItem
                href="/contractors"
                icon={<ClipboardList className="h-4 w-4" />}
                label="Contractors List"
                isActive={pathname === '/contractors'}
                collapsed={!isSidebarOpen}
                depth={1}
              />
              <NavItem
                href="/contractors/new"
                icon={<PlusCircle className="h-4 w-4" />}
                label="Add Contractor"
                isActive={pathname === '/contractors/new'}
                collapsed={!isSidebarOpen}
                depth={1}
              />
              <NavItem
                href="/forms"
                icon={<FileSpreadsheet className="h-4 w-4" />}
                label="Forms"
                isActive={isFormsActive}
                collapsed={!isSidebarOpen}
                depth={1}
              />
              <NavItem
                href="/form-approvals"
                icon={<CheckSquare className="h-4 w-4" />}
                label="Approvals"
                isActive={isFormApprovalsActive}
                collapsed={!isSidebarOpen}
                depth={1}
              />
            </NavGroup>

            <NavItem
              href="/analytics"
              icon={<BarChart3 className="h-4 w-4" />}
              label="Analytics"
              isActive={pathname === '/analytics'}
              collapsed={!isSidebarOpen}
            />
          </div>

          <Separator />

          <div className="space-y-1">
            <h2
              className={cn(
                'mb-2 px-2 text-lg font-semibold tracking-tight',
                !isSidebarOpen && 'sr-only'
              )}
            >
              Integrations
            </h2>
            <NavItem
              href="/integrations/salesforce"
              icon={<Cloud className="h-4 w-4" />}
              label="Salesforce"
              isActive={pathname.startsWith('/integrations/salesforce')}
              collapsed={!isSidebarOpen}
            />
          </div>
        </nav>
      </div>

      <div className="mt-auto">
        <div className="border-t">
          <nav className="px-3 py-4">
            <div className="space-y-1">
              <h2
                className={cn(
                  'mb-2 px-2 text-lg font-semibold tracking-tight',
                  !isSidebarOpen && 'sr-only'
                )}
              >
                Settings
              </h2>
              <NavItem
                href="/settings/profile"
                icon={<User className="h-4 w-4" />}
                label="Profile"
                isActive={pathname === '/settings/profile'}
                collapsed={!isSidebarOpen}
              />
              <NavItem
                href="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Account"
                isActive={pathname === '/settings'}
                collapsed={!isSidebarOpen}
              />
            </div>
          </nav>
        </div>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10 hidden md:flex items-center justify-center"
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
