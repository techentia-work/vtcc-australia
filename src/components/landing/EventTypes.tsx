"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ✅ Button Component with variants + size support
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ✅ EventTypes Component
const EventTypes = () => {
  const events = [
    {
      title: "Weddings & Receptions",
      image: "bg-gradient-to-br from-orange-200 to-orange-400",
      description: "Create magical moments for your special day",
    },
    {
      title: "Birthday Party & Private Function",
      image: "bg-gradient-to-br from-purple-200 to-purple-400",
      description: "Celebrate life's precious milestones",
    },
    {
      title: "Corporate Event & Meeting",
      image: "bg-gradient-to-br from-blue-200 to-blue-400",
      description: "Professional venues for business success",
    },
    {
      title: "Community Event & Concerts",
      image: "bg-gradient-to-br from-indigo-200 to-indigo-400",
      description: "Bring communities together through events",
    },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Event Types
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we have the perfect
            space for every occasion
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-elegant hover:shadow-gold transition-all duration-300"
            >
              {/* Background */}
              <div className={`${event.image} h-64 relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-xl font-bold mb-2 leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {event.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-gold text-white"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
