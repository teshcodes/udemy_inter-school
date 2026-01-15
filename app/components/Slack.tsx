"use client";

import React from "react";
import Image from "next/image";

export default function Slack() {
  return (
    <div className="w-full ">
      <Image
        src="/slack-integration.png"
        alt="Projects Kanban"
        width={1920}
        height={300}
        className="w-full h-auto object-cover lg:px-20"
        priority
      />
    </div>
  );
}
