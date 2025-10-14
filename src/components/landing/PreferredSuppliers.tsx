"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { supplier1, supplier2, supplier3, supplier4, supplier5, supplier6 } from "@/assets";

const PreferredSuppliers = () => {
  const suppliers = [
    {
      name: "Royal Melbourne",
      img: supplier1,
      url: "https://www.facebook.com/Royalmelb",
    },
    {
      name: "SS Events",
      img: supplier2,
      url: "https://www.ssevents.com.au/",
    },
    {
      name: "Maruthy Event Designers",
      img: supplier3,
      url: "https://www.facebook.com/people/Maruthy-event-designers/100068087953021/#",
    },
    {
      name: "Shantara Events",
      img: supplier4,
      url: "https://www.facebook.com/shantaraevents/",
    },
    {
      name: "MKS",
      img: supplier5,
      url: "https://mymks.com.au/",
    },
    {
      name: "The Mango Tree",
      img: supplier6,
      url: "https://www.themangotree.co/",
    },
  ];

  return (
    <section className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Preferred Suppliers
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We collaborate with trusted suppliers to make your celebration
            stress-free and unforgettable.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          pagination={{ clickable: true, el: ".suppliers-pagination" }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="max-w-6xl mx-auto pb-12"
        >
          {suppliers.map((supplier, index) => (
            <SwiperSlide key={index}>
              <Link
                href={supplier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 hover:scale-105 transition-transform duration-300"
              >
                <Image
                  src={supplier.img}
                  alt={supplier.name}
                  width={200}
                  height={120}
                  className="object-contain max-h-20"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="suppliers-pagination flex justify-center mt-6"></div>

      </div>
    </section>
  );
};

export default PreferredSuppliers;
