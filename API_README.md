# Complaint System API Endpoints

Base URLs:
- Root: `http://127.0.0.1:8000/`
- API prefix (same routes): `http://127.0.0.1:8000/api/`

Auth:
- All endpoints require authentication unless noted.
- Admin endpoints also require a user with role `ADMIN`.
- Use token auth for API calls:
  - Header: `Authorization: Token <token>`
- Auth endpoints:
  - `POST /api/auth/register/`
    - Create a user account.
    - Request fields: `username`, `password`, `email` (optional), `first_name` (optional), `last_name` (optional), `role` (optional).
  - `POST /api/auth/login/` or `POST /api/auth/token/`
    - Get an auth token.
    - Request fields: `username`, `password`.
    - Response: `{"token": "<token>"}`
  - Example `fetch` (login + call an endpoint):
    ```javascript
    // Login and get token
    const loginRes = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'client1', password: 'pass1234' }),
    });
    const { token } = await loginRes.json();

    // Call a protected endpoint
    const res = await fetch('http://127.0.0.1:8000/api/complaints/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ text: 'Example complaint', category: 1 }),
    });
    const data = await res.json();
    ```

Client endpoints:
- `POST /complaints/`
  - Create a complaint for the authenticated user.
  - Request fields: `text`, `category` (category ID). `status`, `user`, `created_at` are set by the server.
- `GET /complaints/{id}/`
  - Retrieve a complaint by ID.
- `POST /feedback/`
  - Create feedback for a complaint.
  - Request fields: `complaint` (ID), `comment`, `is_accepted` (optional).

Admin endpoints:
- `GET /admin/complaints/`
  - List all complaints.
- `PATCH /admin/complaints/{id}/status/`
  - Update complaint fields (typically `status`).
- `POST /admin/response/`
  - Create an admin response for a complaint.
  - Request fields: `complaint` (ID), `response_text`.

Data models (key fields):
- Complaint: `id`, `text`, `status`, `user`, `category`, `created_at`
- Feedback: `id`, `complaint`, `user`, `comment`, `is_accepted`, `created_at`
- AdminResponse: `id`, `complaint`, `admin`, `response_text`, `created_at`
