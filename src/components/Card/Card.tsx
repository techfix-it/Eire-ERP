import React from 'react';
import '@/components/Card/Card.css';

interface CardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const Card = ({ title, children, action }: CardProps) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {action && <div className="card-action">{action}</div>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
