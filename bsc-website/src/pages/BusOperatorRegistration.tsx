import { useState, useMemo } from "react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Bus, Calendar, Mail, Phone, MapPin, Truck, Plus, Trash2, Building, User, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { philippinesAddresses, type Province, type City } from "../data/philippinesAddresses";
import { supabase } from "@/integrations/supabase/client";

const routes = [
  "Naga City to Legaspi",
  "Naga City to Daet",
  "Naga City to Manila",
  "Naga City to Sorsogon",
  "Naga City to Masbate"
];

const suffixOptions = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];

// Define interfaces for our form data
interface BusinessAddress {
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

interface BusDetails {
  plateNumber: string;
  busName: string;
  route: string;
  capacity: string;
  franchiseDocument: File | null;
}

interface FormData {
  operatorType: "individual" | "company";
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthday: Date | null;
  contactNumber: string;
  emailAddress: string;
  contactPerson: string;
  contactInfo: string;
  fleetSize: string;
  licenseNumber: string;
  companyName: string;
  businessAddress: BusinessAddress;
  buses: BusDetails[];
}

const BusOperatorRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    operatorType: "individual",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "None",
    birthday: null,
    contactNumber: "",
    emailAddress: "",
    contactPerson: "",
    contactInfo: "",
    fleetSize: "",
    licenseNumber: "",
    companyName: "",
    businessAddress: {
      street: "",
      barangay: "",
      city: "",
      province: "",
      zipCode: ""
    },
    buses: [{
      plateNumber: "",
      busName: "",
      route: "",
      capacity: "",
      franchiseDocument: null
    }]
  });

  const steps = [
    { number: 1, title: "Operator Information", icon: User },
    { number: 2, title: "Business Address", icon: MapPin },
    { number: 3, title: "Bus Details", icon: Bus },
    { number: 4, title: "Review Details", icon: Check }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'businessAddress') {
        setFormData({
          ...formData,
          businessAddress: {
            ...formData.businessAddress,
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleProvinceChange = (province: string) => {
    setFormData({
      ...formData,
      businessAddress: {
        ...formData.businessAddress,
        province,
        city: "",
        zipCode: ""
      }
    });
  };

  const handleCityChange = (city: string) => {
    const selectedProvince = philippinesAddresses.find(p => p.name === formData.businessAddress.province);
    const selectedCity = selectedProvince?.cities.find(c => c.name === city);
    
    let zipCode = "";
    if (selectedCity && selectedCity.zipCodes.length === 1) {
      zipCode = selectedCity.zipCodes[0];
    }

    setFormData({
      ...formData,
      businessAddress: {
        ...formData.businessAddress,
        city,
        zipCode,
        barangay: ""
      }
    });
  };

  const handleBarangayChange = (barangay: string) => {
    setFormData({
      ...formData,
      businessAddress: {
        ...formData.businessAddress,
        barangay
      }
    });
  };

  const handleZipCodeChange = (zipCode: string) => {
    setFormData({
      ...formData,
      businessAddress: {
        ...formData.businessAddress,
        zipCode
      }
    });
  };

  // Get available cities based on selected province
  const availableCities = useMemo(() => {
    if (!formData.businessAddress.province) return [];
    const selectedProvince = philippinesAddresses.find(p => p.name === formData.businessAddress.province);
    return selectedProvince?.cities || [];
  }, [formData.businessAddress.province]);

  // Get available ZIP codes based on selected city
  const availableZipCodes = useMemo(() => {
    if (!formData.businessAddress.city) return [];
    const selectedCity = availableCities.find(c => c.name === formData.businessAddress.city);
    return selectedCity?.zipCodes || [];
  }, [formData.businessAddress.city, availableCities]);

  // Get available barangays based on selected city
  const availableBarangays = useMemo(() => {
    if (!formData.businessAddress.city) return [];
    const selectedCity = availableCities.find(c => c.name === formData.businessAddress.city);
    return selectedCity?.barangays || [];
  }, [formData.businessAddress.city, availableCities]);

  const handleOperatorTypeChange = (value: "individual" | "company") => {
    setFormData({
      ...formData,
      operatorType: value
    });
  };

  const handleSuffixChange = (value: string) => {
    setFormData({
      ...formData,
      suffix: value
    });
  };

  const handleBirthdayChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      birthday: date || null
    });
  };

  const addBus = () => {
    setFormData({
      ...formData,
      buses: [...formData.buses, {
        plateNumber: "",
        busName: "",
        route: "",
        capacity: "",
        franchiseDocument: null
      }]
    });
  };

  const removeBus = (index: number) => {
    if (formData.buses.length > 1) {
      const newBuses = formData.buses.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        buses: newBuses
      });
    }
  };

  const updateBus = (index: number, field: keyof BusDetails, value: string) => {
    const newBuses = [...formData.buses];
    newBuses[index] = { ...newBuses[index], [field]: value };
    setFormData({
      ...formData,
      buses: newBuses
    });
  };

  const handleBusFileChange = (e: React.ChangeEvent<HTMLInputElement>, busIndex: number) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, or PDF file",
          variant: "destructive"
        });
        return;
      }
      
      const newBuses = [...formData.buses];
      newBuses[busIndex] = { ...newBuses[busIndex], franchiseDocument: file };
      setFormData({
        ...formData,
        buses: newBuses
      });
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPreviews = [...filePreviews];
          newPreviews[busIndex] = e.target?.result as string;
          setFilePreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDF, just show the filename
        const newPreviews = [...filePreviews];
        newPreviews[busIndex] = "PDF uploaded: " + file.name;
        setFilePreviews(newPreviews);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Process each bus separately
      for (let i = 0; i < formData.buses.length; i++) {
        const bus = formData.buses[i];
        
        // Upload franchise document to storage
        let franchiseDocumentUrl = '';
        if (bus.franchiseDocument) {
          const fileExt = bus.franchiseDocument.name.split('.').pop();
          const fileName = `${Date.now()}_bus${i + 1}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('franchise-documents')
            .upload(fileName, bus.franchiseDocument);
          
          if (uploadError) {
            throw uploadError;
          }
          
          franchiseDocumentUrl = fileName;
        }
        
        // Insert data into registered_buses table for each bus
        const { error } = await supabase
          .from('registered_buses')
          .insert({
            first_name: formData.operatorType === "individual" ? formData.firstName : formData.companyName,
            middle_name: formData.middleName,
            last_name: formData.lastName,
            suffix: formData.suffix,
            birthdate: formData.birthday ? format(formData.birthday, "yyyy-MM-dd") : "",
            contact_number: formData.contactNumber,
            email_address: formData.emailAddress,
            street_address: formData.businessAddress.street,
            barangay: formData.businessAddress.barangay,
            city: formData.businessAddress.city,
            province: formData.businessAddress.province,
            postal_code: formData.businessAddress.zipCode,
            plate_number: bus.plateNumber,
            route: bus.route,
            franchise_document_url: franchiseDocumentUrl,
          });

        if (error) {
          throw error;
        }
      }

      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (formData.operatorType === "individual") {
          return formData.firstName && formData.lastName && formData.birthday && 
                 formData.contactNumber && formData.emailAddress && formData.contactPerson && 
                 formData.contactInfo && formData.fleetSize && formData.licenseNumber;
        } else {
          return formData.companyName && formData.contactPerson && formData.contactInfo && 
                 formData.fleetSize && formData.licenseNumber;
        }
      case 2:
        return formData.businessAddress.street && formData.businessAddress.city && 
               formData.businessAddress.province && formData.businessAddress.zipCode;
      case 3:
        return formData.buses.every(bus => 
          bus.plateNumber && bus.busName && bus.route && bus.capacity && bus.franchiseDocument
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-100 text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for registering as a bus operator with {formData.buses.length} bus(es). 
              We will review your application and get back to you shortly.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              You will receive a confirmation email with your application details and reference number.
            </p>
            <Button onClick={() => navigate("/")} className="px-8">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bus className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bus Operator Registration</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Register your bus operation to join Bicol Central Station Terminal network. Complete the form
            below with your business details. This registration process follows ISO 9000:2015 quality management standards.
          </p>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                        isCompleted ? "bg-primary border-primary text-white" :
                        isCurrent ? "bg-primary/10 border-primary text-primary" :
                        "bg-gray-100 border-gray-300 text-gray-400"
                      )}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm mt-2 text-center",
                        isCurrent ? "text-primary font-medium" : "text-gray-500"
                      )}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 mx-4 transition-colors",
                        isCompleted ? "bg-primary" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Step 1: Operator Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 1: Operator Information
                </h2>
                
                {/* Operator Type Selection */}
                <div>
                  <Label className="text-base font-medium">
                    Operator Type <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={formData.operatorType} 
                    onValueChange={handleOperatorTypeChange}
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer">
                        <Building className="w-4 h-4" />
                        Individual
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.operatorType === "company" ? (
                  <div>
                    <Label htmlFor="companyName" className="text-base">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <>
                    {/* Individual Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-base">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="middleName" className="text-base">
                          Middle Name
                        </Label>
                        <Input
                          id="middleName"
                          name="middleName"
                          placeholder="Enter middle name"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="lastName" className="text-base">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="suffix" className="text-base">
                          Suffix
                        </Label>
                        <Select value={formData.suffix} onValueChange={handleSuffixChange}>
                          <SelectTrigger id="suffix" className="mt-1">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {suffixOptions.map(suffix => (
                              <SelectItem key={suffix} value={suffix}>
                                {suffix}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Birthday Field */}
                    <div>
                      <Label htmlFor="birthday" className="text-base">
                        Birthday <span className="text-red-500">*</span>
                      </Label>
                      <div className="mt-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full text-left justify-start font-normal",
                                !formData.birthday && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formData.birthday ? format(formData.birthday, "PPP") : "Select your birthday"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={formData.birthday || undefined}
                              onSelect={handleBirthdayChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactNumber" className="text-base flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="09XXXXXXXXX"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emailAddress" className="text-base flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.emailAddress}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Additional Operator Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson" className="text-base">
                      Contact Person <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      placeholder="Primary contact person"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactInfo" className="text-base">
                      Contact Info <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactInfo"
                      name="contactInfo"
                      placeholder="Additional contact information"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fleetSize" className="text-base">
                      Fleet Size <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fleetSize"
                      name="fleetSize"
                      type="number"
                      placeholder="Total number of buses"
                      value={formData.fleetSize}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="licenseNumber" className="text-base">
                      License Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      placeholder="Operator license number"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 2: Business Address
                </h2>
                
                <div>
                  <Label htmlFor="businessAddress.street" className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessAddress.street"
                    name="businessAddress.street"
                    placeholder="House/Unit No., Building, Street Name"
                    value={formData.businessAddress.street}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessAddress.province" className="text-base">Province <span className="text-red-500">*</span></Label>
                    <Select value={formData.businessAddress.province} onValueChange={handleProvinceChange}>
                      <SelectTrigger id="businessAddress.province" className="mt-1">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {philippinesAddresses.map(province => (
                          <SelectItem key={province.name} value={province.name}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="businessAddress.city" className="text-base">City/Municipality <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.businessAddress.city} 
                      onValueChange={handleCityChange}
                      disabled={!formData.businessAddress.province}
                    >
                      <SelectTrigger id="businessAddress.city" className="mt-1">
                        <SelectValue placeholder={formData.businessAddress.province ? "Select city/municipality" : "Select province first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map(city => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessAddress.barangay" className="text-base">Barangay</Label>
                  {availableBarangays.length > 0 ? (
                    <Select 
                      value={formData.businessAddress.barangay} 
                      onValueChange={handleBarangayChange}
                      disabled={!formData.businessAddress.city}
                    >
                      <SelectTrigger id="businessAddress.barangay" className="mt-1">
                        <SelectValue placeholder={formData.businessAddress.city ? "Select barangay" : "Select city first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBarangays.map(barangay => (
                          <SelectItem key={barangay} value={barangay}>
                            {barangay}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="businessAddress.barangay"
                      name="businessAddress.barangay"
                      placeholder="Enter barangay"
                      value={formData.businessAddress.barangay}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="businessAddress.zipCode" className="text-base">ZIP Code <span className="text-red-500">*</span></Label>
                  {availableZipCodes.length === 0 ? (
                    <Input
                      id="businessAddress.zipCode"
                      name="businessAddress.zipCode"
                      placeholder="Select city first"
                      value={formData.businessAddress.zipCode}
                      readOnly
                      disabled
                      className="mt-1 bg-gray-100"
                    />
                  ) : availableZipCodes.length === 1 ? (
                    <Input
                      id="businessAddress.zipCode"
                      value={formData.businessAddress.zipCode}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  ) : (
                    <Select value={formData.businessAddress.zipCode} onValueChange={handleZipCodeChange}>
                      <SelectTrigger id="businessAddress.zipCode" className="mt-1">
                        <SelectValue placeholder="Select ZIP code" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableZipCodes.map(zipCode => (
                          <SelectItem key={zipCode} value={zipCode}>
                            {zipCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Bus Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 3: Bus Details
                </h2>
                
                {formData.buses.map((bus, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-medium text-gray-700">Bus {index + 1}</h3>
                      {formData.buses.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBus(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base">
                          Plate Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="ABC123"
                          value={bus.plateNumber}
                          onChange={(e) => updateBus(index, 'plateNumber', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-base">
                          Bus Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="Bus name or identifier"
                          value={bus.busName}
                          onChange={(e) => updateBus(index, 'busName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label className="text-base">Route from Naga City <span className="text-red-500">*</span></Label>
                        <Select value={bus.route} onValueChange={(value) => updateBus(index, 'route', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a route from Naga City" />
                          </SelectTrigger>
                          <SelectContent>
                            {routes.map(route => (
                              <SelectItem key={route} value={route}>
                                {route}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-base">
                          Capacity <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="Number of passengers"
                          value={bus.capacity}
                          onChange={(e) => updateBus(index, 'capacity', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="text-base">Franchise Document <span className="text-red-500">*</span></Label>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleBusFileChange(e, index)}
                          accept=".jpg,.jpeg,.png,.pdf"
                        />
                        
                        {filePreviews[index] ? (
                          <div>
                            {filePreviews[index].startsWith('data:image') ? (
                              <div className="mx-auto w-full max-w-xs">
                                <img src={filePreviews[index]} alt="Document preview" className="mx-auto max-h-32 object-contain" />
                                <p className="mt-2 text-sm text-gray-600">Click to change file</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-primary font-medium">{filePreviews[index]}</p>
                                <p className="mt-2 text-sm text-gray-600">Click to change file</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p className="text-primary font-medium">Click to upload</p>
                            <p className="mt-2 text-sm text-gray-500">
                              Upload franchise document for Bus {index + 1}. Accepted formats: JPG, PNG, PDF (max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBus}
                    className="w-full border-dashed border-2 py-8 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Bus
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Step 4: Review Details
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Operator Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span>{formData.operatorType === "individual" ? "Individual" : "Company"}</span>
                      
                      {formData.operatorType === "individual" ? (
                        <>
                          <span className="text-gray-600">Name:</span>
                          <span>{`${formData.firstName} ${formData.middleName} ${formData.lastName} ${formData.suffix !== "None" ? formData.suffix : ""}`}</span>
                          <span className="text-gray-600">Birthday:</span>
                          <span>{formData.birthday ? format(formData.birthday, "PPP") : ""}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-600">Company:</span>
                          <span>{formData.companyName}</span>
                        </>
                      )}
                      
                      <span className="text-gray-600">Contact:</span>
                      <span>{formData.contactNumber}</span>
                      <span className="text-gray-600">Email:</span>
                      <span>{formData.emailAddress}</span>
                      <span className="text-gray-600">Contact Person:</span>
                      <span>{formData.contactPerson}</span>
                      <span className="text-gray-600">Fleet Size:</span>
                      <span>{formData.fleetSize}</span>
                      <span className="text-gray-600">License Number:</span>
                      <span>{formData.licenseNumber}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Business Address</h3>
                    <div className="text-sm">
                      <p>{formData.businessAddress.street}</p>
                      <p>{formData.businessAddress.barangay}, {formData.businessAddress.city}</p>
                      <p>{formData.businessAddress.province} {formData.businessAddress.zipCode}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Bus Details ({formData.buses.length} bus{formData.buses.length > 1 ? 'es' : ''})</h3>
                    {formData.buses.map((bus, index) => (
                      <div key={index} className="mb-3 p-3 bg-white rounded border">
                        <h4 className="font-medium mb-1">Bus {index + 1}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-600">Plate Number:</span>
                          <span>{bus.plateNumber}</span>
                          <span className="text-gray-600">Bus Name:</span>
                          <span>{bus.busName}</span>
                          <span className="text-gray-600">Route:</span>
                          <span>{bus.route}</span>
                          <span className="text-gray-600">Capacity:</span>
                          <span>{bus.capacity}</span>
                          <span className="text-gray-600">Document:</span>
                          <span>{bus.franchiseDocument ? "✓ Uploaded" : "Not uploaded"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>

            {currentStep === 4 && (
              <p className="text-sm text-gray-500 text-center mt-3">
                By submitting this form, you agree to the terms and conditions of Bicol Central Station and confirm compliance with ISO 9000:2015 quality standards.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusOperatorRegistration;