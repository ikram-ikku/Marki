import { useEffect, useRef } from 'react';

export default function Services() {
  const containerRef = useRef(null);

  useEffect(() => {
    const revealTargets = containerRef.current.querySelectorAll('.services-title, .service-card');
    
    if ('IntersectionObserver' in window && revealTargets.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      revealTargets.forEach((el) => observer.observe(el));
      
      return () => {
        revealTargets.forEach((el) => observer.unobserve(el));
      };
    } else {
      revealTargets.forEach((el) => el.classList.add('in-view'));
    }
  }, []);

  return (
    <section className="services" ref={containerRef}>
        <p className="services-title">Products</p>

        <div className="services-grid">
            <article className="service-card">
                <div className="service-image img-fallback">
                    <img src="/public/images/shoes/image 1.png" alt="Premium leather materials" loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'public/images/shoes/placeholder.jpg';
                            e.target.parentElement.classList.add('img-fallback');
                        }} />
                </div>
                <h3>Premium Quality</h3>
                <p>Crafted using carefully selected full-grain leather, sourced for its strength and its patina.</p>
            </article>

            <article className="service-card">
                <div className="service-image img-fallback">
                    <img src="/public/images/shoes/image 2.png" alt="Handcrafted shoe polishing" loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'public/images/shoes/placeholder.jpg';
                            e.target.parentElement.classList.add('img-fallback');
                        }} />
                </div>
                <h3>Handcrafted</h3>
                <p>Every pair is shaped, stitched and polished by hand — no two are ever quite the same.</p>
            </article>

            <article className="service-card">
                <div className="service-image img-fallback">
                    <img src="/public/images/shoes/image 3.png" alt="Perfect footwear fitting" loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'public/images/shoes/placeholder.jpg';
                            e.target.parentElement.classList.add('img-fallback');
                        }} />
                </div>
                <h3>Perfect Fit</h3>
                <p>Built on lasts refined over decades, so every step feels considered, not compromised.</p>
            </article>
        </div>
    </section>
  );
}
