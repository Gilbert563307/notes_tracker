import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./assets/css/package.css";
import { RouterProvider } from 'react-router';
import router from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
