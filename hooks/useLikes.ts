import { useContext } from 'react';
import { LikesContext } from '../contexts/LikesContext';

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
