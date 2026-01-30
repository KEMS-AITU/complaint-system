export type ComplaintStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'REJECTED';

export type Complaint = {
  id: number;
  text: string;
  status: ComplaintStatus;
  user: number;
  category: number | null;
  created_at: string;
  updated_at?: string;
};

export type Feedback = {
  id: number;
  complaint: number;
  user: number;
  comment: string;
  is_accepted: boolean;
  created_at: string;
};

export type AdminResponse = {
  id: number;
  complaint: number;
  admin: number;
  response_text: string;
  created_at: string;
};
