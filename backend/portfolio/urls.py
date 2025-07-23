# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from . import views

# Create a router for any ViewSets (if needed)
router = DefaultRouter()

# URL patterns
urlpatterns = [
    # Authentication endpoints (JWT)
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Profile endpoints
    path('profile/', views.ProfileDetailView.as_view(), name='profile-detail'),
    path('admin/profile/', views.ProfileUpdateView.as_view(), name='profile-update'),
    
    # Emails sending endpoints
    path('send-email/', views.SendEmailView.as_view(), name='send-email'),
    
    # Project endpoints - Public
    path('projects/', views.ProjectListView.as_view(), name='project-list'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    
    # Project endpoints - Admin
    path('admin/projects/', views.ProjectListCreateView.as_view(), name='admin-project-list-create'),
    path('admin/projects/create/', views.ProjectCreateView.as_view(), name='admin-project-create'),
    path('admin/projects/<slug:slug>/', views.ProjectUpdateView.as_view(), name='admin-project-detail'),
    
    # Project Image endpoints - Admin
    path('admin/project-images/', views.ProjectImageListCreateView.as_view(), name='admin-project-image-list-create'),
    path('admin/projects/<slug:project_slug>/images/', views.ProjectImageListCreateView.as_view(), name='admin-project-images'),
    path('admin/project-images/<int:pk>/', views.ProjectImageDetailView.as_view(), name='admin-project-image-detail'),
    
    # Experience endpoints
    path('experience/', views.ExperienceListView.as_view(), name='experience-list'),
    path('admin/experience/', views.ExperienceListCreateView.as_view(), name='admin-experience-list-create'),
    path('admin/experience/create/', views.ExperienceCreateView.as_view(), name='admin-experience-create'),
    path('admin/experience/<int:pk>/', views.ExperienceDetailView.as_view(), name='admin-experience-detail'),
    
    # Education endpoints
    path('education/', views.EducationListView.as_view(), name='education-list'),
    path('admin/education/', views.EducationListCreateView.as_view(), name='admin-education-list-create'),
    path('admin/education/create/', views.EducationCreateView.as_view(), name='admin-education-create'),
    path('admin/education/<int:pk>/', views.EducationDetailView.as_view(), name='admin-education-detail'),
    
    # Testimonial endpoints
    path('testimonials/', views.TestimonialListView.as_view(), name='testimonial-list'),
    path('admin/testimonials/', views.TestimonialListCreateView.as_view(), name='admin-testimonial-list-create'),
    path('admin/testimonials/create/', views.TestimonialCreateView.as_view(), name='admin-testimonial-create'),
    path('admin/testimonials/<int:pk>/', views.TestimonialDetailView.as_view(), name='admin-testimonial-detail'),
    
    # Blog endpoints - Public
    path('blogs/', views.BlogPostListView.as_view(), name='blog-list'),
    path('blogs/<slug:slug>/', views.BlogPostDetailView.as_view(), name='blog-detail'),
    
    # Blog endpoints - Admin
    path('admin/blogs/', views.BlogPostListCreateView.as_view(), name='admin-blog-list-create'),
    path('admin/blogs/create/', views.BlogPostCreateView.as_view(), name='admin-blog-create'),
    path('admin/blogs/<slug:slug>/', views.BlogPostUpdateView.as_view(), name='admin-blog-detail'),
    
    # Utility endpoints
    path('tags/', views.get_all_tags, name='all-tags'),
    path('stats/', views.portfolio_stats, name='portfolio-stats'),
    path('tech-stack/', views.tech_stack_stats, name='tech-stack-stats'),
    
    # Include router URLs if any
    path('', include(router.urls)),
]

# Alternative URL patterns with API prefix (recommended)
api_v1_patterns = [
    # Authentication
    path('v1/auth/login/', TokenObtainPairView.as_view(), name='api-v1-login'),
    path('v1/auth/refresh/', TokenRefreshView.as_view(), name='api-v1-refresh'),
    path('v1/auth/verify/', TokenVerifyView.as_view(), name='api-v1-verify'),
    
    # Public API endpoints
    path('v1/profile/', views.ProfileDetailView.as_view(), name='api-v1-profile'),
    path('v1/projects/', views.ProjectListView.as_view(), name='api-v1-projects'),
    path('v1/projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='api-v1-project-detail'),
    path('v1/experience/', views.ExperienceListView.as_view(), name='api-v1-experience'),
    path('v1/education/', views.EducationListView.as_view(), name='api-v1-education'),
    path('v1/testimonials/', views.TestimonialListView.as_view(), name='api-v1-testimonials'),
    path('v1/blogs/', views.BlogPostListView.as_view(), name='api-v1-blogs'),
    path('v1/blogs/<slug:slug>/', views.BlogPostDetailView.as_view(), name='api-v1-blog-detail'),
    path('v1/tags/', views.get_all_tags, name='api-v1-tags'),
    path('v1/stats/', views.portfolio_stats, name='api-v1-stats'),
    path('v1/tech-stack/', views.tech_stack_stats, name='api-v1-tech-stack'),
    
    # Admin API endpoints
    path('v1/admin/profile/', views.ProfileUpdateView.as_view(), name='api-v1-admin-profile'),
    path('v1/admin/projects/', views.ProjectListCreateView.as_view(), name='api-v1-admin-projects'),
    path('v1/admin/projects/<slug:slug>/', views.ProjectUpdateView.as_view(), name='api-v1-admin-project-detail'),
    path('v1/admin/project-images/', views.ProjectImageListCreateView.as_view(), name='api-v1-admin-project-images'),
    path('v1/admin/project-images/<int:pk>/', views.ProjectImageDetailView.as_view(), name='api-v1-admin-project-image-detail'),
    path('v1/admin/experience/', views.ExperienceListCreateView.as_view(), name='api-v1-admin-experience'),
    path('v1/admin/experience/<int:pk>/', views.ExperienceDetailView.as_view(), name='api-v1-admin-experience-detail'),
    path('v1/admin/education/', views.EducationListCreateView.as_view(), name='api-v1-admin-education'),
    path('v1/admin/education/<int:pk>/', views.EducationDetailView.as_view(), name='api-v1-admin-education-detail'),
    path('v1/admin/testimonials/', views.TestimonialListCreateView.as_view(), name='api-v1-admin-testimonials'),
    path('v1/admin/testimonials/<int:pk>/', views.TestimonialDetailView.as_view(), name='api-v1-admin-testimonial-detail'),
    path('v1/admin/blogs/', views.BlogPostListCreateView.as_view(), name='api-v1-admin-blogs'),
    path('v1/admin/blogs/<slug:slug>/', views.BlogPostUpdateView.as_view(), name='api-v1-admin-blog-detail'),
]

# Main project urls.py should include:
"""
# In your main project's urls.py file:

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('portfolio.urls')),  # Using the first pattern
    # OR
    path('api/', include(('portfolio.urls', 'api_v1_patterns'), namespace='api')),  # Using versioned pattern
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
"""