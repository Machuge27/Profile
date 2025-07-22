export interface Profile {
  name: string;
  bio: string;
  profile_picture: string;
  location: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
}

export interface ProjectImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  start_date: string;
  end_date: string | null;
  github_url: string | null;
  live_demo_url: string | null;
  playstore_url: string | null;
  tags: string[];
  is_featured: boolean;
  images: ProjectImage[];
}

export interface Experience {
  id: number;
  company_name: string;
  position: string;
  responsibilities: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  company_url: string | null;
  location: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: 'bachelor' | 'master' | 'phd' | 'diploma' | 'certificate';
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  grade: string | null;
  details: string | null;
}

export interface Testimonial {
  id: number;
  reviewer_name: string;
  reviewer_position: string;
  reviewer_company: string;
  quote: string;
  reviewer_image: string | null;
  reviewer_linkedin: string | null;
  is_featured: boolean;
  order: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  featured_image: string | null;
  is_featured: boolean;
  published_at: string;
}

export interface Tags {
  project_tags: string[];
  blog_tags: string[];
  all_tags: string[];
}

export interface Stats {
  total_projects: number;
  featured_projects: number;
  total_blog_posts: number;
  featured_blog_posts: number;
  total_experience: number;
  total_education: number;
  total_testimonials: number;
  featured_testimonials: number;
}

export interface TechStackStats {
  tech_stack: Record<string, number>;
  most_used: [string, number][];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}