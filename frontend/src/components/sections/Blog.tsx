import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/useApi';

const Blog = () => {
  const { data: blogPosts = [], isLoading } = useBlogPosts({ featured: true });

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

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts, tutorials, and insights from my development journey
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted animate-pulse" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-3 bg-muted rounded animate-pulse w-20" />
                      <div className="h-3 bg-muted rounded animate-pulse w-16" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded animate-pulse w-12" />
                      <div className="h-6 bg-muted rounded animate-pulse w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0">
                {/* Featured Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary/40">
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {post.is_featured && (
                    <Badge className="absolute top-3 left-3 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getReadingTime(post.content)}</span>
                    </div>
                  </div>

                  {/* Title and Excerpt */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Read More Link */}
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                    asChild
                  >
                    <a href={`/blog/${post.slug}`} className="group/link flex items-center gap-1">
                      Read more
                      <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}

        {/* View All Posts Button */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;