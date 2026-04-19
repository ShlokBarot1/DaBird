import { siteImages } from '../lib/siteImages';

export default function CertificateSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img 
            src={siteImages.certificate} 
            alt="Da Bird Birth Certificate" 
            loading="lazy"
            decoding="async"
            className="w-full max-w-[550px] object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-[#4B8CC8] font-black text-3xl md:text-4xl lg:text-5xl uppercase leading-tight mb-6 font-primary" style={{ letterSpacing: '0.02em' }}>
            Get Your Official Da&nbsp;Bird<br />Birth Certificate
          </h2>
          
          <p className="text-[#6BA0D1] font-semibold text-sm md:text-base lg:text-lg leading-snug mb-8 max-w-lg">
            Every Da Bird purchase comes with an exclusive Birth Certificate &ndash; officially
            certifying your bird's adoption and making your new friend Flip truly yours.
            It's not just a collectible, it's a keepsake.
          </p>

          <button 
            onClick={() => window.location.hash = '#shop'}
            className="bg-[#4B8CC8] hover:bg-[#3B72A4] text-white font-extrabold uppercase tracking-wide px-10 py-3 md:px-12 md:py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg text-sm md:text-base"
          >
            Adopt Now
          </button>
        </div>

      </div>
    </section>
  );
}
