import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type DataMode = 'live' | 'demo';

interface DataModeContextValue {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  isDemo: boolean;
}

const DataModeContext = createContext<DataModeContextValue | undefined>(undefined);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DataMode>('demo');

  const value = useMemo(
    () => ({ mode, setMode, isDemo: mode === 'demo' }),
    [mode]
  );

  return <DataModeContext.Provider value={value}>{children}</DataModeContext.Provider>;
}

export function useDataMode() {
  const context = useContext(DataModeContext);
  if (!context) {
    throw new Error('useDataMode must be used within DataModeProvider');
  }
  return context;
}
