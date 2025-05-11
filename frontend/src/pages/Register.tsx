import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, CircleDot, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';

interface ValidationRule {
  rule: string;
  isValid: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  occupation: string;
  userType: 'client' | 'lawyer';
}

interface SelectChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    userType: 'client',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    personalInfo: false,
    additionalInfo: false,
    addressInfo: false,
    securityInfo: false,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordRules, setPasswordRules] = useState<ValidationRule[]>([
    { rule: 'At least 8 characters', isValid: false },
    { rule: 'At least one uppercase letter', isValid: false },
    { rule: 'At least one lowercase letter', isValid: false },
    { rule: 'At least one number', isValid: false },
    { rule: 'At least one special character', isValid: false },
  ]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validatePersonalInfo = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.phone.trim() !== '';
  };

  const validateAdditionalInfo = () => {
    const hasDateOfBirth = formData.dateOfBirth !== '';
    const hasGender = formData.gender !== '';
    const hasUserType = formData.userType === 'client' || formData.userType === 'lawyer';

    // Update validation state
    setValidation(prev => ({
      ...prev,
      additionalInfo: hasDateOfBirth && hasGender && hasUserType
    }));

    return hasDateOfBirth && hasGender && hasUserType;
  };

  const validateAddressInfo = () => {
    return formData.address.trim() !== '' &&
           formData.city.trim() !== '' &&
           formData.state.trim() !== '' &&
           formData.pincode.trim() !== '';
  };

  const validateSecurityInfo = () => {
    return formData.password.length >= 8 &&
           formData.password === formData.confirmPassword;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,12}$/;
    return phoneRegex.test(phone);
  };

  const validatePincode = (pincode: string) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
  };

  const validatePassword = (password: string) => {
    const rules = [
      { rule: 'At least 8 characters', isValid: password.length >= 8 },
      { rule: 'At least one uppercase letter', isValid: /[A-Z]/.test(password) },
      { rule: 'At least one lowercase letter', isValid: /[a-z]/.test(password) },
      { rule: 'At least one number', isValid: /[0-9]/.test(password) },
      { rule: 'At least one special character', isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
    setPasswordRules(rules);
    return rules.every(rule => rule.isValid);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!validatePhone(value)) {
          error = 'Please enter a valid phone number (10-12 digits)';
        }
        break;
      case 'pincode':
        if (!validatePincode(value)) {
          error = 'Please enter a valid 6-digit PIN code';
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          error = 'Password does not meet requirements';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
    }
    return error;
  };

  useEffect(() => {
    setValidation({
      personalInfo: validatePersonalInfo(),
      additionalInfo: validateAdditionalInfo(),
      addressInfo: validateAddressInfo(),
      securityInfo: validateSecurityInfo(),
    });
  }, [formData]);

  const isFormValid = () => {
    return validation.personalInfo &&
           validation.additionalInfo &&
           validation.addressInfo &&
           validation.securityInfo;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    handleChange({ target: { name, value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      return setError('Please fill in all required fields correctly');
    }

    try {
      setError('');
      setLoading(true);
      
      // Create registration data without confirmPassword
      const { confirmPassword, ...registrationData } = formData;
      
      await register(registrationData);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Failed to create an account. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ValidationIcon = ({ isValid }: { isValid: boolean }) => (
    isValid ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <CircleDot className="w-5 h-5 text-gray-400" />
    )
  );

  const ValidationMessage = ({ message }: { message: string }) => (
    <div className="flex items-center gap-1 text-sm text-red-500 mt-1">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <ValidationIcon isValid={validation.personalInfo} />
              </div>
              
              <div>
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Additional Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <ValidationIcon isValid={validation.additionalInfo} />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="userType">Account Type <span className="text-red-500">*</span></Label>
                <Select name="userType" value={formData.userType} onValueChange={(value) => handleSelectChange('userType', value as 'client' | 'lawyer')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Address Information</h3>
                <ValidationIcon isValid={validation.addressInfo} />
              </div>

              <div>
                <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="pincode">PIN Code <span className="text-red-500">*</span></Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Security Information</h3>
                <ValidationIcon isValid={validation.securityInfo} />
              </div>
              
              <div>
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className={cn(fieldErrors.password && "border-red-500")}
                />
                {fieldErrors.password && <ValidationMessage message={fieldErrors.password} />}
              </div>

              <div className={cn(
                "mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                isPasswordFocused ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              )}>
                {passwordRules.map((rule, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 text-sm transform transition-all duration-300"
                    style={{
                      transform: isPasswordFocused ? 'translateX(0)' : 'translateX(-10px)',
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border transition-colors duration-300",
                      rule.isValid ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}>
                      {rule.isValid && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={cn(
                      "text-sm transition-colors duration-300",
                      rule.isValid ? "text-green-600" : "text-gray-500"
                    )}>
                      {rule.rule}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    className={cn(
                      "pr-10",
                      fieldErrors.confirmPassword && "border-red-500",
                      formData.confirmPassword && !fieldErrors.confirmPassword && "border-green-500"
                    )}
                  />
                  {formData.confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {fieldErrors.confirmPassword ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.confirmPassword && <ValidationMessage message={fieldErrors.confirmPassword} />}
                
                <div className={cn(
                  "mt-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                  isConfirmPasswordFocused ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div 
                    className="flex items-center gap-2 text-sm transform transition-all duration-300"
                    style={{
                      transform: isConfirmPasswordFocused ? 'translateX(0)' : 'translateX(-10px)',
                    }}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border transition-colors duration-300",
                      !fieldErrors.confirmPassword && formData.confirmPassword ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}>
                      {!fieldErrors.confirmPassword && formData.confirmPassword && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={cn(
                      "text-sm transition-colors duration-300",
                      !fieldErrors.confirmPassword && formData.confirmPassword ? "text-green-600" : "text-gray-500"
                    )}>
                      Passwords match
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full max-w-md"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-sm text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
