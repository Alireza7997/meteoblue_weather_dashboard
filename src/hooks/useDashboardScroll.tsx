'use client';

import { createContext, useContext, type ReactNode, type RefObject } from 'react';
import { motionValue, type MotionValue } from 'framer-motion';

interface DashboardScrollContextValue {
  progress: MotionValue<number>;
  containerRef: RefObject<HTMLElement | null>;
}

const DashboardScrollContext = createContext<DashboardScrollContextValue | null>(null);

const STATIC_PROGRESS = motionValue(0);

export function DashboardScrollProvider({
  value,
  children,
}: {
  value: DashboardScrollContextValue;
  children: ReactNode;
}) {
  return <DashboardScrollContext.Provider value={value}>{children}</DashboardScrollContext.Provider>;
}

export function useDashboardScroll(): DashboardScrollContextValue {
  return (
    useContext(DashboardScrollContext) ?? {
      progress: STATIC_PROGRESS,
      containerRef: { current: null },
    }
  );
}
