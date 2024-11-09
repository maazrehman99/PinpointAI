"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Calendar, Users, Clock, ChevronDown, ChevronUp, Star, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AnimatedDescription from '@/components/animated-description';


const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect if true
    if (isLoaded && userId) {
      router.push('/analyzer/meeting');
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI-Powered Analysis",
      description: "Transform meeting notes into structured action items automatically",
      badge: "New"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Smart Assignment",
      description: "AI intelligently assigns tasks based on context and expertise"
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Deadline Detection",
      description: "Automatically extracts and sets deadlines from conversation context"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Real-time Processing",
      description: "Get actionable insights within seconds of uploading"
    }
  ];

  const stats = [
    { value: "99%", label: "Accuracy" },
    { value: "100%", label: "Time Saved" },
    { value: "10+", label: "Active Users" },
    { value: "50+", label: "Tasks Processed" }
  ];

  return (
    <div className="min-h-screen bg-background relative dark:bg-gray-900">
      {/* Gradient Background */}
     
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 pointer-events-none" />
      
      {/* Navbar */}
  

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-gray-900/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative">
          <Badge variant="secondary" className="mb-4 bg-blue-500/20 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400">
            ✨ AI-Powered Meeting Assistant
          </Badge>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 text-transparent bg-clip-text leading-tight">
            Transform Meetings into<br />Action with AI
          </h1>
          <p className="text-xl mb-8 text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
          <AnimatedDescription delay={30}>
    Our AI instantly analyzes your meeting summaries, extracts action items, and assigns tasks - saving hours of manual work.
  </AnimatedDescription>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
      <Link href="/sign-up" passHref>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      <Link href="https://www.youtube.com/watch?v=P6-uw7BQ018" passHref>
  <Button size="lg" variant="outline" className="dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200" >
    Watch Demo
  </Button>
</Link>
    </div>

          {/* Demo Preview */}
          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 backdrop-blur" />
            <div className="relative bg-muted/50 dark:bg-gray-800/50 p-8 backdrop-blur-xl rounded-xl border dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4 animate-fade-in">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Processing meeting summary...</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <Zap className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Identified 5 action items</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s' }}>
                    <Users className="h-5 w-5 text-green-500 dark:text-green-400" />
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Assigned tasks to 3 team members</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 animate-fade-in" style={{ animationDelay: '2s' }}>
                    <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    <p className="text-sm text-muted-foreground dark:text-gray-400">Set deadlines and reminders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-transparent bg-clip-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 dark:via-gray-800/50 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            <AnimatedDescription delay={30}>
    Our AI instantly analyzes your meeting summaries, extracts action items, and assigns tasks - saving hours of manual work.
  </AnimatedDescription>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-muted dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-900/5 dark:via-purple-900/5 dark:to-pink-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="mb-4 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold dark:text-gray-200">{feature.title}</h3>
                    {feature.badge && (
                      <Badge variant="secondary" className="bg-blue-500/10 dark:bg-blue-900/10 text-blue-500 dark:text-blue-400">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Seamless Integration
          </h2>
          <p className="text-xl text-muted-foreground dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Works with your favorite tools and platforms
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Slack', 'Teams', 'Zoom', 'Google Meet'].map((platform, index) => (
              <Card key={index} className="p-6 flex items-center justify-center bg-muted/50 dark:bg-gray-800/50 hover:bg-muted/80 dark:hover:bg-gray-800/80 transition-colors">
                <Globe className="w-8 h-8 mr-2 text-muted-foreground dark:text-gray-400" />
                <span className="font-semibold text-muted-foreground dark:text-gray-300">{platform}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 rounded-3xl" />
          <Card className="relative overflow-hidden backdrop-blur-xl border-0 dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-gray-200">
                Ready to Transform Your Meetings?
              </h2>
              <p className="text-xl text-muted-foreground dark:text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of teams already saving hours every week with AI-powered meeting assistance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link href="/sign-up" passHref>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          Get Started For Free
        </Button>
      </Link>
      <Link href="https://www.youtube.com/watch?v=P6-uw7BQ018" passHref>
        <Button size="lg" variant="outline" className="dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
          Watch Demo
        </Button>
      </Link>
    </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {['Product','Resources'].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-muted-foreground dark:text-gray-300 mb-4">{section}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">Features</a></li>
                <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">Support</a></li>
              </ul>
            </div>
          ))}
          {['Help'].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-muted-foreground dark:text-gray-300 mb-4">{section}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">Terms & conditions</a></li>
                <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">Privacy policy</a></li>
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="font-semibold text-muted-foreground dark:text-gray-300 mb-4">Stay Connected</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200">GitHub</a></li>
            </ul>
          </div>
        </div>
        
      </footer>
    </div>
  );
};

export default Home;

