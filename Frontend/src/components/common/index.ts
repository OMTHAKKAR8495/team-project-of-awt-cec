// Phase 4: Centralized Reusable UI Component Library Exports

// Buttons and Actions
export { Button, type ButtonProps } from './Button';
export { IconButton, type IconButtonProps } from './IconButton';

// Form Primitives
export { Input, type InputProps } from './Input';
export { Textarea, type TextareaProps } from './Textarea';
export { Select, type SelectProps, type SelectOption } from './Select';
export { Checkbox, type CheckboxProps } from './Checkbox';
export {
  Radio,
  RadioGroup,
  type RadioProps,
  type RadioGroupProps,
  type RadioOption,
} from './Radio';
export { Toggle, type ToggleProps } from './Toggle';
export { SearchInput, type SearchInputProps } from './SearchInput';
export { FileDropzone, type FileDropzoneProps } from './FileDropzone';

// Cards & Information Displays
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  type CardProps,
} from './Card';
export { StatCard, type StatCardProps } from './StatCard';
export {
  Badge,
  JobStatusBadge,
  ApplicationStatusBadge,
  EmploymentTypeBadge,
  type BadgeProps,
} from './Badge';
export { ScoreRing, type ScoreRingProps } from './ScoreRing';

// Dialogs & Overlays
export { Modal, type ModalProps } from './Modal';
export { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

// Feedback & Loading States
export {
  Skeleton,
  AvatarSkeleton,
  BadgeSkeleton,
  JobCardSkeleton,
  TableRowSkeleton,
  StatCardSkeleton,
} from './LoadingSkeleton';
export { Spinner, type SpinnerProps } from './Spinner';
export { ProgressBar, type ProgressBarProps } from './ProgressBar';
export { Toast, type ToastProps } from './Toast';
export { AlertBanner, type AlertBannerProps } from './AlertBanner';
export { EmptyState, type EmptyStateProps } from './EmptyState';

// Data Display & Navigation
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  type TableProps,
  type TableHeadProps,
} from './Table';
export {
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  type TabsProps,
  type TabListProps,
  type TabTriggerProps,
  type TabContentProps,
} from './Tabs';
export {
  Breadcrumbs,
  type BreadcrumbsProps,
  type BreadcrumbItem,
} from './Breadcrumbs';
export { Tooltip, type TooltipProps } from './Tooltip';
export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from './Avatar';
export { Pagination, type PaginationProps } from './Pagination';
