import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from "next/link";   
import { Check, Clock, Users, Sparkles } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: 'Weddings',
      price: 32,
      popular: true,
      features: ['5 Hours', '300 Guests', 'Decoration', 'Stage Setup', 'Sound System', 'Parking'],
      color: 'bg-primary',
      buttonVariant: 'gold' as const
    },
    {
      name: 'Birthday Parties',
      price: 25,
      popular: false,
      features: ['5 Hours', '100 Guests', 'Decoration', 'Entertainment Area', 'Basic Sound'],
      color: 'bg-card',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Corporate Events',
      price: 10,
      popular: false,
      features: ['5 Hours', '100 Guests', 'A/V Equipment', 'Presentation Setup', 'WiFi'],
      color: 'bg-card',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Community Events',
      price: 25,
      popular: false,
      features: ['5 Hours', '300 Guests', 'Decoration', 'Cultural Setup', 'Traditional Music'],
      color: 'bg-card',
      buttonVariant: 'outline' as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Choose Your Plan
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our dedicated event consultant will help you with all the information and
            recommendations for your event.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-elegant ${plan.popular ? 'ring-2 ring-gold shadow-gold scale-105' : 'hover:shadow-gold'}`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-gold text-white font-semibold">
                  Most Popular
                </Badge>
              )}

              <CardHeader className={`${plan.popular ? 'bg-gradient-gold text-white' : 'bg-gradient-elegant'} text-center py-8`}>
                <h3 className={`font-serif text-2xl font-bold ${plan.popular ? 'text-white' : 'text-primary'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>From</span>
                  <div className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-primary'}`}>
                    ${plan.price}
                  </div>
                  <span className={`text-sm ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>(Per head)</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-6 h-full p-6">
                <ul className="flex flex-col gap-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" passHref>
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full mt-auto"
                    size="lg"
                  >
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 p-8 bg-gradient-elegant rounded-2xl border border-gold/20">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-primary mb-4">
            Need a Custom Package?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact our event consultants for personalized packages tailored to your specific needs and budget.
          </p>
          <Link href="/contact" passHref>
          <Button variant="elegant" size="lg">
            Get Custom Quote
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;