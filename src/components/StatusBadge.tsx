import React from 'react';
type StatusType =
'pending' |
'accepted' |
'rejected' |
'cancelled' |
'completed' |
'available' |
'swapped' |
'in_transit' |
'delivered';
interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
      case 'completed':
      case 'delivered':
      case 'available':
        return 'bg-secondary-100 text-secondary-800 border-secondary-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'swapped':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-warmGray-100 text-warmGray-800 border-warmGray-200';
    }
  };
  const formatStatus = (s: string) => {
    return s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)} ${className}`}>
      
      {formatStatus(status)}
    </span>);

}