# 04. REST API Endpoint Specification

Base URL: `/api`

---

## 1. Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `POST` | `/api/auth/logout` | Invalidate current session | Yes |
| `GET` | `/api/auth/profile` | Get current logged-in user profile | Yes |

---

## 2. Folder Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/folders` | Get folder hierarchy for current user | Yes |
| `POST` | `/api/folders` | Create a new folder (root or child) | Yes |
| `PUT` | `/api/folders/:id` | Update folder name, icon, or color | Yes |
| `PUT` | `/api/folders/:id/move` | Change parent folder (move folder) | Yes |
| `DELETE` | `/api/folders/:id` | Delete folder & child contents | Yes |

---

## 3. Chapter Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chapters` | Create chapter (text paste or parsed file) | Yes |
| `GET` | `/api/chapters` | List chapters (supports `?folderId=...`) | Yes |
| `GET` | `/api/chapters/:id` | Get single chapter + hub summary | Yes |
| `PUT` | `/api/chapters/:id` | Edit chapter title/subject/content | Yes |
| `DELETE` | `/api/chapters/:id` | Delete chapter and associated quizzes | Yes |

---

## 4. Quiz Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/quizzes/generate` | Generate fresh quiz from chapter via AI | Yes |
| `GET` | `/api/quizzes/:id` | Get quiz with questions | Yes |
| `POST` | `/api/quizzes/submit` | Submit answers & process scoring | Yes |
| `POST` | `/api/quizzes/retry` | Generate adaptive retry for weak concepts | Yes |
| `POST` | `/api/quizzes/revision` | Generate smart revision quiz | Yes |
| `GET` | `/api/quizzes/history` | Get user quiz attempt history | Yes |

---

## 5. Analytics & Bookmarks Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Overall stats, streaks, weak/strong concepts | Yes |
| `GET` | `/api/analytics/progress` | Daily/weekly/monthly accuracy trend | Yes |
| `POST` | `/api/bookmarks` | Bookmark a question | Yes |
| `GET` | `/api/bookmarks` | Get all bookmarked questions | Yes |
| `DELETE` | `/api/bookmarks/:id` | Remove bookmark | Yes |
| `POST` | `/api/questions/:id/note` | Save personal note for a question | Yes |
