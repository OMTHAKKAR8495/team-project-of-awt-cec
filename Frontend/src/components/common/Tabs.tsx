import React, { createContext, useContext, useId, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  baseId: string;
  variant: 'pills' | 'underline' | 'contained';
}

const TabsContext = createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'pills' | 'underline' | 'contained';
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue = '',
  onChange,
  variant = 'pills',
  children,
  className = '',
}) => {
  const [internalTab, setInternalTab] = useState(defaultValue);
  const baseId = useId();

  const activeTab = value !== undefined ? value : internalTab;

  const handleTabChange = (newTab: string) => {
    if (value === undefined) {
      setInternalTab(newTab);
    }
    onChange?.(newTab);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleTabChange,
        baseId,
        variant,
      }}
    >
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const TabList: React.FC<TabListProps> = ({
  children,
  className = '',
  'aria-label': ariaLabel = 'Navigation Tabs',
  ...props
}) => {
  const { variant } = useTabsContext();

  const variantContainerStyles = {
    pills: 'inline-flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl',
    underline: 'flex items-center gap-6 border-b border-slate-200',
    contained: 'flex items-center border border-slate-200 rounded-xl p-1 bg-white',
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`${variantContainerStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  icon,
  badge,
  children,
  disabled = false,
  className = '',
  ...props
}) => {
  const { activeTab, setActiveTab, baseId, variant } = useTabsContext();
  const isActive = activeTab === value;

  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const variantTabStyles = {
    pills: isActive
      ? 'bg-white text-indigo-700 font-semibold shadow-xs'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
    underline: isActive
      ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold -mb-px pb-3'
      : 'border-b-2 border-transparent text-slate-500 hover:text-slate-800 pb-3',
    contained: isActive
      ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
  };

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
        variantTabStyles[variant]
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
            isActive
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-slate-200/80 text-slate-600'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  children,
  className = '',
  ...props
}) => {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isActive) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      className={`mt-4 focus-visible:outline-none animate-in fade-in duration-150 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Tabs;
