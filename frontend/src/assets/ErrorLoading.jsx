import React from 'react';

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
    </div>
);

export const ErrorMessage = ({ message }) => (
    <div className="text-red-600 text-center">
        <p>{message}</p>
    </div>
);