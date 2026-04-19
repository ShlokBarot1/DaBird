import { homeHighlights } from '../content/siteContent';
import './HomeHighlights.css';

export default function HomeHighlights() {
  const items = homeHighlights;
  return (
    <section className="home-highlights-section my-24 bg-white relative w-full">
      <div className="highlights-grid mx-auto w-full max-w-[2000px]">
        {items.map((item, i) => {
          const Component = 'a';
          const props = item.isExternal 
            ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } 
            : { href: item.link };

          return (
            <Component key={i} className="highlight-item block group" {...props}>
              {/* Title visually identical to screenshot: placed cleanly above the card */}
              <h3 className="highlight-header text-sm md:text-lg font-extrabold uppercase tracking-wide text-black mb-3 group-hover:text-blue-700 transition-colors">
                {item.title}
              </h3>
              
              <div className="highlight-card relative w-full overflow-hidden bg-gray-100 aspect-[3/4]">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
              </div>
            </Component>
          );
        })}
      </div>
    </section>
  );
}
