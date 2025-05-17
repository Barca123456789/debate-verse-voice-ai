
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";

const HomePage = () => {
  const navigate = useNavigate();
  const { status } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is DebateHub?",
      answer: "DebateHub is an AI-moderated debate platform where users can engage in structured debates through text or voice. Our AI provides real-time feedback, scoring, and helps improve your debate skills."
    },
    {
      question: "How does the AI moderation work?",
      answer: "Our AI moderator, powered by GPT-4, analyzes the content, structure, and effectiveness of your arguments. It provides feedback on logical fallacies, persuasiveness, and offers constructive suggestions to improve your debating skills."
    },
    {
      question: "Can I use voice for debates?",
      answer: "Yes! DebateHub supports both text and voice debates. You can choose your preferred method when creating or joining a debate room."
    },
    {
      question: "How is the leaderboard calculated?",
      answer: "The leaderboard rankings are based on your debate performance scores provided by our AI moderator. Win debates, present compelling arguments, and avoid logical fallacies to climb the ranks."
    },
  ];

  const features = [
    {
      title: "AI Moderation",
      description: "Get real-time feedback and scoring from our GPT-4 powered AI moderator.",
      icon: (
        <div className="w-12 h-12 bg-debate/10 rounded-xl flex items-center justify-center text-debate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
      )
    },
    {
      title: "Voice Debates",
      description: "Engage in real-time voice debates with AI response capabilities.",
      icon: (
        <div className="w-12 h-12 bg-debate/10 rounded-xl flex items-center justify-center text-debate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
      )
    },
    {
      title: "Topic Generator",
      description: "Never run out of interesting topics with our GPT-4 topic generator.",
      icon: (
        <div className="w-12 h-12 bg-debate/10 rounded-xl flex items-center justify-center text-debate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
      )
    },
    {
      title: "Leaderboard",
      description: "Climb the ranks as you improve your debate skills and win debates.",
      icon: (
        <div className="w-12 h-12 bg-debate/10 rounded-xl flex items-center justify-center text-debate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-hero-pattern py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-debate/30 to-background/0 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            Welcome to <span className="debate-gradient-text">DebateHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-muted-foreground max-w-3xl mb-10">
            Engage in moderated debates, improve your skills, and receive AI-powered feedback in real-time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {status === AuthStatus.AUTHENTICATED ? (
              <Button size="lg" className="text-lg px-8 debate-button" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button size="lg" className="text-lg px-8 debate-button" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 debate-button-outline" onClick={() => navigate('/login')}>
                  Log In
                </Button>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <div className="bg-background/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-border">
              <p className="text-4xl font-bold text-debate mb-2">10,000+</p>
              <p className="text-muted-foreground">Active debaters</p>
            </div>
            <div className="bg-background/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-border">
              <p className="text-4xl font-bold text-debate mb-2">5,000+</p>
              <p className="text-muted-foreground">Debates completed</p>
            </div>
            <div className="bg-background/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-border">
              <p className="text-4xl font-bold text-debate mb-2">98%</p>
              <p className="text-muted-foreground">User satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="debate-gradient-text">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to master the art of debate and critical thinking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-md border border-border hover:shadow-debate transition-shadow duration-300">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="debate-gradient-text">DebateHub</span> Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join debates, improve your skills, and climb the leaderboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-md border border-border relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-debate rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Format</h3>
              <p className="text-muted-foreground mb-4">
                Select between text-based or voice debates based on your preference.
              </p>
              <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground mt-auto">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  5-30 minutes
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  1v1 or Team
                </span>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-md border border-border relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-debate rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Debate With AI Moderation</h3>
              <p className="text-muted-foreground mb-4">
                Present your arguments while our AI moderator analyzes your performance in real-time.
              </p>
              <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground mt-auto">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  GPT-4 Powered
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Real-time Feedback
                </span>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-md border border-border relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-debate rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Improve & Climb Ranks</h3>
              <p className="text-muted-foreground mb-4">
                Receive detailed feedback, improve your skills, and rise up the global leaderboard.
              </p>
              <div className="flex items-center space-x-4 text-sm font-medium text-muted-foreground mt-auto">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                  ELO Ranking
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1 text-debate">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  Skill Development
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="debate-gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about DebateHub
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-border rounded-lg overflow-hidden"
              >
                <button 
                  className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeFaq === index && (
                  <div className="p-4 border-t border-border bg-muted/30">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-debate text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start debating?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join DebateHub today and improve your critical thinking, persuasion, and communication skills.
          </p>
          <Button size="lg" className="bg-white text-debate hover:bg-white/90 text-lg px-8" onClick={() => navigate('/register')}>
            Get Started Now
          </Button>
        </div>
      </section>
    </>
  );
};

export default HomePage;
