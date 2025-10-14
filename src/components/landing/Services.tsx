import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Camera, Music, Utensils, Flower, Gift } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Sparkles,
      title: 'Hall & Stage Decoration',
      description: 'Professional decoration services to transform our venue according to your theme and preferences.'
    },
    {
      icon: Flower,
      title: 'Table Decoration',
      description: 'Elegant table settings with beautiful centerpieces, linens, and customized arrangements.'
    },
    {
      icon: Camera,
      title: 'Photo & Videography',
      description: 'Professional photography and videography services to capture every precious moment of your event.'
    },
    {
      icon: Gift,
      title: 'Celebration Cake',
      description: 'Custom celebration cakes designed to match your event theme and dietary requirements.'
    },
    {
      icon: Music,
      title: 'Entertainment',
      description: 'Complete entertainment solutions including live bands, DJs, and traditional music performances.'
    },
    {
      icon: Utensils,
      title: 'Catering',
      description: 'Authentic Tamil cuisine and international menu options prepared by experienced chefs.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            What We Offer
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our venue provides an excellent experience for your special day, that you'll never forget.
            We offer a professional and tailored service for you and your guests to suit your momentous occasion.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-card border-border/50"
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-gold/20 rounded-full mx-auto group-hover:animate-pulse"></div>
                </div>

                <h3 className="font-serif text-xl font-bold text-primary mb-4 group-hover:text-burgundy transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 shadow-elegant border border-gold/20 max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-primary mb-4">
              Ready to Plan Your Event?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our dedicated event consultants are here to help you create the perfect celebration. 
              Contact us today for a personalized consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-gold text-white px-8 py-3 rounded-lg font-semibold shadow-gold hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                Schedule Consultation
              </button>
              <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                View Gallery
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Services;