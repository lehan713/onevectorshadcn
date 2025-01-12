import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TalentHubImage from './images/talenthub.png';
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const OnboardingForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordError, setPasswordError] = useState('');
const [confirmPasswordError, setConfirmPasswordError] = useState('');
const [isLoading, setIsLoading] = useState(false);
    // Personal Information States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    // Qualifications States
    const [recentJob, setRecentJob] = useState('');
    const [preferredRoles, setPreferredRoles] = useState('');
    const [availability, setAvailability] = useState('');
    const [workPermitStatus, setWorkPermitStatus] = useState('');
    const [preferredRoleType, setPreferredRoleType] = useState('');
    const [preferredWorkArrangement, setPreferredWorkArrangement] = useState('');
    const [preferredCompensationRange, setPreferredCompensationRange] = useState('');
    const [resume, setResume] = useState(null);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedCertifications, setSelectedCertifications] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState('');
    

    // New state to manage dropdown visibility
    const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
    const [isCertificationsDropdownOpen, setIsCertificationsDropdownOpen] = useState(false);
    

    useEffect(() => {
      const fetchSkillsAndCertifications = async () => {
        setIsLoading(true);
        try {
          const skillsResponse = await axios.get('http://localhost:3000/api/skills');
          setSkills(skillsResponse.data.map(skill => skill.skill_name));
    
          const certificationsResponse = await axios.get('http://localhost:3000/api/certifications');
          setCertifications(certificationsResponse.data.map(cert => cert.certification_name));
        } catch (error) {
          console.error('Error fetching skills and certifications:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchSkillsAndCertifications();
    }, []);

    useEffect(() => {
      // Assuming the email was saved in localStorage when sending the magic link
      const savedEmail = localStorage.getItem('magicLinkEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }, []);

    const handleClearResume = () => {
      setResume(null);
      // Reset the file input
      const fileInput = document.getElementById('resume');
      if (fileInput) fileInput.value = '';
    };
  
    const handleNext = async (event) => {
      event.preventDefault();
  
      if (step === 1 || step === 2) {
        setStep(step + 1);
      } else if (step === 3) {
        const formData = new FormData();
        
        // Append all form data
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('phone_no', phoneNo);
        formData.append('address_line1', addressLine1);
        formData.append('address_line2', addressLine2);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('country', country);
        formData.append('postal_code', postalCode);
        formData.append('linkedin_url', linkedinUrl);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('recent_job', recentJob);
        formData.append('preferred_roles', preferredRoles);
        formData.append('availability', availability);
        formData.append('work_permit_status', workPermitStatus);
        formData.append('preferred_role_type', preferredRoleType);
        formData.append('preferred_work_arrangement', preferredWorkArrangement);
        formData.append('preferred_compensation_range', preferredCompensationRange);
        formData.append('resume', resume);
  
        // Append selected skills and certifications
        selectedSkills.forEach(skill => formData.append('skills[]', skill));
        selectedCertifications.forEach(cert => formData.append('certifications[]', cert));
  
        // Add new skills and certifications if provided
        if (newSkill) {
          formData.append('skills[]', newSkill);
          setNewSkill(''); // Clear the input after submission
        }
  
        if (newCertification) {
          formData.append('certifications[]', newCertification);
          setNewCertification(''); // Clear the input after submission
        }
  
        try {
          const response = await axios.post('http://localhost:3000/api/submit-candidate', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          navigate('/success');
        } catch (error) {
          console.error('Error submitting the form:', error);
          alert('An error occurred while submitting the form. Please try again later.');
        } finally {
          setIsLoading(false); // Hide loader
        }
      }
    };


    const handlePrevious = () => {
      if (step > 1) {
        setStep(step - 1);
      }
    };

    const handleRemoveSkill = (skillToRemove) => {
      setSelectedSkills((prevSkills) => 
        prevSkills.filter((skill) => skill !== skillToRemove)
      );
    };
    
    const handleRemoveCertification = (certToRemove) => {
      setSelectedCertifications((prevCerts) => 
        prevCerts.filter((cert) => cert !== certToRemove)
      );
    };

  const handleAddSkill = () => {
      if (newSkill && !skills.includes(newSkill)) {
          setSkills([...skills, newSkill]);
          setSelectedSkills([...selectedSkills, newSkill]); // Automatically select the new skill
          setNewSkill(''); // Clear the input
      }
  };

  const handleAddCertification = () => {
      if (newCertification && !certifications.includes(newCertification)) {
          setCertifications([...certifications, newCertification]);
          setSelectedCertifications([...selectedCertifications, newCertification]); // Automatically select the new certification
          setNewCertification(''); // Clear the input
      }
  };

  const toggleSkillsDropdown = () => {
      setIsSkillsDropdownOpen(!isSkillsDropdownOpen);
  };

  const toggleCertificationsDropdown = () => {
      setIsCertificationsDropdownOpen(!isCertificationsDropdownOpen);
  };

  const handleSkillSelect = (skill) => {
      if (!selectedSkills.includes(skill)) {
          setSelectedSkills([...selectedSkills, skill]);
      }
      setIsSkillsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleCertificationSelect = (certification) => {
      if (!selectedCertifications.includes(certification)) {
          setSelectedCertifications([...selectedCertifications, certification]);
      }
      setIsCertificationsDropdownOpen(false); // Close the dropdown after selection
  };

  const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Qualifications' },
    { id: 3, title: 'Skills & Certifications' }
  ];


  const [showWelcome, setShowWelcome] = React.useState(true);
  const [formProgress, setFormProgress] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(null);

  // Calculate form progress
  React.useEffect(() => {
    const requiredFields = {
      step1: ['username', 'password', 'firstName', 'lastName', 'linkedinUrl'],
      step2: ['recentJob', 'availability', 'workPermitStatus', 'resume'],
      step3: ['selectedSkills']
    };

    const filledFields = {
      step1: [username, password, firstName, lastName, linkedinUrl].filter(Boolean).length,
      step2: [recentJob, availability, workPermitStatus, resume].filter(Boolean).length,
      step3: [selectedSkills.length > 0].filter(Boolean).length
    };

    const totalProgress = (
      (filledFields.step1 / requiredFields.step1.length +
        filledFields.step2 / requiredFields.step2.length +
        filledFields.step3 / requiredFields.step3.length) /
      3
    ) * 100;

    setFormProgress(Math.round(totalProgress));
  }, [username, password, firstName, lastName, linkedinUrl, recentJob, availability, workPermitStatus, resume, selectedSkills]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
          {isLoading && <LoadingSpinner />}
        {/* Updated Header Section */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <img 
            src={TalentHubImage}
            alt="TalentHub" 
            className="h-12"
          />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]">
            TalentHub
          </h1>
        </div>

    {/* Welcome Screen with Updated Styling */}
    {showWelcome && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto mb-6 mt-24"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
          <CardContent className="p-12">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#353939] mb-6">
                Welcome to TalentHub! 👋
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                Let's create your professional profile in three simple steps
              </p>
              <Button
                onClick={() => setShowWelcome(false)}
                className="px-10 py-4 bg-[#353939] hover:bg-[#454545] text-white text-xl rounded-lg transition-colors shadow-lg"
              >
                Let's Get Started
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )}

   {/* Updated Circular Progress with new color scheme */}
   <div className="fixed top-4 right-4 z-50">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#353939"
              strokeWidth="3"
              strokeDasharray={`${formProgress}, 100`}
              className="transform -rotate-90 origin-center"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-[#353939]">{formProgress}%</span>
          </div>
        </div>
      </div>


    {!showWelcome && (
        <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-gray-200">
          <CardContent className="p-6">
            <form onSubmit={handleNext} className="space-y-8">
              <Tabs value={`step-${step}`} className="space-y-8">
                {/* Step 1: Personal Details */}
                <TabsContent value="step-1">
                  {/* Account Details Section */}
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                      <div className="h-8 w-1 bg-[#353939]"></div>
                      <h3 className="text-lg font-semibold text-[#353939]">Account Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <div className="group">
                        <Label htmlFor="email" className="text-sm font-medium text-[#353939]">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20" 
                          disabled 
                        />
                      </div>
                      <div className="group">
                        <Label htmlFor="username" className="text-sm font-medium text-[#353939]">
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          required 
                        />
                      </div>
                      <div className="group">
                        <Label htmlFor="password" className="text-sm font-medium text-[#353939]">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            value={password} 
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value)) {
                                setPasswordError('Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character');
                              } else {
                                setPasswordError('');
                              }
                              setPassword(value);
                            }}
                            required 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordError && (
                          <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                        )}
                      </div>
                      <div className="group">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#353939]">
                          Confirm Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (e.target.value !== password) {
                                setConfirmPasswordError('Passwords do not match');
                              } else {
                                setConfirmPasswordError('');
                              }
                            }}
                            required
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPasswordError && (
                          <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Section */}
                  <div className="space-y-6 animate-fadeIn mt-8">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                      <div className="h-8 w-1 bg-[#353939]"></div>
                      <h3 className="text-lg font-semibold text-[#353939]">Personal Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      <div className="group">
                        <Label htmlFor="firstName" className="text-sm font-medium text-[#353939]">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="firstName" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          required 
                        />
                      </div>
                      <div className="group">
                        <Label htmlFor="lastName" className="text-sm font-medium text-[#353939]">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="lastName" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          required 
                        />
                      </div>
                      <div className="group">
                        <Label htmlFor="phoneNo" className="text-sm font-medium text-[#353939]">
                          Phone Number
                        </Label>
                        <Input 
                          id="phoneNo" 
                          type="tel" 
                          value={phoneNo} 
                          onChange={(e) => setPhoneNo(e.target.value)} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                        />
                      </div>
                      <div className="group">
                        <Label htmlFor="linkedinUrl" className="text-sm font-medium text-[#353939]">
                          LinkedIn URL <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="linkedinUrl" 
                          type="url" 
                          value={linkedinUrl} 
                          onChange={(e) => setLinkedinUrl(e.target.value)} 
                          className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section with Updated Styling */}
                  <div className="space-y-6 animate-fadeIn mt-8">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                      <div className="h-8 w-1 bg-[#353939]"></div>
                      <h3 className="text-lg font-semibold text-[#353939]">Address Information</h3>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                          <Label htmlFor="addressLine1" className="text-sm font-medium text-[#353939]">
                            Address Line 1
                          </Label>
                          <Input 
                            id="addressLine1" 
                            value={addressLine1} 
                            onChange={(e) => setAddressLine1(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                        <div className="group">
                          <Label htmlFor="addressLine2" className="text-sm font-medium text-[#353939]">
                            Address Line 2
                          </Label>
                          <Input 
                            id="addressLine2" 
                            value={addressLine2} 
                            onChange={(e) => setAddressLine2(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="group">
                          <Label htmlFor="city" className="text-sm font-medium text-[#353939]">
                            City
                          </Label>
                          <Input 
                            id="city" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                        <div className="group">
                          <Label htmlFor="state" className="text-sm font-medium text-[#353939]">
                            State
                          </Label>
                          <Input 
                            id="state" 
                            value={state} 
                            onChange={(e) => setState(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                        <div className="group">
                          <Label htmlFor="country" className="text-sm font-medium text-[#353939]">
                            Country
                          </Label>
                          <Input 
                            id="country" 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                        <div className="group">
                          <Label htmlFor="postalCode" className="text-sm font-medium text-[#353939]">
                            Postal Code
                          </Label>
                          <Input 
                            id="postalCode" 
                            value={postalCode} 
                            onChange={(e) => setPostalCode(e.target.value)} 
                            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

             {/* Step 2: Qualifications */}
<TabsContent value="step-2" className="animate-fadeIn">
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
      <div className="h-8 w-1 bg-[#353939]"></div>
      <h3 className="text-lg font-semibold text-[#353939]">Professional Information</h3>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {/* Current Role Section */}
      <div className="space-y-6">
        <div className="group">
          <Label htmlFor="recentJob" className="text-sm font-medium text-[#353939]">
            Current/Recent Job Title <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="recentJob" 
            value={recentJob} 
            onChange={(e) => setRecentJob(e.target.value)} 
            placeholder="e.g., Senior Software Engineer"
            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
            required 
          />
        </div>

        <div className="group">
          <Label htmlFor="preferredRoles" className="text-sm font-medium text-[#353939]">
            Preferred Job Roles <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="preferredRoles" 
            value={preferredRoles} 
            onChange={(e) => setPreferredRoles(e.target.value)} 
            placeholder="e.g., Full Stack Developer, DevOps Engineer"
            className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
            required
          />
        </div>
      </div>

      {/* Work Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="group">
          <Label className="text-sm font-medium text-[#353939]">
            Availability <span className="text-red-500">*</span>
          </Label>
          <Select value={availability} onValueChange={setAvailability} required>
            <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="2_weeks">2 Weeks Notice</SelectItem>
              <SelectItem value="1_month">1 Month Notice</SelectItem>
              <SelectItem value="2_months">2 Months Notice</SelectItem>
              <SelectItem value="3_months">3+ Months Notice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="group">
          <Label className="text-sm font-medium text-[#353939]">
            Work Authorization <span className="text-red-500">*</span>
          </Label>
          <Select value={workPermitStatus} onValueChange={setWorkPermitStatus} required>
            <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us_citizen">US Citizen</SelectItem>
              <SelectItem value="green_card">Green Card</SelectItem>
              <SelectItem value="h1b">H1B Visa</SelectItem>
              <SelectItem value="l1">L1 Visa</SelectItem>
              <SelectItem value="opt">OPT/CPT</SelectItem>
              <SelectItem value="other">Other Work Authorization</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="group">
          <Label className="text-sm font-medium text-[#353939]">
            Employment Type <span className="text-red-500">*</span>
          </Label>
          <Select value={preferredRoleType} onValueChange={setPreferredRoleType} required>
            <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="contract_to_hire">Contract to Hire</SelectItem>
              <SelectItem value="intern">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="group">
          <Label className="text-sm font-medium text-[#353939]">
            Work Arrangement <span className="text-red-500">*</span>
          </Label>
          <Select value={preferredWorkArrangement} onValueChange={setPreferredWorkArrangement} required>
            <SelectTrigger className="mt-1 bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20">
              <SelectValue placeholder="Select arrangement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onsite">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Updated Resume Upload Section with Clear Button */}
      <div className="space-y-2">
        <Label htmlFor="resume" className="text-sm font-medium text-[#353939]">
          Upload Resume <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="mt-1 cursor-pointer bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20
              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
              file:text-sm file:font-semibold file:bg-[#353939]/10 file:text-[#353939]
              hover:file:bg-[#353939]/20"
            />
          </div>
          {resume && (
            <Button
              type="button"
              onClick={handleClearResume}
              variant="outline"
              className="mt-1 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
        {resume && (
          <p className="text-sm text-[#353939]">
            Selected file: {resume.name}
          </p>
        )}
      </div>
</div>
</div>
</TabsContent>

      
<TabsContent value="step-3" className="animate-fadeIn">
  <div className="max-w-2xl mx-auto space-y-8">
    {/* Skills Section */}
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <div className="h-8 w-1 bg-[#353939]"></div>
        <h3 className="text-lg font-semibold text-[#353939]">Skills & Expertise</h3>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#353939]">
          Technical Skills <span className="text-red-500">*</span>
        </Label>
        
        {/* Skills Input and Dropdown */}
        <div className="relative">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                value={newSkill}
                onChange={(e) => {
                  setNewSkill(e.target.value);
                  setIsSkillsDropdownOpen(true);
                }}
                onFocus={() => setIsSkillsDropdownOpen(true)}
                placeholder="Search or add new skills"
                className="bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
              />
              {isSkillsDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                  {skills
                    .filter(skill => skill.toLowerCase().includes(newSkill.toLowerCase()))
                    .map((skill, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSkillSelect(skill);
                          setNewSkill('');
                          setIsSkillsDropdownOpen(false);
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                    {newSkill && !skills.includes(newSkill) && (
                      <button
                        className="w-full px-4 py-2 text-left text-[#353939] hover:bg-gray-50 focus:bg-gray-50 focus:outline-none font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddSkill();
                          setIsSkillsDropdownOpen(false);
                        }}
                      >
                        Add "{newSkill}" as new skill
                      </button>
                    )}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => {
                handleAddSkill();
                setIsSkillsDropdownOpen(false);
              }}
              className="bg-[#353939] hover:bg-[#454545] text-white"
              disabled={!newSkill.trim()}
            >
              Add Skill
            </Button>
          </div>
        </div>

        {/* Selected Skills */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[100px]">
          {selectedSkills.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No skills selected. Add your technical expertise.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  className="bg-[#353939]/10 text-[#353939] hover:bg-[#353939]/15 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:text-red-500 focus:outline-none"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Certifications Section */}
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <div className="h-8 w-1 bg-[#353939]"></div>
        <h3 className="text-lg font-semibold text-[#353939]">Certifications</h3>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#353939]">
          Professional Certifications
        </Label>

        {/* Certifications Input and Dropdown */}
        <div className="relative">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                value={newCertification}
                onChange={(e) => {
                  setNewCertification(e.target.value);
                  setIsCertificationsDropdownOpen(true);
                }}
                onFocus={() => setIsCertificationsDropdownOpen(true)}
                placeholder="Search or add new certifications"
                className="bg-gray-50 border-gray-200 focus:border-[#353939] focus:ring-[#353939]/20"
              />
              {isCertificationsDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                  {certifications
                    .filter(cert => cert.toLowerCase().includes(newCertification.toLowerCase()))
                    .map((cert, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCertificationSelect(cert);
                          setNewCertification('');
                          setIsCertificationsDropdownOpen(false);
                        }}
                      >
                        {cert}
                      </button>
                    ))}
                    {newCertification && !certifications.includes(newCertification) && (
                      <button
                        className="w-full px-4 py-2 text-left text-[#353939] hover:bg-gray-50 focus:bg-gray-50 focus:outline-none font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddCertification();
                          setIsCertificationsDropdownOpen(false);
                        }}
                      >
                        Add "{newCertification}" as new certification
                      </button>
                    )}
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => {
                handleAddCertification();
                setIsCertificationsDropdownOpen(false);
              }}
              className="bg-[#353939] hover:bg-[#454545] text-white"
              disabled={!newCertification.trim()}
            >
              Add Certification
            </Button>
          </div>
        </div>

        {/* Selected Certifications */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[100px]">
          {selectedCertifications.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No certifications added. Include any relevant professional certifications.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCertifications.map((cert, index) => (
                <Badge 
                  key={index} 
                  className="bg-[#353939]/10 text-[#353939] hover:bg-[#353939]/15 transition-colors"
                >
                  {cert}
                  <button
                    onClick={() => handleRemoveCertification(cert)}
                    className="ml-2 hover:text-red-500 focus:outline-none"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Helper Text */}
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <p className="text-sm text-blue-800">
        <span className="font-semibold">Pro tip:</span> Add both your current skills and certifications, 
        as well as those you're currently pursuing. This helps match you with opportunities that align 
        with your career growth.
      </p>
    </div>
    </div>
    </TabsContent>
            </Tabs>
            
            {/* Updated Navigation Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="px-6 sm:px-8 py-2 border-[#353939] hover:bg-[#353939]/5 text-[#353939] transition-all rounded-lg"
          >
            Previous
          </Button>
        )}
        <Button 
          type="submit"
          className="px-6 sm:px-8 py-2 bg-[#353939] hover:bg-[#454545] text-white transition-all rounded-lg"
        >
          {step === 3 ? 'Submit' : 'Next'}
        </Button>
      </div>
          </form>
        </CardContent>
      </Card>
    )
  }

      {/* Field Helper Messages */}
      <div className="fixed bottom-4 right-4 space-y-4 max-w-[90vw] sm:max-w-sm">
        {lastActive && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="space-y-2"
          >
            {[1, 2, 3].map((messageIndex) => {
              const message = getFieldMessage(lastActive, messageIndex);
              if (!message) return null;
              
              return (
                <Alert key={messageIndex} className="bg-white/95 backdrop-blur-sm border-l-4 border-l-[#15BACD] shadow-lg">
                  <AlertCircle className="h-4 w-4 text-[#15BACD]" />
                  <AlertDescription className="text-sm text-gray-600">
                    {message}
                  </AlertDescription>
                </Alert>
              );
            })}
          </motion.div>
        )}
        {formProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Alert className="bg-white/95 backdrop-blur-sm border-l-4 border-l-green-500 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-sm text-gray-600">
                Perfect! Your profile is complete. Ready to join TalentHub?
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OnboardingForm;
