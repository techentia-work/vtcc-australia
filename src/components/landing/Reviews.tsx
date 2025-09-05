"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      name: "Naushad Usoof",
      text: "Great venue for weddings and large gatherings. Very modern with ample car parking available.",
      rating: 5,
    },
    {
      name: "Seshagiri Rao",
      text: "Nice place for traditional weddings. Elegant, spacious, and welcoming.",
      rating: 5,
    },
    {
      name: "Tariq Mahmood",
      text: "Great place for functions and parties. The team made our event smooth and stress-free.",
      rating: 5,
    },
    {
      name: "Luran Avles",
      text: "Awesome venue - clean, affordable, and beautifully maintained.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
            What our <span className="text-gold">Customers</span> Say
          </h2>
          <p className="text-white/80 mt-3 text-lg">
            Real experiences from our happy guests
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView="auto"
          pagination={{ clickable: true, el: ".custom-pagination" }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="max-w-6xl mx-auto pb-10"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="h-60 flex flex-col relative bg-white/10 backdrop-blur-sm border border-gold/30 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 leading-relaxed italic">
                  “{review.text}”
                </p>
                <h4 className="font-semibold text-xl text-gold mt-auto">{review.name}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-pagination flex justify-center mt-6"></div>
      </div>
    </section>

  );
};

export default Reviews;
