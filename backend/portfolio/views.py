# views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication
from django.shortcuts import get_object_or_404
from django.db.models import Q
import requests

from .models import (
    Profile, Project, ProjectImage, Experience,
    Education, Testimonial, BlogPost, Messages
)
from .serializers import (
    ProfileSerializer, ProfileUpdateSerializer, PublicProfileSerializer,
    ProjectSerializer, ProjectCreateUpdateSerializer, PublicProjectSerializer,
    ProjectImageSerializer, ProjectImageCreateSerializer,
    ExperienceSerializer, EducationSerializer, TestimonialSerializer,
    BlogPostSerializer, BlogPostCreateUpdateSerializer, PublicBlogPostSerializer,
    MessagesSerializer
)

def send_email_via_service(email, subject, message):
    """Helper function to send emails via external mail microservice"""
    try:
        response = requests.post(
            "https://mutaiservices.pythonanywhere.com/auth/test_mail/",
            json={
                "email": "mutaihillary278@gmail.com",
                "subject": "🚨 PORTFOLIO: " + subject,
                "body": message,
            },
            timeout=10,
        )
        response.raise_for_status()
        return True, None
    except requests.RequestException as e:
        return False, str(e)

# Custom permission class
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner/admin
        return request.user.is_staff or request.user.is_superuser


# Profile Views
class ProfileDetailView(generics.RetrieveAPIView):
    """Public endpoint to get profile information"""
    serializer_class = PublicProfileSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        # Get the first profile (assuming single user portfolio)
        return get_object_or_404(Profile)


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    """Admin endpoint to update profile"""
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    
    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile


class SendEmailView(generics.CreateAPIView):
    """Endpoint for clients to send emails and save message"""
    serializer_class = MessagesSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Save message to DB
        message_obj = serializer.save()
        # Send email via external service
        success, error = send_email_via_service(
            serializer.validated_data['email'],
            serializer.validated_data['subject'],
            serializer.validated_data['message']
        )
        if not success:
            return Response({"error": "Failed to send email", "details": error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Email sent successfully"}, status=status.HTTP_200_OK)

# Project Views
class ProjectListView(generics.ListAPIView):
    """Public endpoint to list all projects"""
    serializer_class = PublicProjectSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filter parameters
        featured = self.request.query_params.get('featured', None)
        tag = self.request.query_params.get('tag', None)
        search = self.request.query_params.get('search', None)
        
        if featured is not None:
            queryset = queryset.filter(is_featured=True)
        
        if tag is not None:
            queryset = queryset.filter(tags__icontains=tag)
        
        if search is not None:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(tags__icontains=search)
            )
        
        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """Public endpoint to get project details"""
    serializer_class = PublicProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    queryset = Project.objects.all()


class ProjectCreateView(generics.CreateAPIView):
    """Admin endpoint to create projects"""
    serializer_class = ProjectCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]


class ProjectUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete projects"""
    serializer_class = ProjectCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    lookup_field = 'slug'
    queryset = Project.objects.all()


class ProjectListCreateView(generics.ListCreateAPIView):
    """Admin endpoint to list/create projects"""
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Project.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateUpdateSerializer
        return ProjectSerializer


# Project Image Views
class ProjectImageListCreateView(generics.ListCreateAPIView):
    """Admin endpoint to list/create project images"""
    serializer_class = ProjectImageCreateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    
    def get_queryset(self):
        project_slug = self.kwargs.get('project_slug')
        if project_slug:
            return ProjectImage.objects.filter(project__slug=project_slug)
        return ProjectImage.objects.all()


class ProjectImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete project images"""
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ProjectImage.objects.all()


# Experience Views
class ExperienceListView(generics.ListAPIView):
    """Public endpoint to list experience"""
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    queryset = Experience.objects.all()


class ExperienceCreateView(generics.CreateAPIView):
    """Admin endpoint to create experience"""
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete experience"""
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Experience.objects.all()


class ExperienceListCreateView(generics.ListCreateAPIView):
    """Combined endpoint for listing (public) and creating (admin) experience"""
    serializer_class = ExperienceSerializer
    queryset = Experience.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication(), SessionAuthentication()]
        return []


# Education Views
class EducationListView(generics.ListAPIView):
    """Public endpoint to list education"""
    serializer_class = EducationSerializer
    permission_classes = [AllowAny]
    queryset = Education.objects.all()


class EducationCreateView(generics.CreateAPIView):
    """Admin endpoint to create education"""
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete education"""
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Education.objects.all()


class EducationListCreateView(generics.ListCreateAPIView):
    """Combined endpoint for listing (public) and creating (admin) education"""
    serializer_class = EducationSerializer
    queryset = Education.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication(), SessionAuthentication()]
        return []


# Testimonial Views
class TestimonialListView(generics.ListAPIView):
    """Public endpoint to list testimonials"""
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Testimonial.objects.all()
        featured = self.request.query_params.get('featured', None)
        
        if featured is not None:
            queryset = queryset.filter(is_featured=True)
        
        return queryset


class TestimonialCreateView(generics.CreateAPIView):
    """Admin endpoint to create testimonials"""
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]


class TestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete testimonials"""
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Testimonial.objects.all()


class TestimonialListCreateView(generics.ListCreateAPIView):
    """Combined endpoint for listing (public) and creating (admin) testimonials"""
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.all()
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication(), SessionAuthentication()]
        return []


# Blog Views
class BlogPostListView(generics.ListAPIView):
    """Public endpoint to list published blog posts"""
    serializer_class = PublicBlogPostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(status='published')
        
        # Filter parameters
        featured = self.request.query_params.get('featured', None)
        tag = self.request.query_params.get('tag', None)
        search = self.request.query_params.get('search', None)
        
        if featured is not None:
            queryset = queryset.filter(is_featured=True)
        
        if tag is not None:
            queryset = queryset.filter(tags__icontains=tag)
        
        if search is not None:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(content__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(tags__icontains=search)
            )
        
        return queryset


class BlogPostDetailView(generics.RetrieveAPIView):
    """Public endpoint to get blog post details"""
    serializer_class = PublicBlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return BlogPost.objects.filter(status='published')


class BlogPostCreateView(generics.CreateAPIView):
    """Admin endpoint to create blog posts"""
    serializer_class = BlogPostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]


class BlogPostUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Admin endpoint to update/delete blog posts"""
    serializer_class = BlogPostCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    lookup_field = 'slug'
    queryset = BlogPost.objects.all()


class BlogPostListCreateView(generics.ListCreateAPIView):
    """Combined endpoint for listing (public) and creating (admin) blog posts"""
    queryset = BlogPost.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogPostCreateUpdateSerializer
        return BlogPostSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication(), SessionAuthentication()]
        return []
    
    def get_queryset(self):
        if self.request.method == 'GET':
            # Public access - only published posts
            return BlogPost.objects.filter(status='published')
        # Admin access - all posts
        return BlogPost.objects.all()


# Additional utility views
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_tags(request):
    """Get all unique tags across projects and blogs"""
    project_tags = []
    blog_tags = []
    
    for project in Project.objects.all():
        project_tags.extend(project.tags)
    
    for blog in BlogPost.objects.filter(status='published'):
        blog_tags.extend(blog.tags)
    
    all_tags = list(set(project_tags + blog_tags))
    
    return Response({
        'project_tags': list(set(project_tags)),
        'blog_tags': list(set(blog_tags)),
        'all_tags': all_tags
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def portfolio_stats(request):
    """Get portfolio statistics"""
    stats = {
        'total_projects': Project.objects.count(),
        'featured_projects': Project.objects.filter(is_featured=True).count(),
        'total_blog_posts': BlogPost.objects.filter(status='published').count(),
        'featured_blog_posts': BlogPost.objects.filter(status='published', is_featured=True).count(),
        'total_experience': Experience.objects.count(),
        'total_education': Education.objects.count(),
        'total_testimonials': Testimonial.objects.count(),
        'featured_testimonials': Testimonial.objects.filter(is_featured=True).count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([AllowAny])
def tech_stack_stats(request):
    """Get technology stack statistics"""
    tech_counts = {}
    
    for project in Project.objects.all():
        for tech in project.tech_stack:
            tech_counts[tech] = tech_counts.get(tech, 0) + 1
    
    # Sort by usage count
    sorted_tech = sorted(tech_counts.items(), key=lambda x: x[1], reverse=True)
    
    return Response({
        'tech_stack': dict(sorted_tech),
        'most_used': sorted_tech[:10] if sorted_tech else []
    })
