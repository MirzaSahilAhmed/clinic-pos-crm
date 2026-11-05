'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [currentTab, setCurrentTab] = React.useState(value || defaultValue || '');

  React.useEffect(() => {
    if (value !== undefined) setCurrentTab(value);
  }, [value]);

  const handleSelect = (tab: string) => {
    setCurrentTab(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleSelect }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 border-b border-slate-200 w-full overflow-x-auto pb-px text-sm font-medium text-slate-500',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  badge,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  badge?: number | string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      onClick={() => context.setActiveTab(value)}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer',
        isActive
          ? 'border-teal-600 text-teal-700 font-semibold'
          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300',
        className
      )}
    >
      {children}
      {badge !== undefined && (
        <span
          className={cn(
            'px-2 py-0.5 text-xs rounded-full',
            isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.activeTab !== value) return null;

  return <div className={cn('pt-4 animate-in fade-in duration-150', className)}>{children}</div>;
}
