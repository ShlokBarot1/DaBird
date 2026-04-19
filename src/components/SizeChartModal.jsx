import { motion } from 'framer-motion';
import './SizeChartModal.css';

const SizeChartModal = ({ onClose }) => {
  return (
    <motion.div 
      className="size-chart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="size-chart-modal" onClick={e => e.stopPropagation()}>
        <button className="sc-close" onClick={onClose}>✕</button>
        <table className="sc-table">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#000', color: '#fff' }}>Sizes</th>
              <th style={{ backgroundColor: '#000', color: '#fff' }}>S</th>
              <th style={{ backgroundColor: '#000', color: '#fff' }}>M</th>
              <th style={{ backgroundColor: '#000', color: '#fff' }}>L</th>
              <th style={{ backgroundColor: '#000', color: '#fff' }}>XL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Men's Chest</td>
              <td>34 - 36</td><td>38 - 40</td><td>42 - 44</td><td>46 - 48</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Women's</td>
              <td>4 - 6</td><td>8 - 10</td><td>12 - 14</td><td>16 - 18</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>Youth</td>
              <td>6 - 8</td><td>10 - 12</td><td>14 - 16</td><td>18 - 20</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SizeChartModal;
