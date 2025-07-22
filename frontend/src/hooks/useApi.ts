import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Profile, Project, Experience, Education, Testimonial, BlogPost } from '@/types/api';

// Mock data fallbacks
const mockProfile: Profile = {
  name: 'John Doe',
  bio: 'Passionate developer with expertise in React, Node.js, and modern web technologies.',
  profile_picture: '/placeholder.svg',
  location: 'San Francisco, CA',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  linkedin_url: 'https://linkedin.com/in/johndoe',
  github_url: 'https://github.com/johndoe',
  twitter_url: 'https://twitter.com/johndoe',
  website_url: 'https://johndoe.dev',
};

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce solution built with React and Node.js',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    start_date: '2023-06-01T00:00:00Z',
    end_date: '2023-08-15T00:00:00Z',
    github_url: 'https://github.com/johndoe/ecommerce',
    live_demo_url: 'https://ecommerce-demo.com',
    playstore_url: null,
    tags: ['fullstack', 'ecommerce', 'react'],
    is_featured: true,
    images: [
      { id: 1, image: '/placeholder.svg', caption: 'Homepage', order: 1 },
      { id: 2, image: '/placeholder.svg', caption: 'Product page', order: 2 },
    ],
  },
  {
    id: 2,
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'A collaborative task management application',
    tech_stack: ['Vue.js', 'Express', 'PostgreSQL'],
    start_date: '2023-04-01T00:00:00Z',
    end_date: '2023-06-20T00:00:00Z',
    github_url: 'https://github.com/johndoe/taskapp',
    live_demo_url: 'https://taskapp-demo.com',
    playstore_url: null,
    tags: ['frontend', 'productivity', 'vue'],
    is_featured: true,
    images: [
      { id: 3, image: '/placeholder.svg', caption: 'Dashboard', order: 1 },
    ],
  },
];

const mockExperience: Experience[] = [
  {
    id: 1,
    company_name: 'Tech Corp',
    position: 'Senior Full Stack Developer',
    responsibilities: 'Led development of multiple web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.',
    start_date: '2022-01-15T00:00:00Z',
    end_date: null,
    is_current: true,
    company_url: 'https://techcorp.com',
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    company_name: 'StartupXYZ',
    position: 'Frontend Developer',
    responsibilities: 'Developed responsive web applications and improved user experience. Implemented modern frontend technologies and best practices.',
    start_date: '2020-06-01T00:00:00Z',
    end_date: '2021-12-31T00:00:00Z',
    is_current: false,
    company_url: 'https://startupxyz.com',
    location: 'Remote',
  },
];

const mockEducation: Education[] = [
  {
    id: 1,
    institution: 'University of Technology',
    degree: 'bachelor',
    field_of_study: 'Computer Science',
    start_date: '2016-09-01T00:00:00Z',
    end_date: '2020-05-15T00:00:00Z',
    grade: '3.8',
    details: 'Focused on software engineering and web development',
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    reviewer_name: 'Sarah Johnson',
    reviewer_position: 'Product Manager',
    reviewer_company: 'Tech Corp',
    quote: 'John is an exceptional developer who consistently delivers high-quality work.',
    reviewer_image: '/placeholder.svg',
    reviewer_linkedin: 'https://linkedin.com/in/sarahjohnson',
    is_featured: true,
    order: 1,
  },
  {
    id: 2,
    reviewer_name: 'Mike Chen',
    reviewer_position: 'CTO',
    reviewer_company: 'StartupXYZ',
    quote: 'Working with John was a pleasure. His technical skills are outstanding.',
    reviewer_image: '/placeholder.svg',
    reviewer_linkedin: 'https://linkedin.com/in/mikechen',
    is_featured: true,
    order: 2,
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Getting Started with React Query',
    slug: 'getting-started-react-query',
    content: 'React Query is a powerful data fetching library that makes managing server state in React applications much easier. In this comprehensive guide, we\'ll explore how to set up React Query, perform basic queries, and handle loading states and errors effectively.',
    excerpt: 'Learn how to efficiently manage server state in React applications with React Query.',
    tags: ['react', 'javascript', 'tutorial'],
    featured_image: '/placeholder.svg',
    is_featured: true,
    published_at: '2023-10-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Building Scalable Node.js APIs',
    slug: 'building-scalable-nodejs-apis',
    content: 'When building APIs for production, scalability should be a primary concern from day one. This article covers best practices for creating robust, maintainable, and scalable RESTful APIs using Node.js and Express.',
    excerpt: 'Best practices for creating robust and scalable RESTful APIs with Node.js and Express.',
    tags: ['nodejs', 'api', 'backend'],
    featured_image: '/placeholder.svg',
    is_featured: true,
    published_at: '2023-10-01T14:30:00Z',
  },
  {
    id: 3,
    title: 'CSS Grid vs Flexbox: When to Use What',
    slug: 'css-grid-vs-flexbox',
    content: 'CSS Grid and Flexbox are both powerful layout systems, but they excel in different scenarios. Understanding when to use each one will make you a more effective frontend developer.',
    excerpt: 'A comprehensive guide to choosing between CSS Grid and Flexbox for your layouts.',
    tags: ['css', 'frontend', 'design'],
    featured_image: '/placeholder.svg',
    is_featured: false,
    published_at: '2023-09-20T09:15:00Z',
  },
];

// Custom hooks with fallback logic
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    placeholderData: mockProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useProjects = (params?: { featured?: boolean; tag?: string; search?: string }) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => apiClient.getProjects(params),
    placeholderData: mockProjects,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => apiClient.getProject(slug),
    placeholderData: mockProjects.find(p => p.slug === slug),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!slug,
  });
};

export const useExperience = () => {
  return useQuery({
    queryKey: ['experience'],
    queryFn: () => apiClient.getExperience(),
    placeholderData: mockExperience,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useEducation = () => {
  return useQuery({
    queryKey: ['education'],
    queryFn: () => apiClient.getEducation(),
    placeholderData: mockEducation,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useTestimonials = (featured?: boolean) => {
  return useQuery({
    queryKey: ['testimonials', featured],
    queryFn: () => apiClient.getTestimonials(featured),
    placeholderData: mockTestimonials,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useBlogPosts = (params?: { featured?: boolean; tag?: string; search?: string }) => {
  return useQuery({
    queryKey: ['blogPosts', params],
    queryFn: () => apiClient.getBlogPosts(params),
    placeholderData: mockBlogPosts,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => apiClient.getBlogPost(slug),
    placeholderData: mockBlogPosts.find(p => p.slug === slug),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!slug,
  });
};