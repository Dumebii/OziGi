"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { motion, Variants } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col overflow-hidden">
      <Header
        session={session}
        onSignIn={() => setIsAuthModalOpen(true)}
        onOpenHistory={() => {}}
      />

      <main className="pt-20 pb-0 flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          {/* Ambient Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 left-10 w-72 h-72 bg-primary opacity-3 rounded-full blur-3xl"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-6xl mx-auto w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col gap-8"
              >
                <motion.div variants={fadeUp} className="space-y-2">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary border border-border">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-sm font-medium text-muted-foreground">Enterprise AI Platform</span>
                  </div>
                </motion.div>

                <motion.h1 
                  variants={fadeUp}
                  className="text-5xl lg:text-7xl font-bold leading-tight text-pretty"
                >
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Intelligence
                  </span>
                  <br />
                  Built for Scale
                </motion.h1>

                <motion.p 
                  variants={fadeUp}
                  className="text-xl text-muted-foreground leading-relaxed max-w-xl"
                >
                  Harness the power of enterprise-grade AI with complete transparency. Process, analyze, and act on your data with confidence.
                </motion.p>

                <motion.div 
                  variants={fadeUp}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start Free Trial
                  </button>
                  <Link
                    href="/docs"
                    className="px-8 py-4 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-all duration-200"
                  >
                    View Documentation
                  </Link>
                </motion.div>

                <motion.div 
                  variants={fadeUp}
                  className="flex items-center gap-6 pt-8 border-t border-border"
                >
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-xs font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">500+ Companies</p>
                    <p className="text-sm text-muted-foreground">Trust our platform</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Visual */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                className="relative hidden lg:flex items-center justify-center"
              >
                <div className="relative w-full aspect-square">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-2xl border border-primary border-opacity-20"></div>
                  
                  {/* Middle Ring */}
                  <div className="absolute inset-8 rounded-2xl border border-primary border-opacity-10"></div>
                  
                  {/* Content Box */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-card to-secondary border border-border p-8 flex flex-col justify-between overflow-hidden">
                      {/* Top Stats */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Processing Speed</p>
                            <p className="text-3xl font-bold text-primary">98.7%</p>
                          </div>
                          <div className="w-12 h-12 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                            <span className="text-xl">⚡</span>
                          </div>
                        </div>
                        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full w-[98.7%] bg-gradient-to-r from-primary to-accent"></div>
                        </div>
                      </div>

                      {/* Center Visualization */}
                      <div className="flex flex-col items-center justify-center gap-6">
                        <div className="w-20 h-20 rounded-full border-2 border-primary border-opacity-30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                            <span className="text-2xl">🤖</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Real-time AI Analysis</p>
                      </div>

                      {/* Bottom Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-secondary border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                          <p className="text-lg font-bold text-foreground">99.99%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Queries/sec</p>
                          <p className="text-lg font-bold text-primary">10K+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-32 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="text-center mb-20"
            >
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-pretty">
                Enterprise-Grade
                <br />
                <span className="text-primary">Capabilities</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                All the tools you need to build, deploy, and scale AI applications with confidence.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: "🔍",
                  title: "Advanced Analytics",
                  description: "Deep insights into model performance, latency, and accuracy metrics in real-time."
                },
                {
                  icon: "🔐",
                  title: "Enterprise Security",
                  description: "SOC 2 certified with end-to-end encryption and advanced access controls."
                },
                {
                  icon: "⚙️",
                  title: "Custom Workflows",
                  description: "Build complex AI pipelines with our visual workflow builder and API."
                },
                {
                  icon: "📊",
                  title: "Monitoring & Alerts",
                  description: "Proactive monitoring with instant alerts for anomalies and performance dips."
                },
                {
                  icon: "🤝",
                  title: "Team Collaboration",
                  description: "Seamless collaboration with role-based access and audit logs for compliance."
                },
                {
                  icon: "🚀",
                  title: "Global Infrastructure",
                  description: "Deploy to any region with 99.99% uptime SLA and auto-scaling capabilities."
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-lg border border-border bg-secondary hover:bg-secondary hover:border-primary transition-all duration-300 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-6 border-t border-border">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your AI Strategy?
              </h2>
              <p className="text-lg text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
                Join hundreds of enterprises using Ozigi to unlock the power of intelligent, scalable AI applications.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-10 py-4 bg-white text-primary rounded-lg font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
              >
                Start Your Free Trial
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
      <Footer />
    </div>
  );
}
