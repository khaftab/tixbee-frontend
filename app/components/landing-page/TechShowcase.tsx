import { Users, Zap, Shield, Boxes } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

const TechShowcase = () => {
  const features = [
    {
      icon: <Boxes className="h-6 w-6" />,
      title: "Microservices Architecture",
      description: "Scalable, resilient services handling functions independently",
      techStack: ["Kubernetes", "Docker", "WebSockets"],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning-Fast Performance",
      description: "Optimized for lightning-fast speed with caching and load balancing",
      techStack: ["Redis", "Nginx", "CDN"],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Massive Concurrency",
      description: "Handle thousands of users simultaneously without breaking a sweat",
      techStack: ["Node.js", "Remix", "NATS"],
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise-Grade Security",
      description: "Top notch encryption and security practices to protect your data",
      techStack: ["SSL/TLS", "Authentication", "Firewall"],
    },
  ];

  return (
    <section className="faded-bgg borderr border-border py-4 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-foreground font-bold tracking-tight mb-4">
            Powered by Cutting-Edge Technology
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform is built on a robust, scalable architecture designed to handle massive
            traffic while ensuring lightning-fast performance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col bg-background backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {feature.icon}
                  <CardTitle className="font-inter-light text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {feature.techStack.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="font-inter-light">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechShowcase;
