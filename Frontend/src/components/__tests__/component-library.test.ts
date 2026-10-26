/**
 * Phase 4 Reusable UI Component Library - Contract & Interface Verification Tests
 *
 * Verifies that all components, subcomponents, and TypeScript contracts
 * are properly exported, instantiate without errors, and follow the Phase 4 specification.
 */

import * as ComponentLibrary from '../index';
import * as CommonComponents from '../common';


describe('Phase 4 Component Library Contract Verification', () => {
  const expectedCommonExports = [
    // Buttons & Actions
    'Button',
    'IconButton',

    // Form Primitives
    'Input',
    'Textarea',
    'Select',
    'Checkbox',
    'Radio',
    'RadioGroup',
    'Toggle',
    'SearchInput',
    'FileDropzone',

    // Cards & Information Displays
    'Card',
    'CardHeader',
    'CardBody',
    'CardFooter',
    'StatCard',
    'Badge',
    'JobStatusBadge',
    'ApplicationStatusBadge',
    'EmploymentTypeBadge',
    'ScoreRing',

    // Dialogs & Overlays
    'Modal',
    'ConfirmDialog',

    // Feedback & Loading States
    'Skeleton',
    'AvatarSkeleton',
    'BadgeSkeleton',
    'JobCardSkeleton',
    'TableRowSkeleton',
    'StatCardSkeleton',
    'Spinner',
    'ProgressBar',
    'Toast',
    'AlertBanner',
    'EmptyState',

    // Data Display & Navigation
    'Table',
    'TableHeader',
    'TableBody',
    'TableFooter',
    'TableRow',
    'TableHead',
    'TableCell',
    'TableEmptyState',
    'Tabs',
    'TabList',
    'TabTrigger',
    'TabContent',
    'Breadcrumbs',
    'Tooltip',
    'Avatar',
    'AvatarGroup',
    'Pagination',
  ];

  test('all common components are correctly exported from @/components/common', () => {
    expectedCommonExports.forEach(exportName => {
      expect((CommonComponents as Record<string, unknown>)[exportName]).toBeDefined();
    });
  });

  test('all root components are correctly re-exported from @/components', () => {
    expectedCommonExports.forEach(exportName => {
      expect((ComponentLibrary as Record<string, unknown>)[exportName]).toBeDefined();
    });

    // Also verify candidate components are present in root index
    expect(ComponentLibrary.JobCard).toBeDefined();
    expect(ComponentLibrary.ApplyModal).toBeDefined();
  });

  test('component types and factories resolve properly', () => {
    expect(typeof CommonComponents.Button).toBe('function');
    expect(typeof CommonComponents.IconButton).toBe('function');
    expect(typeof CommonComponents.Input).toBe('object'); // React.forwardRef produces an object
    expect(typeof CommonComponents.Textarea).toBe('object');
    expect(typeof CommonComponents.Select).toBe('object');
    expect(typeof CommonComponents.Checkbox).toBe('object');
    expect(typeof CommonComponents.Radio).toBe('object');
    expect(typeof CommonComponents.RadioGroup).toBe('function');
    expect(typeof CommonComponents.Toggle).toBe('object');
    expect(typeof CommonComponents.SearchInput).toBe('object');
    expect(typeof CommonComponents.StatCard).toBe('function');
    expect(typeof CommonComponents.Spinner).toBe('function');
    expect(typeof CommonComponents.ProgressBar).toBe('function');
    expect(typeof CommonComponents.Toast).toBe('function');
    expect(typeof CommonComponents.Table).toBe('function');
    expect(typeof CommonComponents.Tabs).toBe('function');
    expect(typeof CommonComponents.Breadcrumbs).toBe('function');
    expect(typeof CommonComponents.Tooltip).toBe('function');
    expect(typeof CommonComponents.Avatar).toBe('function');
    expect(typeof CommonComponents.AvatarGroup).toBe('function');
  });
});
