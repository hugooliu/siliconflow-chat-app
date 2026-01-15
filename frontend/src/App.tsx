import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { SessionManager } from './components/SessionManager';
import { MessageList } from './components/MessageList';
import { InputArea } from './components/InputArea';
import { StatusIndicator } from './components/StatusIndicator';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SessionManager />
      <MessageList />
      <div className="px-4 py-2 bg-white border-t">
        <StatusIndicator />
      </div>
      <InputArea />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
