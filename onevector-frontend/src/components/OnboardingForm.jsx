import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { ChevronDownIcon } from '@heroicons/react/solid';
import TalentHubImage from './images/talenthub.png';
import { Eye, EyeOff } from "lucide-react";


const OnboardingForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState('');
const [passwordError, setPasswordError] = useState('');
const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
            try {
                const skillsResponse = await axios.get('http://localhost:3000/api/skills');
                setSkills(skillsResponse.data.map(skill => skill.skill_name));

                const certificationsResponse = await axios.get('http://localhost:3000/api/certifications');
                setCertifications(certificationsResponse.data.map(cert => cert.certification_name));
            } catch (error) {
                console.error('Error fetching skills and certifications:', error);
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
          // Post request with the form data
          const response = await axios.post('http://localhost:3000/api/submit-candidate', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            
          });
          navigate('/success');
          
        /*  if (response.status === 200) {
            // Redirect to success page
            navigate('/success');
          }*/
        } catch (error) {
          console.error('Error submitting the form:', error);
          alert('An error occurred while submitting the form. Please try again later.');
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

  const StepIndicator = ({ currentStep }) => (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center relative">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex flex-col items-center relative">
            {/* Line joining the boxes */}
            {idx > 0 && (
              <div
                className={`absolute top-1/2 left-0 right-0 h-1 ${
                  s.id < currentStep
                    ? "bg-green-500"
                    : s.id === currentStep
                    ? "bg-blue-500 animate-progress-bar"
                    : "bg-gray-300"
                }`}
                style={{
                  zIndex: -1,
                  width: "100%", // Ensure the line stretches across the container
                }}
              ></div>
            )}
  
            {/* Step box */}
            <div
              className={`w-auto px-6 py-2 flex items-center justify-center rounded-md text-sm font-semibold ${
                s.id < currentStep
                  ? "bg-green-500 text-white"
                  : s.id === currentStep
                  ? "bg-green-300 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {/* Indicator for in-progress or completed steps */}
              {s.id < currentStep ? (
                <CheckCircle className="h-5 w-5 mr-2 text-white" /> // Tick mark for completed steps
              ) : s.id === currentStep ? (
                <Circle className="h-5 w-5 mr-2 text-gray-400" /> // Gray circle for current step
              ) : (
                <Circle className="h-5 w-5 mr-2 text-gray-400" /> // Empty circle for future steps
              )}
              {s.title}
            </div>
          </div>
        ))}
      </div>
  
      <style jsx>{`
        @keyframes animate-progress-bar {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: animate-progress-bar 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
  
  
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
  <Card className="w-full min-h-screen bg-white shadow-lg p-4">
    {/* Header Section */}
    <div className="flex items-center justify-center mb-6 space-x-4">
      <img src={TalentHubImage} alt="TalentHub" className="h-12" />
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]">
        TalentHub
      </h1>
    </div>

    {step === 1 && (
      <div className="text-center text-base text-gray-700 font-semibold mb-4">
        <p>🌟 Welcome to TalentHub! Ready to join an exciting community of talented individuals? 🌟</p>
      </div>
    )}

    <CardHeader>
      <StepIndicator currentStep={step} />
    </CardHeader>

    <CardContent>
      <form onSubmit={handleNext}>
        <Tabs value={`step-${step}`} className="w-full">
          {/* Step 1: Personal Details */}
          <TabsContent value="step-1">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
              
              {/* Username, Password, First Name, Last Name in one row */}
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2 relative">
  <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
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
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
    </button>
  </div>
  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
</div>

<div className="space-y-2 relative">
  <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
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
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
    </button>
  </div>
  {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
</div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>

              {/* Phone, Address Line 1, Address Line 2, City in one row */}
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input id="phoneNo" type="tel" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

              {/* State, Country, Postal Code, LinkedIn in one row */}
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL <span className="text-red-500">*</span></Label>
                <Input id="linkedinUrl" type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} required />
              </div>
            </div>
          </TabsContent>

          {/* Step 2: Qualifications */}
          <TabsContent value="step-2">
            <div className="grid grid-cols-4 gap-4  gap-y-16">
              <div className="space-y-2">
                <Label htmlFor="recentJob">Recent Job <span className="text-red-500">*</span></Label>
                <Input id="recentJob" value={recentJob} onChange={(e) => setRecentJob(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredRoles">Preferred Roles</Label>
                <Input id="preferredRoles" value={preferredRoles} onChange={(e) => setPreferredRoles(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Availability <span className="text-red-500">*</span></Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="less_than_3_months">Less than 3 months</SelectItem>
                    <SelectItem value="more_than_3_months">More than 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Work Permit Status <span className="text-red-500">*</span></Label>
                <Select value={workPermitStatus} onValueChange={setWorkPermitStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1b">H1B</SelectItem>
                    <SelectItem value="us_citizen">US Citizen</SelectItem>
                    <SelectItem value="green_card">Green Card</SelectItem>
                    <SelectItem value="opt">OPT</SelectItem>
                    <SelectItem value="student_visa">Student Visa</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Role Type</Label>
                <Select value={preferredRoleType} onValueChange={setPreferredRoleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Work Arrangement <span className="text-red-500">*</span></Label>
                <Select value={preferredWorkArrangement} onValueChange={setPreferredWorkArrangement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="work_from_home">Work From Home</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Compensation Range</Label>
                <Input
                  value={preferredCompensationRange}
                  onChange={(e) => setPreferredCompensationRange(e.target.value)}
                  placeholder="e.g., $50,000 - $70,000/year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume <span className="text-red-500">*</span></Label>
                <Input
                  id="resume"
                  type="file"
                  onChange={(e) => setResume(e.target.files[0])}
                  required
                  className="cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="step-3">
  <div className="grid grid-cols-2 gap-8">
    {/* Skills Section */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={toggleSkillsDropdown}
          className="w-full justify-between py-6 px-4 text-lg border-gray-300 shadow-sm hover:shadow-md rounded-lg"
        >
          <span className="truncate">
            {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'Select Skills'}
          </span>
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
        {isSkillsDropdownOpen && (
          <Card className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto border border-gray-300 shadow-lg rounded-lg">
            <CardContent className="p-2">
              {skills.map((skill, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleSkillSelect(skill)}
                  className="w-full justify-start py-2 px-4 text-base text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {skill}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a new skill"
          className="mt-3 py-6 px-4 text-lg border-gray-300 shadow-sm rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="button"
          onClick={handleAddSkill}
          className="mt-3 w-full py-3 px-4 bg-black text-white text-lg rounded-lg shadow-md hover:bg-blue-700"
        >
          Add Skill
        </Button>
        <div className="flex flex-wrap gap-3 mt-3">
          {selectedSkills.map((skill, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="py-2 px-3 bg-gray-200 text-gray-800 text-base rounded-md"
            >
              {skill}
              <span
                onClick={() => handleRemoveSkill(skill)}
                className="ml-3 cursor-pointer text-red-500 font-bold"
              >
                ×
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </div>

    {/* Certifications Section */}
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Certifications</h2>
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={toggleCertificationsDropdown}
          className="w-full justify-between py-6 px-4 text-lg border-gray-300 shadow-sm hover:shadow-md rounded-lg"
        >
          <span className="truncate">
            {selectedCertifications.length > 0 ? selectedCertifications.join(', ') : 'Select Certifications'}
          </span>
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
        {isCertificationsDropdownOpen && (
          <Card className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto border border-gray-300 shadow-lg rounded-lg">
            <CardContent className="p-2">
              {certifications.map((cert, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleCertificationSelect(cert)}
                  className="w-full justify-start py-2 px-4 text-base text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  {cert}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
        <Input
          value={newCertification}
          onChange={(e) => setNewCertification(e.target.value)}
          placeholder="Add a new certification"
          className="mt-3 py-6 px-4 text-lg border-gray-300 shadow-sm rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Button
          type="button"
          onClick={handleAddCertification}
          className="mt-3 w-full py-3 px-4 bg-black text-white text-lg rounded-lg shadow-md hover:bg-blue-700"
        >
          Add Certification
        </Button>
        <div className="flex flex-wrap gap-3 mt-3">
          {selectedCertifications.map((cert, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="py-2 px-3 bg-gray-200 text-gray-800 text-base rounded-md"
            >
              {cert}
              <span
                onClick={() => handleRemoveCertification(cert)}
                className="ml-3 cursor-pointer text-red-500 font-bold"
              >
                ×
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  </div>
</TabsContent>
  </Tabs>

            {/* Navigation Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="px-6"
                >
                  Previous
                </Button>
              )}
              <Button 
                type="submit"
                className="px-6 bg-gradient-to-r from-[#15BACD] to-[#094DA2] text-white"
              >
                {step === 3 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
