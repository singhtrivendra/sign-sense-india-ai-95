
import React from 'react';

export default function DemoVideo() {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-lg">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/xyz123" // Replace with actual ISL demo video ID
        title="Indian Sign Language Demo"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
