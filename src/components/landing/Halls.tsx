"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import palmyraImg from "@/assets/palmyra.png";
import palmyraImg1 from "@/assets/palmyra1.png";
import palmyraImg2 from "@/assets/palmyra2.png";

import eliezerImg from "@/assets/eliezer.png";
import eliezerImg1 from "@/assets/eliezer1.png";
import eliezerImg2 from "@/assets/eliezer2.png";

import meetingImg from "@/assets/meeting.png";
import meetingImg1 from "@/assets/meeting1.png";
import meetingImg2 from "@/assets/meeting2.png";

import studioImg from "@/assets/studio.png";
import studioImg1 from "@/assets/studio1.png";
import studioImg2 from "@/assets/studio2.png";

const halls = [
  {
    name: "Palmyra Hall",
    desc: "Accommodates up to 350 guests and offers on-site parking",
    imgs: [palmyraImg, palmyraImg1, palmyraImg2],
  },
  {
    name: "Eliezer Hall",
    desc: "Accommodates up to 150 guests and offers on-site parking",
    imgs: [eliezerImg, eliezerImg1, eliezerImg2],
  },
  {
    name: "Meeting Rooms",
    desc: "Two furnished meeting rooms with on-site parking",
    imgs: [meetingImg, meetingImg1, meetingImg2],
  },
  {
    name: "Audio Video Recording Studio",
    desc: "Recording Studio with state of the art equipment",
    imgs: [studioImg, studioImg1, studioImg2],
  },
];

const Halls = () => {
  const [indexes, setIndexes] = useState(halls.map(() => 0));
  const [fading, setFading] = useState(halls.map(() => false));

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(halls.map(() => true)); // start fade out
      setTimeout(() => {
        setIndexes((prev) =>
          prev.map((index, i) => (index + 1) % halls[i].imgs.length)
        );
        setFading(halls.map(() => false)); // fade in
      }, 300); // matches transition duration
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="halls" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Halls & Facilities
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our elegant halls and facilities designed to suit
            weddings, receptions, corporate meetings, and special occasions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {halls.map((hall, i) => (
            <div
              key={i}
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-gold transition-all duration-500"
            >
              {/* Smooth Fade Image */}
              <Image
                src={hall.imgs[indexes[i]]}
                alt={hall.name}
                width={600}
                height={400}
                className={`w-full h-80 object-cover transition-opacity duration-700 ${
                  fading[i] ? "opacity-0" : "opacity-100"
                }`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex flex-col justify-center items-center text-center p-6">
                <h3 className="font-serif text-3xl font-bold text-white mb-3">
                  {hall.name}
                </h3>
                <p className="text-lg text-gray-200">{hall.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Halls;
