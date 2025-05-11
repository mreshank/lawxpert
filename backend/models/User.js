const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10,12}$/, 'Please enter a valid phone number (10-12 digits)']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
  },
  occupation: {
    type: String,
    trim: true
  },
  userType: {
    type: String,
    enum: ['client', 'lawyer'],
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  alternatePhoneNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  country: {
    type: String,
    default: 'India'
  },
  organization: String,
  designation: String,
  aadharNumber: {
    type: String,
    match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhar number']
  },
  panNumber: {
    type: String,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
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
  legalHistory: [{
    caseType: String,
    caseNumber: String,
    filingDate: Date,
    status: String,
    description: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
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
  lastLogin: {
    timestamp: Date,
    ipAddress: String,
    deviceInfo: String
  },
  securityQuestions: [{
    question: String,
    answer: String
  }],
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
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

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 });
userSchema.index({ aadharNumber: 1 });
userSchema.index({ panNumber: 1 });

module.exports = mongoose.model('User', userSchema); 