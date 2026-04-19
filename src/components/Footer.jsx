import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-logos">
          <span className="massive-logo">Da Bird</span>
          <span className="logo-symbol">✦</span>
          <span className="logo-symbol">✦</span>
        </div>
        <div className="footer-tagline">
          <p>Da Bird</p>
          <p>Join The Flock</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-column">
          <h4>site index</h4>
          <div className="footer-links">
            <a href="#shop">shop now</a>
            <a href="#home">home</a>
            <a href="#about">about us</a>
            <a href="#contact">contact us</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>social</h4>
          <div className="footer-links">
            <a href="https://www.instagram.com/dabirddotnet?igsh=MWZubXdsd2FkZ3JlZA==" target="_blank" rel="noopener noreferrer">instagram</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>get in touch</h4>
          <div className="footer-links">
            <a href="mailto:dabird.net@gmail.com">dabird.net@gmail.com</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>legal</h4>
          <div className="footer-links">
            <a href="#privacy">privacy policy</a>
            <a href="#terms">terms of service</a>
            <a href="#terms">no refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
