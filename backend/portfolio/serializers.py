# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, Project, ProjectImage, Experience, 
    Education, Testimonial, BlogPost, Messages
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'name', 'bio', 'profile_picture', 'location', 
            'skills', 'github_url', 'linkedin_url', 'twitter_url', 'website_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating profile (admin only)"""
    
    class Meta:
        model = Profile
        fields = [
            'name', 'bio', 'profile_picture', 'location', 
            'skills', 'github_url', 'linkedin_url', 'twitter_url', 'website_url'
        ]
    
    def validate_skills(self, value):
        """Validate that skills is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Skills must be a list.")
        return value


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'caption', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

class MessagesSerializer(serializers.ModelSerializer):
    """Serializer for Messages model"""
    class Meta:
        model = Messages
        fields = [
            'id', 'name', 'email', 'subject', 'message', 'is_read',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_read', 'created_at', 'updated_at']

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Name is required.")
        if not data.get('email'):
            raise serializers.ValidationError("Email is required.")
        if not data.get('subject'):
            raise serializers.ValidationError("Subject is required.")
        if not data.get('message'):
            raise serializers.ValidationError("Message is required.")
        return data

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'tech_stack', 
            'start_date', 'end_date', 'github_url', 'live_demo_url', 
            'playstore_url', 'tags', 'priority', 'is_featured', 
            'images', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def validate_tech_stack(self, value):
        """Validate that tech_stack is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tech stack must be a list.")
        return value
    
    def validate_tags(self, value):
        """Validate that tags is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        return value
    
    def validate(self, data):
        """Validate that start_date is before end_date"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date.")
        
        return data


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating projects (admin only)"""
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'tech_stack', 'start_date', 'end_date',
            'github_url', 'live_demo_url', 'playstore_url', 'tags', 
            'priority', 'is_featured'
        ]
    
    def validate_tech_stack(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Tech stack must be a list.")
        return value
    
    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        return value
    
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date.")
        
        return data


class ProjectImageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating project images (admin only)"""
    
    class Meta:
        model = ProjectImage
        fields = ['project', 'image', 'caption', 'order']
    
    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Order must be a non-negative integer.")
        return value


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'company_name', 'position', 'responsibilities', 
            'start_date', 'end_date', 'is_current', 'company_url', 
            'location', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate that start_date is before end_date"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        is_current = data.get('is_current', False)
        
        if not is_current and start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date.")
        
        if is_current and end_date:
            raise serializers.ValidationError("Current position cannot have an end date.")
        
        return data


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field_of_study', 
            'start_date', 'end_date', 'grade', 'details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, data):
        """Validate that start_date is before end_date"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError("Start date must be before end date.")
        
        return data


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'reviewer_name', 'reviewer_position', 'reviewer_company',
            'quote', 'reviewer_image', 'reviewer_linkedin', 'is_featured',
            'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Order must be a non-negative integer.")
        return value


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'tags',
            'status', 'featured_image', 'is_featured', 'created_at',
            'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def validate_tags(self, value):
        """Validate that tags is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        return value


class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating blog posts (admin only)"""
    
    class Meta:
        model = BlogPost
        fields = [
            'title', 'content', 'excerpt', 'tags', 'status',
            'featured_image', 'is_featured', 'published_at'
        ]
    
    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be a list.")
        return value
    
    def validate_excerpt(self, value):
        if len(value) > 500:
            raise serializers.ValidationError("Excerpt cannot exceed 500 characters.")
        return value


# Public serializers (limited fields for public API)
class PublicProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'tech_stack',
            'start_date', 'end_date', 'github_url', 'live_demo_url',
            'playstore_url', 'tags', 'is_featured', 'images'
        ]


class PublicBlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'tags',
            'featured_image', 'is_featured', 'published_at'
        ]


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'name', 'bio', 'profile_picture', 'location',
            'skills', 'github_url', 'linkedin_url', 'twitter_url', 'website_url'
        ]