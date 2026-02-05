import type { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { CreateComplaintPage } from '../pages/CreateComplaintPage';
import { MyComplaintsPage } from '../pages/MyComplaintsPage';
import { ComplaintDetailPage } from '../pages/ComplaintDetailPage';
import { TrackComplaintPage } from '../pages/TrackComplaintPage';
import { FeedbackPage } from '../pages/FeedbackPage';
import { AccountPage } from '../pages/AccountPage';
import { RequireAuth } from './RequireAuth';

export const routes: RouteObject[] = [
  { index: true, element: <RequireAuth><HomePage /></RequireAuth> },
  { path: 'create', element: <RequireAuth><CreateComplaintPage /></RequireAuth> },
  { path: 'my-complaints', element: <RequireAuth><MyComplaintsPage /></RequireAuth> },
  { path: 'complaints/:id', element: <RequireAuth><ComplaintDetailPage /></RequireAuth> },
  { path: 'track', element: <RequireAuth><TrackComplaintPage /></RequireAuth> },
  { path: 'feedback', element: <RequireAuth><FeedbackPage /></RequireAuth> },
  { path: 'account', element: <RequireAuth><AccountPage /></RequireAuth> },
];
