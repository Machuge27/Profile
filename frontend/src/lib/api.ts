import type {
  Profile,
  Project,
  Experience,
  Education,
  Testimonial,
  BlogPost,
  Tags,
  Stats,
  TechStackStats,
  ContactForm,
  AuthTokens,
  LoginCredentials,
} from "@/types/api";

// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = 'https://mutaiprofile.pythonanywhere.com/api';

// Follow APIs documentation
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    let token = localStorage.getItem("access_token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // If token expired and we haven't retried yet
      if (response.status === 401 && retry) {
        const newAccessToken = await this.refreshToken(); // method you'll create
        if (newAccessToken) {
          // Update header with new token
          localStorage.setItem("access_token", newAccessToken);
          token = newAccessToken;

          const retryConfig: RequestInit = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          response = await fetch(url, retryConfig);
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Public endpoints
  async getProfile(): Promise<Profile> {
    const profile = await this.request<Profile>("/profile/");

    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const profile = await this.request<Profile>("/admin/profile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    localStorage.setItem("profile", JSON.stringify(profile));
    return profile;
  }

  async getProjects(params?: {
    featured?: boolean;
    tag?: string;
    search?: string;
  }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.featured !== undefined)
      query.append("featured", String(params.featured));
    if (params?.tag) query.append("tag", params.tag);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString();
    return this.request<Project[]>(
      `/projects/${queryString ? `?${queryString}` : ""}`
    );
  }

  async getProject(slug: string): Promise<Project> {
    return this.request<Project>(`/projects/${slug}/`);
  }

  async getExperience(): Promise<Experience[]> {
    return this.request<Experience[]>("/experience/");
  }

  async getEducation(): Promise<Education[]> {
    return this.request<Education[]>("/education/");
  }

  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    const query = featured !== undefined ? `?featured=${featured}` : "";
    return this.request<Testimonial[]>(`/testimonials/${query}`);
  }

  async getBlogPosts(params?: {
    featured?: boolean;
    tag?: string;
    search?: string;
  }): Promise<BlogPost[]> {
    const query = new URLSearchParams();
    if (params?.featured !== undefined)
      query.append("featured", String(params.featured));
    if (params?.tag) query.append("tag", params.tag);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString();
    return this.request<BlogPost[]>(
      `/blogs/${queryString ? `?${queryString}` : ""}`
    );
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/blogs/${slug}/`);
  }

  async getTags(): Promise<Tags> {
    return this.request<Tags>("/tags/");
  }

  async getStats(): Promise<Stats> {
    return this.request<Stats>("/stats/");
  }

  async getTechStackStats(): Promise<TechStackStats> {
    return this.request<TechStackStats>("/tech-stack/");
  }

  async sendEmail(data: ContactForm): Promise<{ message: string }> {
    return this.request<{ message: string }>("/send-email/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const tokens = await this.request<AuthTokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);

    await this.getProfile();
    return tokens;
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.access;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  async verifyToken(token: string): Promise<void> {
    return this.request<void>("/auth/verify/", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

export const apiClient = new ApiClient();
