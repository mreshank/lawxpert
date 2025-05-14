import React from 'react';
import { registerRootComponent } from 'expo';
import SimpleLawXpert from './SimpleLawXpert';

// This is a stripped-down version of the app with minimal overhead
export default function SimpleApp() {
  return <SimpleLawXpert />;
}

// Register as the main component
registerRootComponent(SimpleApp); 