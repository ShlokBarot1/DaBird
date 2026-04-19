import { useState } from 'react';
import { contactCopy } from '../content/siteContent';
import './Contact.css';

const Contact = () => {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = (e) => {
    // FormSubmit handles redirection
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">{contactCopy.title}</h1>
        <p className="contact-subtitle">{contactCopy.subtitle}</p>
      </div>

      <div className="contact-content">
        <form className="contact-form" action="https://formsubmit.co/dabird.net@gmail.com" method="POST">
          <div className="input-group">
            <label>name</label>
            <input type="text" name="name" placeholder="your name" required />
          </div>
          <div className="input-group">
            <label>email</label>
            <input type="email" name="email" placeholder="your email" required />
          </div>
          <div className="input-group">
            <label>order number (optional)</label>
            <input type="text" name="order_number" placeholder="#db-" />
          </div>
          <div className="input-group full-width">
            <label>message</label>
            <textarea name="message" placeholder="how can we help you?" rows="6" required></textarea>
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_next" value={window.location.href} />
          </div>
          <button 
            type="submit" 
            className={`submit-btn ${formState !== 'idle' ? 'active' : ''}`}
            disabled={formState !== 'idle'}
          >
            {formState === 'idle' && 'send message'}
            {formState === 'sending' && 'sending...'}
            {formState === 'sent' && 'message sent!'}
          </button>
        </form>

        <div className="contact-info">
           <div className="info-block">
             <h3>{contactCopy.support.heading}</h3>
             <p>{contactCopy.support.email}</p>
             <p className="subtext">{contactCopy.support.hours}</p>
           </div>
           <div className="info-block">
             <h3>{contactCopy.press.heading}</h3>
             <p>{contactCopy.press.email}</p>
           </div>
           <div className="info-block location">
             <h3>{contactCopy.hq.heading}</h3>
             <p>{contactCopy.hq.lines[0]}<br/>{contactCopy.hq.lines[1]}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
