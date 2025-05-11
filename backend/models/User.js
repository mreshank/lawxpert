const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Contact Information
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  alternatePhoneNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Personal Information
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  
  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Professional Information
  occupation: String,
  organization: String,
  designation: String,
  
  // Legal Information
  aadharNumber: {
    type: String,
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhar number']
  },
  panNumber: {
    type: String,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  
  // Account Settings
  role: {
    type: String,
    enum: ['user', 'lawyer', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Preferences
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'hinglish'],
    default: 'en'
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Legal History
  legalHistory: [{
    caseType: String,
    caseNumber: String,
    filingDate: Date,
    status: String,
    description: String
  }],
  
  // Emergency Contact
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  
  // Document Verification
  documents: [{
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'passport', 'driving_license', 'other']
    },
    documentNumber: String,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date
  }],
  
  // Last Login Information
  lastLogin: {
    timestamp: Date,
    ipAddress: String,
    deviceInfo: String
  },
  
  // Account Security
  securityQuestions: [{
    question: String,
    answer: String
  }],
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  
  // Social Media Links
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.twoFactorSecret;
      delete ret.securityQuestions;
      return ret;
    }
  }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ aadharNumber: 1 });
userSchema.index({ panNumber: 1 });

module.exports = mongoose.model('User', userSchema); 