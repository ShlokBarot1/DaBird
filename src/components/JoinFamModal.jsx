import { motion } from 'framer-motion';
import { siteImages } from '../lib/siteImages';
import './JoinFamModal.css';

const JoinFamModal = ({ onClose }) => {
  return (
    <motion.div 
      className="join-fam-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="join-fam-modal" onClick={e => e.stopPropagation()}>
        <div className="jf-left">
          <img src={siteImages.homeJoinFlock} alt="Join the Fam" />
        </div>
        <div className="jf-right">
          <button className="jf-close" onClick={onClose}>
            ✕
          </button>
          <div className="jf-form-container">
            <h3>BECOME PART OF THE<br/>DA BIRD COMMUNITY.</h3>
            
            <form className="jf-form" onClick={e => e.preventDefault()}>
              <input type="text" placeholder="NAME SURNAME" required />
              <input type="email" placeholder="EMAIL" required />
              <button type="submit" className="jf-submit-btn">SUBMIT</button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JoinFamModal;
