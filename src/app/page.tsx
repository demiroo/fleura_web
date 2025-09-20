import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Truck, Shield, Gift } from "lucide-react";

export const metadata = {
  description:
    "Fleura - Premium flower shop offering fresh, beautiful flowers for every occasion. Expert florists, same-day delivery, and custom arrangements.",
  openGraph: {
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full pt-6 md:pt-8 lg:pt-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="relative px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid max-w-[1300px] mx-auto gap-8 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                🌸 Premium Fresh Flowers
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Nature&apos;s Beauty, Delivered
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Transform any moment into something extraordinary with our handcrafted floral arrangements. 
                From romantic bouquets to celebration centerpieces, we bring nature&apos;s finest to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/search/bouquets">
                    <Heart className="mr-2 h-5 w-5" />
                    Shop Bouquets
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/search/arrangements">
                    Custom Arrangements
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl" />
              <img
                src="/banner.png"
                width="600"
                height="400"
                alt="Beautiful flower arrangements"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Same-Day Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Fresh flowers delivered within hours to your doorstep
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Expert Florists</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Handcrafted arrangements by our skilled floral designers
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Freshness Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  7-day freshness guarantee or your money back
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Custom Occasions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personalized arrangements for every special moment
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge variant="outline" className="w-fit">
              🌺 Seasonal Collections
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Perfect Flowers for Every Occasion
            </h2>
            <p className="max-w-[900px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              Discover our curated collections designed to celebrate life&apos;s most beautiful moments
            </p>
          </div>
          <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-6xl lg:grid-cols-3">
            <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src="/womens-collection.png"
                  width="400"
                  height="500"
                  alt="Wedding Collection"
                  className="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary">
                  Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Wedding Collection
                </CardTitle>
                <CardDescription>
                  Elegant bridal bouquets and ceremonial arrangements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/search/wedding">View Collection</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src="/mens-collection.png"
                  width="400"
                  height="500"
                  alt="Romance Collection"
                  className="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-destructive">
                  Bestseller
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Romance Collection
                </CardTitle>
                <CardDescription>
                  Passionate red roses and romantic arrangements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/search/romance">View Collection</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src="/kids-collection.png"
                  width="400"
                  height="500"
                  alt="Celebration Collection"
                  className="aspect-[4/5] w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-secondary">
                  New
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  Celebration Collection
                </CardTitle>
                <CardDescription>
                  Vibrant arrangements for birthdays and special events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/search/celebration">View Collection</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Newsletter CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="mx-auto w-fit">
                🌸 Stay Connected
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Never Miss a Bloom
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Subscribe to our newsletter for seasonal flower care tips, exclusive arrangements, 
                and be the first to know about our limited-time collections.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg">🌿</span>
                  </div>
                  <CardTitle className="text-base">Care Tips</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    Expert advice for long-lasting blooms
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg">🎁</span>
                  </div>
                  <CardTitle className="text-base">Exclusive Offers</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    Member-only discounts and promotions
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg">🌟</span>
                  </div>
                  <CardTitle className="text-base">New Arrivals</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    First access to seasonal collections
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/newsletter">
                  Join Our Garden 🌺
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/search">
                  Browse Flowers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
