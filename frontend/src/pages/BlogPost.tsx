import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useBlogPost } from '@/hooks/useApi';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/#blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/#blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {post.is_featured && (
            <Badge className="mb-4 bg-primary">Featured</Badge>
          )}
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(post.content)}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* Simple content rendering - in a real app, you'd use a markdown parser */}
          <div className="whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <Button variant="outline" asChild>
              <Link to="/#blog">
                View All Posts
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;