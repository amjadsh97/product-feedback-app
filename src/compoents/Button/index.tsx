import {CSSProperties} from "react";

interface ButtonProps {
  label: string | number;
  className?: string;
  icon?: string;
  onClick?: () => void;
  bg?:string;
  type?: any,
}

const Button = ({label, icon, className, onClick, bg, type}: ButtonProps) => {
  return (
    <button type={type} className={`button ${className ? className:""}`} onClick={onClick} style={bg ? { '--bg': bg } as CSSProperties : undefined} >
      {icon && <img src={icon} alt={`icon ${icon}`}/>}
      <span>{label}</span>
    </button>
  );
};

export default Button;
