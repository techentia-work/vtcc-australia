const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <div className="w-32 h-0.5 bg-gradient-elegant mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground mb-4">
            It's just simple. You have an event to plan
          </p>
          <p className="text-xl text-muted-foreground">
            we have the solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white font-serif">1</span>
              </div>
            </div>
            <div className="border border-orange-300 rounded-lg p-8 h-32 flex items-center justify-center bg-white/50">
              <p className="text-lg text-muted-foreground font-serif italic leading-relaxed">
                Use one of our state of<br />
                the art Venue
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white font-serif">2</span>
              </div>
            </div>
            <div className="border border-orange-300 rounded-lg p-8 h-32 flex items-center justify-center bg-white/50">
              <p className="text-lg text-muted-foreground font-serif italic leading-relaxed">
                Select the services that<br />
                you need from us
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white font-serif">3</span>
              </div>
            </div>
            <div className="border border-orange-300 rounded-lg p-8 h-32 flex items-center justify-center bg-white/50">
              <p className="text-lg text-muted-foreground font-serif italic leading-relaxed">
                Let us help you with the<br />
                event
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;