export function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
