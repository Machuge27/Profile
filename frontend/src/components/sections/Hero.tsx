import { ArrowDown, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-image.jpg';


import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

const mockProfile = {
  name: 'John Doe',
  bio: 'Passionate developer with expertise in React, Node.js, and modern web technologies.',
  profile_picture: '/placeholder.svg',
  location: 'Nairobi, Kenya',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  linkedin_url: '#',
  github_url: '#',
  twitter_url: '#',
  website_url: '#',
};

const Hero = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    apiClient.getProfile()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setProfile(data);
        } else {
          setProfile(mockProfile);
        }
        setLoading(false);
      })
      .catch(() => {
        setProfile(mockProfile);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-gradient opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium">Welcome to my portfolio</p>
              <h1 className="text-3xl lg:text-6xl font-bold leading-tight">
                Hi, I'm{' '}
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  {profile?.name || 'John Doe'}
                </span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-muted-foreground">
                Full-Stack Developer
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {profile?.bio || "I craft beautiful, functional, and user-centered digital experiences. Let's build something amazing together."}
              </p>
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'Django']).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={profile?.profile_picture || heroImage}
                alt={profile?.name ? `${profile.name} - Software Developer` : 'John Doe - Software Developer'}
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-hero-gradient opacity-20 rounded-2xl" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-primary/20 rounded-full" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
