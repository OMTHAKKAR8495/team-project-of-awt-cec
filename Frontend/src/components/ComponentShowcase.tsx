import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Settings,
  Search,
  Bell,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  FileText,
  Inbox,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Toggle,
  SearchInput,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  StatCard,
  Badge,
  JobStatusBadge,
  ApplicationStatusBadge,
  EmploymentTypeBadge,
  ScoreRing,
  Modal,
  ConfirmDialog,
  Skeleton,
  AvatarSkeleton,
  BadgeSkeleton,
  JobCardSkeleton,
  StatCardSkeleton,
  Spinner,
  ProgressBar,
  Toast,
  AlertBanner,
  EmptyState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Breadcrumbs,
  Tooltip,
  Avatar,
  AvatarGroup,
  Pagination,
} from './common';


export const ComponentShowcase: React.FC = () => {
  // Form states
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('full-time');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(false);
  const [radioValue, setRadioValue] = useState('remote');
  const [toggleActive, setToggleActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Table sorting
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('asc');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <Layers className="w-4 h-4" />
          <span>Phase 4 Component Library</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Reusable UI Component Showcase
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">
          Comprehensive catalog of all Phase 4 reusable components, verifying
          styling, accessibility, dark mode support, and interactive behaviors.
        </p>
      </div>

      {/* Breadcrumbs Demo */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Breadcrumbs Navigation
        </h2>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Components', href: '/components' },
            { label: 'Showcase' },
          ]}
        />
      </div>

      {/* Tabs Showcase */}
      <Tabs defaultValue="actions" variant="pills">
        <TabList className="mb-6">
          <TabTrigger value="actions" icon={<Sparkles className="w-4 h-4" />}>
            Actions & Buttons
          </TabTrigger>
          <TabTrigger value="forms" icon={<FileText className="w-4 h-4" />}>
            Forms & Inputs
          </TabTrigger>
          <TabTrigger value="cards" icon={<Layers className="w-4 h-4" />}>
            Cards & Badges
          </TabTrigger>
          <TabTrigger value="feedback" icon={<Bell className="w-4 h-4" />}>
            Feedback & Progress
          </TabTrigger>
          <TabTrigger value="data" icon={<TrendingUp className="w-4 h-4" />}>
            Data Display & Avatars
          </TabTrigger>
        </TabList>

        {/* =========================================================================
            Tab 1: Actions & Buttons
           ========================================================================= */}
        <TabContent value="actions" className="space-y-8">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Button Variants</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Primary, secondary, outline, danger, ghost, and success variants.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Button Sizes & Icons
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" leftIcon={<Sparkles className="w-3 h-3" />}>
                  Extra Small (xs)
                </Button>
                <Button size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Small (sm)
                </Button>
                <Button size="md" rightIcon={<Send className="w-4 h-4" />}>
                  Medium (md)
                </Button>
                <Button size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                  Large (lg)
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Accessible Icon Buttons
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip content="Settings" position="top">
                  <IconButton
                    icon={<Settings className="w-4 h-4" />}
                    aria-label="Settings"
                    variant="outline"
                  />
                </Tooltip>
                <Tooltip content="Delete item" position="top">
                  <IconButton
                    icon={<Trash2 className="w-4 h-4 text-rose-600" />}
                    aria-label="Delete item"
                    variant="ghost"
                  />
                </Tooltip>
                <IconButton
                  icon={<Bell className="w-4 h-4" />}
                  aria-label="Notifications"
                  variant="primary"
                  shape="circle"
                />
                <IconButton
                  icon={<Search className="w-4 h-4" />}
                  aria-label="Search"
                  variant="secondary"
                  size="sm"
                />
                <IconButton
                  icon={<Settings className="w-4 h-4" />}
                  aria-label="Loading action"
                  isLoading
                />
              </div>
            </div>
          </Card>
        </TabContent>

        {/* =========================================================================
            Tab 2: Forms & Inputs
           ========================================================================= */}
        <TabContent value="forms" className="space-y-8">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Form Primitives</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Accessible text inputs, textareas, selects, checkboxes, radios, and switches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Candidate Name"
                placeholder="e.g. Jane Doe"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                clearable
                onClear={() => setInputValue('')}
                hint="Full legal name as seen on official ID"
                required
              />

              <Input
                label="Invalid Email (Error Demo)"
                value="invalid-email-address"
                error="Please enter a valid business email address"
              />

              <Select
                label="Employment Type"
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
                options={[
                  { value: 'full-time', label: 'Full-Time Position' },
                  { value: 'part-time', label: 'Part-Time Position' },
                  { value: 'contract', label: 'Contract Engagement' },
                  { value: 'remote', label: 'Fully Remote' },
                ]}
                hint="Select the appropriate hiring model"
              />

              <SearchInput
                placeholder="Search candidates by skill, title, location..."
                value={searchQuery}
                onChange={setSearchQuery}
                shortcut="Ctrl+K"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Textarea
                label="Recruiter Evaluation Notes"
                placeholder="Add structured observations regarding technical readiness..."
                value={textareaValue}
                onChange={e => setTextareaValue(e.target.value)}
                maxLength={500}
                showCount
                hint="Visible only to the interviewing committee"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Checkboxes
                </h4>
                <Checkbox
                  label="Accept Terms of Service"
                  hint="Candidate privacy and GDPR adherence"
                  checked={checkboxChecked}
                  onChange={e => setCheckboxChecked(e.target.checked)}
                />
                <Checkbox
                  label="Indeterminate State"
                  indeterminate={checkboxIndeterminate}
                  checked={checkboxIndeterminate}
                  onChange={() => setCheckboxIndeterminate(!checkboxIndeterminate)}
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Radio Group
                </h4>
                <RadioGroup
                  name="workPreference"
                  value={radioValue}
                  onChange={setRadioValue}
                  options={[
                    { value: 'remote', label: 'Remote', description: 'Anywhere worldwide' },
                    { value: 'hybrid', label: 'Hybrid', description: '2 days in office' },
                    { value: 'onsite', label: 'Onsite', description: 'Full-time campus' },
                  ]}
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Toggles & Switches
                </h4>
                <Toggle
                  label="Email Notifications"
                  description="Receive instant alerts for matching applicants"
                  checked={toggleActive}
                  onChange={setToggleActive}
                />
                <Toggle
                  label="Dark Theme Preference"
                  size="sm"
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </div>
          </Card>
        </TabContent>

        {/* =========================================================================
            Tab 3: Cards & Badges
           ========================================================================= */}
        <TabContent value="cards" className="space-y-8">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Metric & KPI StatCards
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Reusable statistics display with positive, negative, and neutral trends.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Applications"
                value="1,428"
                icon={Users}
                change={{ value: '+14.2%', trend: 'positive', label: 'vs last month' }}
                description="34 pending review"
              />
              <StatCard
                title="Active Openings"
                value="42"
                icon={Briefcase}
                change={{ value: '+3', trend: 'positive' }}
                description="Across 6 divisions"
              />
              <StatCard
                title="Avg ATS Score"
                value="84.6%"
                icon={Award}
                change={{ value: '-2.1%', trend: 'negative', label: 'vs benchmark' }}
                description="Top cohort percentile"
              />
              <StatCard
                title="Interview Pass Rate"
                value="68%"
                icon={TrendingUp}
                change={{ value: '0%', trend: 'neutral' }}
                description="Technical assessments"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader
                title="Standard Light Card"
                subtitle="Clean surface with subtle border and elevation"
                action={<Badge variant="indigo">Default</Badge>}
              />
              <CardBody>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The default card integrates with light administrative dashboards,
                  recruiter portals, and form containers.
                </p>
              </CardBody>
              <CardFooter>
                <span className="text-xs text-slate-500">Footer content</span>
                <Button size="xs" variant="primary">
                  Action
                </Button>
              </CardFooter>
            </Card>

            <Card variant="glass">
              <CardHeader
                title={<span className="text-white">Dark Enterprise Glass Card</span>}
                subtitle="High-contrast glassmorphism with dynamic border glow"
                action={<Badge variant="indigo">Glass</Badge>}
              />
              <CardBody>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Glass cards blend directly into the dark enterprise background
                  (<code>#070913</code>), using backdrop blurs and subtle borders.
                </p>
              </CardBody>
              <CardFooter className="bg-slate-900/60 border-white/10">
                <span className="text-xs text-slate-400">Enterprise Ready</span>
                <Button size="xs" variant="primary">
                  Explore
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Status Badges & Category Labels
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="indigo">Indigo</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <JobStatusBadge status="open" />
              <JobStatusBadge status="closed" />
              <ApplicationStatusBadge status="pending" />
              <ApplicationStatusBadge status="shortlisted" />
              <ApplicationStatusBadge status="hired" />
              <ApplicationStatusBadge status="rejected" />
              <EmploymentTypeBadge type="full-time" />
              <EmploymentTypeBadge type="remote" />
            </div>
          </Card>
        </TabContent>

        {/* =========================================================================
            Tab 4: Feedback & Progress
           ========================================================================= */}
        <TabContent value="feedback" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Score Rings & Linear Progress Bars
              </h4>
              <div className="flex items-center justify-around py-4">
                <ScoreRing score={92} size="md" />
                <ScoreRing score={74} size="md" />
                <ScoreRing score={48} size="md" />
                <ScoreRing score={28} size="md" />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <ProgressBar
                  value={88}
                  label="ATS Match Threshold (Strong)"
                  showValue
                  variant="auto"
                />
                <ProgressBar
                  value={65}
                  label="Technical Interview Benchmark"
                  showValue
                  variant="indigo"
                />
                <ProgressBar
                  value={35}
                  label="System Capacity (Low)"
                  showValue
                  variant="rose"
                  size="sm"
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Alert Banners & Toasts
              </h4>
              <AlertBanner
                variant="info"
                title="System Announcement"
                message="ATS parsing engine updated with fuzzy vocabulary matching."
              />
              <AlertBanner
                variant="success"
                title="Verification Complete"
                message="All candidate portfolio links passed security sandbox validation."
              />

              {showToast && (
                <div className="pt-2">
                  <Toast
                    type="success"
                    title="Profile Synchronized"
                    message="Resume extraction finished with 14 verified skills."
                    durationMs={0}
                    onClose={() => setShowToast(false)}
                    action={{
                      label: 'View details',
                      onClick: () => alert('Viewing candidate details'),
                    }}
                  />
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dialog & Modal Triggers
              </h4>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
                <Button size="sm" variant="danger" onClick={() => setIsConfirmOpen(true)}>
                  Open Confirm Dialog
                </Button>
              </div>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Reusable Dialog Demo"
              description="Accessible dialog foundation with keyboard Escape and backdrop dismiss support"
              footer={
                <Button size="sm" onClick={() => setIsModalOpen(false)}>
                  Close Dialog
                </Button>
              }
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                This modal component serves as the shared dialog foundation across all
                application workflows, ensuring consistent accessibility attributes
                (<code>role=&quot;dialog&quot;</code>, <code>aria-labelledby</code>, and <code>aria-describedby</code>).
              </p>
            </Modal>

            <ConfirmDialog
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => {
                alert('Action Confirmed');
                setIsConfirmOpen(false);
              }}
              title="Delete Candidate Record"
              message="Are you sure you want to permanently delete this application? This action cannot be undone."
              confirmText="Delete Record"
              variant="danger"
            />
          </Card>

          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Loading Indicators & Skeletons
            </h4>
            <div className="flex items-center gap-6 py-2">
              <Spinner size="sm" label="Small" />
              <Spinner size="md" label="Medium" />
              <Spinner size="lg" label="Large" />
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              <AvatarSkeleton size="md" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <BadgeSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">StatCard Skeleton</p>
                <StatCardSkeleton />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">JobCard Skeleton</p>
                <JobCardSkeleton />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Empty State Display
            </h4>
            <EmptyState
              icon={Inbox}
              title="No Applicants in Pipeline"
              description="New candidates will appear here automatically once applications are submitted."
              actionText="Create Job Opening"
              onAction={() => alert('Navigate to create job')}
            />
          </Card>
        </TabContent>


        {/* =========================================================================
            Tab 5: Data Display & Avatars
           ========================================================================= */}
        <TabContent value="data" className="space-y-8">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enterprise Table</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Responsive table with sortable column headers, hover effects, and clean cell layouts.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    sortable
                    sortDirection={sortDirection}
                    onSort={() =>
                      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
                    }
                  >
                    Candidate
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>ATS Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name="Sarah Connor" status="online" size="sm" />
                      <div>
                        <p className="font-semibold text-slate-900">Sarah Connor</p>
                        <p className="text-xs text-slate-400">s.connor@example.com</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Senior Cloud Architect</TableCell>
                  <TableCell>
                    <ScoreRing score={94} size="sm" showLabel={false} />
                  </TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status="shortlisted" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" variant="outline">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name="David Miller" status="busy" size="sm" />
                      <div>
                        <p className="font-semibold text-slate-900">David Miller</p>
                        <p className="text-xs text-slate-400">d.miller@example.com</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>Full Stack Engineer</TableCell>
                  <TableCell>
                    <ScoreRing score={78} size="sm" showLabel={false} />
                  </TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status="pending" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="xs" variant="outline">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Empty Table State Component Demo
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableEmptyState
                    colSpan={4}
                    message="No candidates found matching the selected filter criteria."
                  />
                </TableBody>
              </Table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={5}
              totalItems={45}
              itemsPerPage={9}
              onPageChange={setCurrentPage}
            />
          </Card>


          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Avatars & Avatar Groups
            </h4>
            <div className="flex flex-wrap items-center gap-6">
              <Avatar name="Alex Rivera" size="xs" />
              <Avatar name="Brandon Vance" size="sm" status="online" />
              <Avatar name="Elena Rostova" size="md" status="away" />
              <Avatar name="Marcus Chen" size="lg" status="busy" />
              <Avatar name="Zendaya Coleman" size="xl" status="offline" />

              <div className="pl-6 border-l border-slate-200">
                <AvatarGroup max={3}>
                  <Avatar name="Liam Neeson" />
                  <Avatar name="Emma Watson" />
                  <Avatar name="Chris Evans" />
                  <Avatar name="Robert Downey" />
                  <Avatar name="Scarlett Johansson" />
                </AvatarGroup>
              </div>
            </div>
          </Card>
        </TabContent>
      </Tabs>
    </div>
  );
};

export default ComponentShowcase;
