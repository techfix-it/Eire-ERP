import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}

const Card = ({ children, title, action }: CardProps) => (
  <div className="card">
    <div className="card-header">
      <h3 className="card-title">{title}</h3>
      {action}
    </div>
    <div className="card-body">{children}</div>
  </div>
);

export default Card;
