import { Card, CardContent } from "@/components/ui/card";
import { Shield, Truck, Heart, Recycle } from "lucide-react";

export function ProductFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders over €50"
    },
    {
      icon: Shield,
      title: "Freshness Guarantee",
      description: "7-day freshness promise"
    },
    {
      icon: Heart,
      title: "Expert Care",
      description: "Handpicked by our florists"
    },
    {
      icon: Recycle,
      title: "Sustainable",
      description: "Eco-friendly packaging"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-3 rounded-full bg-primary/10 p-3">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
