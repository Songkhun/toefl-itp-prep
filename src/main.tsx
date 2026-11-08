import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { openStore } from './storage/store';

void openStore().then((store) => {
  createRoot(document.getElementById('root')!).render(<App store={store} />);
});
