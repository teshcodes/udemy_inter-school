"use client";

import React from "react";
import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="w-full ">
      <Image
        src="/projects-kanban.png"
        alt="Projects Kanban"
        width={1920}
        height={300}
        className="w-full h-auto object-cover lg:px-60"
        priority
      />
    </div>
  );
}
