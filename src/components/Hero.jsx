import { useState, useEffect } from 'react';

const images = [
  "public/images/shoes/1f67bd09-1813-4b82-9bd6-3f6cab15a805.png",
  "public/images/shoes/1f67e4d4-e8ee-4e4f-a219-31c549cb25da.png",
  "public/images/shoes/ba4db1d4-09a6-418d-9284-80a2c6c09d7b.png",
  "public/images/shoes/89ff6ed9-45f0-4713-8841-1c90b03a7be9.png"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero" id="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
            <p className="hero-eyebrow">Est. in leather &amp; patience</p>
            <h1 className="hero-headline">A Difference You Can<br className="lb" /> Feel in Your Sole</h1>
            <a href="pages/products.html" className="hero-cta">Explore More</a>
        </div>

        <div className="hero-slider" style={{
            position: 'absolute',
            right: '4%',
            bottom: '10%',
            width: '45%',
            maxWidth: '600px',
            height: '450px',
            zIndex: 3,
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            border: '2px solid rgba(245, 233, 220, 0.1)'
        }}>
            {images.map((src, idx) => (
                <img
                    key={src}
                    src={src}
                    alt={`Marki Shoe Collection ${idx + 1}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: idx === currentIndex ? 1 : 0,
                        transition: 'opacity 1.2s ease-in-out',
                        transform: idx === currentIndex ? 'scale(1)' : 'scale(1.05)',
                    }}
                />
            ))}
        </div>

        <div className="hero-shelf" aria-hidden="true"></div>
    </section>
  );
}
