import React, { useState } from 'react';
import '../assets/Propertie.css';

// Reusable modal for selecting a small integer count (1,2,3,4,5+)
const CountModal = ({
  title = 'Select',
  initial = null,
  onApply = () => {},
  onClose = () => {}
}) => {
  const [selected, setSelected] = useState(initial);

  const options = ['1', '2', '3', '4', '5+'];

  return (
    <div className="count-m-overlay" style={overlayStyle}>
      <div className="count-m" style={modalStyle}>
        <div className="count-m-header" style={headerStyle}>{title}</div>

        <div className="count-m-body" style={bodyStyle}>
          <div style={optionsRowStyle}>
            {options.map((opt) => {
              const active = selected === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelected(opt)}
                  style={{
                    ...optionBtnStyle,
                    ...(active ? optionBtnActiveStyle : {})
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="count-m-footer" style={footerStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>ยกเลิก</button>
          <button
            type="button"
            onClick={() => onApply(selected)}
            style={applyBtnStyle}
            disabled={!selected}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

// Minimal inline styles so the modal looks acceptable without editing CSS files.
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1200
};

const modalStyle = {
  width: 360,
  maxWidth: '95%',
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  fontFamily: 'inherit'
};

const headerStyle = {
  background: '#0b2b4a',
  color: '#fff',
  padding: '14px 18px',
  fontSize: 18,
  textAlign: 'center'
};

const bodyStyle = {
  padding: 18,
  minHeight: 84
};

const optionsRowStyle = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap'
};

const optionBtnStyle = {
  border: '1px solid #ccc',
  background: '#fff',
  borderRadius: 8,
  width: 40,
  height: 40,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const optionBtnActiveStyle = {
  background: '#0b2b4a',
  color: '#fff',
  borderColor: '#0b2b4a'
};

const footerStyle = {
  display: 'flex',
  gap: 12,
  justifyContent: 'flex-end',
  padding: '12px 18px',
  borderTop: '1px solid #eee'
};

const cancelBtnStyle = {
  padding: '8px 18px',
  borderRadius: 20,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer'
};

const applyBtnStyle = {
  padding: '8px 18px',
  borderRadius: 20,
  border: 'none',
  background: '#f1b500',
  color: '#111',
  cursor: 'pointer'
};

export default CountModal;
