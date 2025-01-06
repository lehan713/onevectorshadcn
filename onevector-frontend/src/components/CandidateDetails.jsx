import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CandidateDetails.css';
import oneVectorImage from './images/onevector.png';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTheme } from "../ThemeContext"; // Ensure correct import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, ChevronRight, LogOut, Eye, Download, Edit2 } from 'lucide-react';
import { cn } from "@/lib/utils";



function CandidateDetails() {
    const location = useLocation();
    const candidate = location.state?.candidate; // Get candidate data from the state
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [isEditing, setIsEditing] = useState({
        personal: false,
        qualifications: false,
        skills: false,
        certifications: false
    });
    const [newSkill, setNewSkill] = useState('');
const [newCertification, setNewCertification] = useState('');

    const [formData, setFormData] = useState({
        personalDetails: {},
        qualifications: [],
        skills: [],
        username: '',
        certifications: []
    });
    const [resumeFile, setResumeFile] = useState(null); // For handling resume file upload
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

  
      // Prepare the data for Excel export
      const handleDownloadDetails = () => {
        // Prepare data for row-by-row export
        const rowData = [
            // Header Row
            ['Candidate Details'],
            [], // Empty row for spacing
    
            // Personal Details Section
            ['Personal Details'],
            ['Username', candidate.username || 'N/A'],
            ['First Name', formData.personalDetails?.first_name || 'N/A'],
            ['Last Name', formData.personalDetails?.last_name || 'N/A'],
            ['Phone Number', formData.personalDetails?.phone_no || 'N/A'],
            ['City', formData.personalDetails?.city || 'N/A'],
            ['State', formData.personalDetails?.state || 'N/A'],
            ['Postal Code', formData.personalDetails?.postal_code || 'N/A'],
            ['Address', formData.personalDetails?.address_line1 || 'N/A'],
            ['LinkedIn URL', formData.personalDetails?.linkedin_url || 'N/A'],
            [], // Empty row for separation
    
            // Qualifications Section
            ['Qualifications'],
        ...formData.qualifications.flatMap((qual) => [
            ['Recent Job', qual.recent_job || 'N/A'],
            ['Preferred Roles', qual.preferred_roles || 'N/A'],
            ['Availability', qual.availability || 'N/A'],
            ['Compensation', qual.compensation || 'N/A'],
            ['Preferred Role Type', qual.preferred_role_type || 'N/A'],
            ['Preferred Work Arrangement', qual.preferred_work_arrangement || 'N/A'],
            [] // Empty row between qualification sets
        ]),
    
            // Skills Section
            ['Skills', formData.skills.join(', ') || 'N/A'],
            [], // Empty row for separation
    
            // Certifications Section
            
            ['Certifications', formData.certifications.join(', ') || 'N/A']
        ];
    
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(rowData);
    
        // Style for header rows
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4472C4" } }
        };
    
        // Apply styling to section headers
        ['A1', 'A3', 'A12', 'A24', 'A26'].forEach(cell => {
            if (worksheet[cell]) {
                worksheet[cell].s = headerStyle;
            }
        });
    
        // Adjust column widths
        worksheet['!cols'] = [
            { wch: 30 },  // First column
            { wch: 50 }   // Second column
        ];
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidate Details');
    
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        // Create and save the file
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${candidate.username}_details.xlsx`);
    };

    // Fixed useEffect for initial data fetch
    useEffect(() => {
      if (candidate?.id) {
          fetchPersonalDetails(candidate.id);
      }
  }, [candidate]);

  const fetchPersonalDetails = async (id) => {
      try {
          const response = await axios.get(`http://localhost:3000/api/personalDetails/${id}`);
          setDetails(response.data);
          setFormData({
              personalDetails: response.data.personalDetails || {},
              qualifications: response.data.qualifications || [],
              skills: response.data.skills || [],
              certifications: response.data.certifications || []
          });
      } catch (err) {
          setError('Failed to fetch personal details');
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  // Fixed handleChange function
  const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name.startsWith('qualification_')) {
          const [, index, field] = name.split('_');
          setFormData(prev => {
              const updatedQualifications = [...prev.qualifications];
              if (!updatedQualifications[index]) {
                  updatedQualifications[index] = {};
              }
              updatedQualifications[index] = {
                  ...updatedQualifications[index],
                  [field]: value
              };
              return { ...prev, qualifications: updatedQualifications };
          });
      } else if (name.startsWith('personalDetails_')) {
          const field = name.split('_')[1];
          setFormData(prev => ({
              ...prev,
              personalDetails: {
                  ...prev.personalDetails,
                  [field]: value
              }
          }));
      }
  };

  // Fixed handleSubmit function
  const handleSubmit = async (e, section) => {
      e.preventDefault();
      if (!details?.personalDetails?.id) {
          setError('No ID found for update');
          return;
      }

      try {
          const id = details.personalDetails.id;
          const formDataToSubmit = new FormData();

          switch (section) {
              case 'personal':
                  Object.entries(formData.personalDetails).forEach(([key, value]) => {
                      formDataToSubmit.append(key, value);
                  });
                  if (resumeFile) {
                      formDataToSubmit.append('resume', resumeFile);
                  }
                  await axios.put(`http://localhost:3000/api/candidates/${id}/personal`, formDataToSubmit, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  break;
                  
              case 'qualifications':
                  await axios.put(`http://localhost:3000/api/candidates/${id}/qualifications`, {
                      qualifications: formData.qualifications
                  });
                  break;

              case 'skills':
                  await axios.put(`http://localhost:3000/api/candidates/${id}/skills`, {
                      skills: formData.skills
                  });
                  break;

              case 'certifications':
                  await axios.put(`http://localhost:3000/api/candidates/${id}/certifications`, {
                      certifications: formData.certifications
                  });
                  break;
          }

          await fetchPersonalDetails(id);
          handleEditToggle(section);
      } catch (err) {
          setError(`Failed to update ${section}: ${err.message}`);
      }
  };
    const handleAddSkill = () => {
      if (newSkill.trim()) {
        setFormData({
          ...formData,
          skills: [...formData.skills, newSkill.trim()]
        });
        setNewSkill('');
      }
    };
    
    const handleRemoveSkill = (index) => {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        skills: newSkills
      });
    };
    
    const handleAddCertification = () => {
      if (newCertification.trim()) {
        setFormData({
          ...formData,
          certifications: [...formData.certifications, newCertification.trim()]
        });
        setNewCertification('');
      }
    };
    
    const handleRemoveCertification = (index) => {
      const newCertifications = formData.certifications.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        certifications: newCertifications
      });
    };
    

    const handleResumeUpload = async () => {
        if (!resumeFile) {
            setError('Please select a resume file to upload');
            return;
        }
        
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        try {
            const response = await axios.post('http://localhost:3000/api/uploadResume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Handle success - maybe show a success message
            console.log('Resume uploaded successfully:', response.data);
        } catch (error) {
            setError('Failed to upload resume');
        }
    };

    const handleDownloadResume = async () => {
           try {
               const resumeUrl = `http://localhost:3000/api/resume/${details.personalDetails.id}`;
               window.open(resumeUrl, '_blank'); // Opens the resume in a new tab
             } catch (error) {
               alert('Failed to view resume');
             }
   };

   const handleResumeChange = (e, index) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
      const updatedQualifications = [...formData.qualifications];
      updatedQualifications[index].resume_path = file.name; // Update the resume_path with the file name
      setFormData({
        ...formData,
        qualifications: updatedQualifications,
      });
    }
  };
  


    const handleEditToggle = (section) => {
      setIsEditing((prevState) => ({
        ...prevState,
        [section]: !prevState[section],
      }));
    };
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
    };
    
const recentJob = formData.qualifications.length > 0 ? formData.qualifications[0].recent_job : 'No Recent Job';

  

         return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
  <header
      className={cn(
        "fixed top-0 left-0 right-0 z-10 shadow-md",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}
    >
      <div className="flex justify-between items-center p-4 w-full">
  {/* Logo and Title (left-aligned) */}
  <div className="flex items-center space-x-2">
    <img
      src={oneVectorImage}
      alt="OneVector Logo"
      className="w-5 h-6 md:w-10 md:h-10"
    />
    <h1
      className={cn(
        "text-3xl font-semibold tracking-wide",
        isDarkMode
          ? "text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]"
          : "text-transparent bg-clip-text bg-gradient-to-r from-[#15BACD] to-[#094DA2]"
      )}
    >
      TalentHub
    </h1>
  </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className={cn(
              "px-6 py-2 h-12 rounded-full flex items-center justify-center space-x-3 font-semibold text-base transition-all",
              isDarkMode
                ? "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
                : "bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 12H9m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Logout</span>
          </Button>
        </div>
    </header>
  
      {/* Main Content */}
      <div className="px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mt-8 mb-2 ">
        <Button 
  variant="ghost" 
  size="lg" 
  onClick={() => navigate('/admin-dashboard')}
  className={cn(
    "gap-2 px-4 py-2 rounded-md transition-all",
    isDarkMode
      ? " hover:bg-gray-600 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
  )}
>
  <Home className="h-6 w-4" />
  Dashboard
</Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">Candidate Details</span>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#15BACD] to-[#094DA2] p-8 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {`${formData?.personalDetails?.first_name || ''} ${formData?.personalDetails?.last_name || ''}`.trim() || 'N/A'}
              </h2>
              <p className="text-xl text-gray-100 mt-2">
                {formData.qualifications?.[0]?.recent_job || 'No Recent Job'}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                className="bg-white hover:bg-gray-100 text-[#094DA2] font-medium"
                onClick={handleDownloadResume}
              >
                <Eye className="h-5 w-5 mr-2" />
                View Resume
              </Button>
              <Button 
                className="bg-white hover:bg-gray-100 text-[#094DA2] font-medium"
                onClick={handleDownloadDetails}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Details
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Details</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditToggle('personal')}
                className="border-[#15BACD] text-[#15BACD] hover:bg-[#15BACD] hover:text-white transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {isEditing.personal ? (
              <form onSubmit={(e) => handleSubmit(e, 'personal')}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      name="phone_no"
                      value={formData.personalDetails?.phone_no || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Country</Label>
                    <Input
                      name="country"
                      value={formData.personalDetails?.country || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">City</Label>
                    <Input
                      name="city"
                      value={formData.personalDetails?.city || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">State</Label>
                    <Input
                      name="state"
                      value={formData.personalDetails?.state || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Postal Code</Label>
                    <Input
                      name="postal_code"
                      value={formData.personalDetails?.postal_code || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Address</Label>
                    <Input
                      name="address_line1"
                      value={formData.personalDetails?.address_line1 || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">LinkedIn URL</Label>
                    <Input
                      name="linkedin_url"
                      value={formData.personalDetails?.linkedin_url || ''}
                      onChange={handleChange}
                      className="border-gray-300 dark:border-gray-600 focus:border-[#15BACD] focus:ring-[#15BACD]"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleEditToggle('personal')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-[#15BACD] to-[#094DA2] text-white hover:opacity-90"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Username</Label>
                  <p className="font-medium text-[#343636] dark:text-white">{candidate.username || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Phone Number</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.phone_no || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Country</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.country || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">City</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.city || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">State</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.state || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Postal Code</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.postal_code || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Address</Label>
                  <p className="text-[#343636] dark:text-white font-medium">{formData.personalDetails?.address_line1 || 'N/A'}</p>
                </div>
                <div className="space-y-2">
  <Label className="text-sm text-gray-500 dark:text-gray-400">LinkedIn URL</Label>
  {formData.personalDetails?.linkedin_url ? (
    <a
      href={formData.personalDetails.linkedin_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block truncate text-black dark:text-white font-medium underline"
      title={formData.personalDetails.linkedin_url}
    >
      {formData.personalDetails.linkedin_url}
    </a>
  ) : (
    <p className="text-gray-900 dark:text-white font-medium">N/A</p>
  )}
</div>

              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg mb-6">
  <div className="border-b border-gray-200 dark:border-gray-700 p-6">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Qualifications</h3>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEditToggle('qualifications')}
        className="border-[#15BACD] text-[#15BACD] hover:bg-[#15BACD] hover:text-white transition-colors"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit Details
      </Button>
    </div>
  </div>

  <div className="p-6">
    {isEditing.qualifications ? (
      <form onSubmit={(e) => handleSubmit(e, 'qualifications')}>
        {formData.qualifications.map((qual, index) => (
          <div key={index} className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Recent Job</Label>
                <Input
                  name={`qualification_${index}_recent_job`}
                  value={qual.recent_job || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Role</Label>
                <Input
                  name={`qualification_${index}_preferred_roles`}
                  value={qual.preferred_roles || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2">
                <Label>Availability</Label>
                <Input
                  name={`qualification_${index}_availability`}
                  value={qual.availability || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2">
                <Label>Compensation</Label>
                <Input
                  name={`qualification_${index}_compensation`}
                  value={qual.compensation || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Role Type</Label>
                <Input
                  name={`qualification_${index}_preferred_role_type`}
                  value={qual.preferred_role_type || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Work Type</Label>
                <Input
                  name={`qualification_${index}_preferred_work_arrangement`}
                  value={qual.preferred_work_arrangement || ''}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-[#15BACD] focus:ring-[#15BACD]"
                />
              </div>
              <div className="space-y-2 col-span-2 md:col-start-3 md:col-end-4">
  <Label>Resume</Label>
    <Input
    type="file"
    name={`qualification_${index}_resume`}
    onChange={(e) => handleResumeChange(e, index)}
    className="block mt-2"
  />
</div>
            </div>
          </div>
        ))}
        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleEditToggle('qualifications')}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-[#15BACD] to-[#094DA2] text-white hover:opacity-90"
          >
            Save Changes
          </Button>
        </div>
      </form>
    ) : (
      <div className="space-y-6">
        {formData.qualifications.map((qual, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Recent Job</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.recent_job || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Preferred Role</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.preferred_roles || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Availability</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.availability || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Compensation</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.compensation || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Preferred Role Type</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.preferred_role_type || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Preferred Work Type</Label>
              <p className="text-gray-900 dark:text-white font-medium">{qual.preferred_work_arrangement || 'N/A'}</p>
            </div>
            <div className="space-y-2 col-span-2 md:col-start-3 md:col-end-4">
              <Label className="text-sm text-gray-500 dark:text-gray-400">Resume</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.personalDetails?.resume_path || 'No resume uploaded'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>


{/* Skills and Certifications Grid */}
<div className="grid md:grid-cols-2 gap-8">
  {/* Skills Section */}
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h3>
        <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEditToggle('qualifications')}
        className="border-[#15BACD] text-[#15BACD] hover:bg-[#15BACD] hover:text-white transition-colors"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit Skills
      </Button>
      </div>
    </div>
    
    <div className="p-6">
      {isEditing.skills ? (
        <form onSubmit={(e) => handleSubmit(e, 'skills')}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill"
                className="border-gray-300 dark:border-gray-600"
              />
              <Button 
                type="button" 
                onClick={handleAddSkill}
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[100px] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {formData.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="inline-flex items-center h-8 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-sm border border-gray-300 dark:border-gray-600"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData(prevState => ({
                    ...prevState,
                    skills: details.skills || []
                  }));
                  handleEditToggle('skills');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div
              key={index} 
              className="inline-flex items-center h-8 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-sm border border-gray-300 dark:border-gray-600"
            >
              {skill}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Certifications Section */}
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="border-b border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Certifications</h3>
        <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEditToggle('qualifications')}
        className="border-[#15BACD] text-[#15BACD] hover:bg-[#15BACD] hover:text-white transition-colors"
      >
        <Edit2 className="h-4 w-4 mr-2" />
        Edit Certifications
      </Button>
      </div>
    </div>
    
    <div className="p-6">
      {isEditing.certifications ? (
        <form onSubmit={(e) => handleSubmit(e, 'certifications')}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Enter a certification"
                className="border-gray-300 dark:border-gray-600"
              />
              <Button 
                type="button" 
                onClick={handleAddCertification}
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[100px] border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {formData.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className="inline-flex items-center h-8 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-sm border border-gray-300 dark:border-gray-600"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData(prevState => ({
                    ...prevState,
                    certifications: details.certifications || []
                  }));
                  handleEditToggle('certifications');
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          {formData.certifications.map((cert, index) => (
            <div
              key={index} 
              className="inline-flex items-center h-8 px-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-sm border border-gray-300 dark:border-gray-600"
            >
              {cert}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
</div>
</div>
         );}

export default CandidateDetails;