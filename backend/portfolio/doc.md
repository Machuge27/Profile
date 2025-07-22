# Portfolio API Documentation

## Overview
This REST API provides endpoints for managing a software developer's portfolio website. It includes both public endpoints for displaying portfolio information and protected admin endpoints for content management.

## Authentication
The API uses JWT (JSON Web Token) authentication for protected endpoints.

### Authentication Endpoints

#### Login
**POST** `/api/auth/login/`

Request body:
```json
{
    "username": "your_username",
    "password": "your_password"
}
```

Response:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Refresh Token
**POST** `/api/auth/refresh/`

Request body:
```json
{
    "refresh": "your_refresh_token"
}
```

#### Verify Token
**POST** `/api/auth/verify/`

Request body:
```json
{
    "token": "your_access_token"
}
```

### Using Authentication
Include the access token in the Authorization header for protected endpoints:
```
Authorization: Bearer your_access_token
```

## Sending email to me

#### Send mail
**POST** `/api/send-email/`

Request body:
```json
{
    "name": "Sender's name",
    "email": "Sender's email",
    "subject": "Email subject",
    "message": "Intended message"
}
```

Response:
Success:
```json
{
    "message": "Email sent successfully"
}
```

Failure:
```json
{
    "error": "Failed to send email",
    "details": "Error details here"
}
```

## Public API Endpoints

### Profile

#### Get Profile
**GET** `/api/profile/`

Response:
```json
{
    "name": "John Doe",
    "bio": "Full-stack developer with 5+ years experience...",
    "profile_picture": "http://example.com/media/profile/image.jpg",
    "location": "New York, NY",
    "skills": ["Python", "JavaScript", "React", "Django"],
    "github_url": "https://github.com/johndoe",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "twitter_url": "https://twitter.com/johndoe",
    "website_url": "https://johndoe.dev"
}
```

### Projects

#### List Projects
**GET** `/api/projects/`

Query Parameters:
- `featured` - Filter featured projects (true/false)
- `tag` - Filter by tag
- `search` - Search in title, description, tags

Response:
```json
[
    {
        "id": 1,
        "title": "E-commerce Platform",
        "slug": "e-commerce-platform",
        "description": "A full-stack e-commerce solution...",
        "tech_stack": ["Django", "React", "PostgreSQL"],
        "start_date": "2023-01-15",
        "end_date": "2023-06-30",
        "github_url": "https://github.com/johndoe/ecommerce",
        "live_demo_url": "https://demo.ecommerce.com",
        "playstore_url": null,
        "tags": ["web", "fullstack", "ecommerce"],
        "is_featured": true,
        "images": [
            {
                "id": 1,
                "image": "http://example.com/media/projects/image1.jpg",
                "caption": "Homepage screenshot",
                "order": 0
            }
        ]
    }
]
```

#### Get Project Details
**GET** `/api/projects/<slug>/`

Response: Single project object (same structure as list item)

### Experience

#### List Experience
**GET** `/api/experience/`

Response:
```json
[
    {
        "id": 1,
        "company_name": "Tech Corp",
        "position": "Senior Developer",
        "responsibilities": "Led development of web applications...",
        "start_date": "2020-01-01",
        "end_date": "2023-12-31",
        "is_current": false,
        "company_url": "https://techcorp.com",
        "location": "San Francisco, CA"
    }
]
```

### Education

#### List Education
**GET** `/api/education/`

Response:
```json
[
    {
        "id": 1,
        "institution": "University of Technology",
        "degree": "bachelor",
        "field_of_study": "Computer Science",
        "start_date": "2015-09-01",
        "end_date": "2019-06-01",
        "grade": "3.8 GPA",
        "details": "Graduated Magna Cum Laude..."
    }
]
```

### Testimonials

#### List Testimonials
**GET** `/api/testimonials/`

Query Parameters:
- `featured` - Filter featured testimonials (true/false)

Response:
```json
[
    {
        "id": 1,
        "reviewer_name": "Jane Smith",
        "reviewer_position": "Project Manager",
        "reviewer_company": "Tech Solutions Inc",
        "quote": "John delivered exceptional work...",
        "reviewer_image": "http://example.com/media/testimonials/jane.jpg",
        "reviewer_linkedin": "https://linkedin.com/in/janesmith",
        "is_featured": true,
        "order": 1
    }
]
```

### Blog Posts

#### List Blog Posts
**GET** `/api/blogs/`

Query Parameters:
- `featured` - Filter featured posts (true/false)
- `tag` - Filter by tag
- `search` - Search in title, content, excerpt, tags

Response:
```json
[
    {
        "id": 1,
        "title": "Getting Started with Django REST Framework",
        "slug": "getting-started-django-rest-framework",
        "content": "Django REST Framework is a powerful toolkit...",
        "excerpt": "Learn the basics of building APIs with DRF",
        "tags": ["django", "api", "tutorial"],
        "featured_image": "http://example.com/media/blog/django-rest.jpg",
        "is_featured": true,
        "published_at": "2023-10-15T10:00:00Z"
    }
]
```

#### Get Blog Post Details
**GET** `/api/blogs/<slug>/`

Response: Single blog post object (same structure as list item)

### Utility Endpoints

#### Get All Tags
**GET** `/api/tags/`

Response:
```json
{
    "project_tags": ["web", "mobile", "api"],
    "blog_tags": ["tutorial", "django", "react"],
    "all_tags": ["web", "mobile", "api", "tutorial", "django", "react"]
}
```

#### Portfolio Statistics
**GET** `/api/stats/`

Response:
```json
{
    "total_projects": 12,
    "featured_projects": 5,
    "total_blog_posts": 8,
    "featured_blog_posts": 3,
    "total_experience": 4,
    "total_education": 2,
    "total_testimonials": 6,
    "featured_testimonials": 3
}
```

#### Tech Stack Statistics
**GET** `/api/tech-stack/`

Response:
```json
{
    "tech_stack": {
        "Python": 8,
        "JavaScript": 6,
        "React": 4,
        "Django": 7
    },
    "most_used": [
        ["Python", 8],
        ["Django", 7],
        ["JavaScript", 6],
        ["React", 4]
    ]
}
```

## Admin API Endpoints
All admin endpoints require authentication.

### Profile Management

#### Update Profile
**PUT/PATCH** `/api/admin/profile/`

Request body:
```json
{
    "name": "John Doe",
    "bio": "Updated bio...",
    "location": "Los Angeles, CA",
    "skills": ["Python", "Django", "React", "Vue.js"],
    "github_url": "https://github.com/johndoe",
    "linkedin_url": "https://linkedin.com/in/johndoe"
}
```

### Project Management

#### Create Project
**POST** `/api/admin/projects/`

Request body:
```json
{
    "title": "New Project",
    "description": "Project description...",
    "tech_stack": ["Python", "Django"],
    "start_date": "2023-01-01",
    "end_date": "2023-06-01",
    "github_url": "https://github.com/user/project",
    "tags": ["web", "backend"],
    "is_featured": true
}
```

#### Update Project
**PUT/PATCH** `/api/admin/projects/<slug>/`

#### Delete Project
**DELETE** `/api/admin/projects/<slug>/`

### Project Images

#### Add Project Image
**POST** `/api/admin/project-images/`

Request body (multipart/form-data):
```
project: 1
image: [file]
caption: Screenshot of dashboard
order: 1
```

#### Update Project Image
**PUT/PATCH** `/api/admin/project-images/<id>/`

#### Delete Project Image
**DELETE** `/api/admin/project-images/<id>/`

### Experience Management

#### Create Experience
**POST** `/api/admin/experience/`

Request body:
```json
{
    "company_name": "New Company",
    "position": "Software Engineer",
    "responsibilities": "Developed web applications...",
    "start_date": "2023-01-01",
    "is_current": true,
    "company_url": "https://company.com",
    "location": "Remote"
}
```

#### Update Experience
**PUT/PATCH** `/api/admin/experience/<id>/`

#### Delete Experience
**DELETE** `/api/admin/experience/<id>/`

### Education Management

#### Create Education
**POST** `/api/admin/education/`

Request body:
```json
{
    "institution": "University Name",
    "degree": "master",
    "field_of_study": "Software Engineering",
    "start_date": "2019-09-01",
    "end_date": "2021-06-01",
    "grade": "4.0 GPA",
    "details": "Specialized in AI and Machine Learning"
}
```

#### Update Education
**PUT/PATCH** `/api/admin/education/<id>/`

#### Delete Education
**DELETE** `/api/admin/education/<id>/`

### Testimonial Management

#### Create Testimonial
**POST** `/api/admin/testimonials/`

Request body:
```json
{
    "reviewer_name": "Client Name",
    "reviewer_position": "CEO",
    "reviewer_company": "Company Inc",
    "quote": "Excellent work and communication...",
    "reviewer_linkedin": "https://linkedin.com/in/client",
    "is_featured": true,
    "order": 1
}
```

#### Update Testimonial
**PUT/PATCH** `/api/admin/testimonials/<id>/`

#### Delete Testimonial
**DELETE** `/api/admin/testimonials/<id>/`

### Blog Management

#### Create Blog Post
**POST** `/api/admin/blogs/`

Request body:
```json
{
    "title": "New Blog Post",
    "content": "Blog content...",
    "excerpt": "Short description",
    "tags": ["tutorial", "django"],
    "status": "published",
    "is_featured": false,
    "published_at": "2023-10-20T10:00:00Z"
}
```

#### Update Blog Post
**PUT/PATCH** `/api/admin/blogs/<slug>/`

#### Delete Blog Post
**DELETE** `/api/admin/blogs/<slug>/`

## Validation Rules

### Required Fields
- **Profile**: name, bio
- **Project**: title, description, tech_stack, start_date
- **Experience**: company_name, position, responsibilities, start_date
- **Education**: institution, degree, field_of_study, start_date
- **Testimonial**: reviewer_name, reviewer_position, quote
- **Blog Post**: title, content, status

### Field Constraints
- **Profile.skills**: Must be a list/array
- **Project.tech_stack**: Must be a list/array
- **Project.tags**: Must be a list/array
- **Blog.tags**: Must be a list/array
- **Date fields**: start_date must be before end_date
- **URLs**: Must be valid URL format
- **Blog.excerpt**: Maximum 500 characters

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"],
    "non_field_errors": ["General error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Example cURL Commands

### Get Profile
```bash
curl -X GET "http://localhost:8000/api/profile/"
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login/" \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "password"}'
```

### Create Project (Admin)
```bash
curl -X POST "http://localhost:8000/api/admin/projects/" \
     -H "Authorization: Bearer your_access_token" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "New Project",
       "description": "A new project description",
       "tech_stack": ["Python", "Django"],
       "start_date": "2023-01-01",
       "tags": ["web", "backend"]
     }'
```

### Upload Project Image
```bash
curl -X POST "http://localhost:8000/api/admin/project-images/" \
     -H "Authorization: Bearer your_access_token" \
     -F "project=1" \
     -F "image=@/path/to/image.jpg" \
     -F "caption=Project screenshot" \
     -F "order=1"
```

### Get Projects with Filters
```bash
curl -X GET "http://localhost:8000/api/projects/?featured=true&tag=web"
```

## Media Upload Support
The API supports image uploads for:
- Profile pictures
- Project images (multiple per project)
- Testimonial reviewer images
- Blog featured images

Images are uploaded to separate directories:
- Profile images: `media/profile/`
- Project images: `media/projects/`
- Testimonial images: `media/testimonials/`
- Blog images: `media/blog/`

## Rate Limiting
Consider implementing rate limiting for production use, especially for public endpoints.

## CORS Configuration
Configure CORS settings to allow your frontend application to access the API.

## Production Considerations
1. Use environment variables for sensitive settings
2. Configure proper media file serving (S3, CloudFront, etc.)
3. Implement proper logging and monitoring
4. Add rate limiting and security middleware
5. Use HTTPS in production
6. Configure proper database settings and backups