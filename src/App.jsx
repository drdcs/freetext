import { TabProvider } from './context/TabContext';
import { ThemeProvider } from './context/ThemeContext';
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <ThemeProvider>
      <TabProvider>
        <AppShell />
      </TabProvider>
    </ThemeProvider>
  );
}

export default App;
