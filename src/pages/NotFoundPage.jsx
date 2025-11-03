import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={48} className="text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-secondary">404</h1>
          <h2 className="text-xl font-semibold text-secondary">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto">
              <ApperIcon name="Home" size={16} className="mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;