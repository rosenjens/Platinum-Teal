import { createRoot } from 'react-dom/client';
import Console from './console/Console';
import './style/main.scss';

createRoot(document.getElementById('app')).render(<Console />);
