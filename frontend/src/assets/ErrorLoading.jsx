import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

// Placeholder if data in DetailsPage is still loading
export const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <LinearProgress color="inherit" />
    </div>
);

export const ErrorMessage = ({ message }) => (
    <div className="text-accentred text-center">
        <p>{message}</p>
    </div>
);