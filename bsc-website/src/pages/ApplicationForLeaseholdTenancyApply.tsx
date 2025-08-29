
// This page is directly copied from RenewalForm and then tweaked for leasehold tenancy application.
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft, ArrowRight, Upload } from "lucide-react";

// Step definitions
const stepList = [{
  label: "Information"
}, {
  label: "Business Details"
}, {
  label: "Requirements"
}, {
  label: "Review & Submit"
}];
const fileFields = [{
  label: "BCS Clearance",
  name: "bcs_clearance"
}, {
  label: "Mayor Permits",
  name: "mayor_permits"
}, {
  label: "DTI's / SEC Registration",
  name: "dti_sec"
}, {
  label: "Drug Test Result",
  name: "drug_test"
}];
export default function ApplicationForLeaseholdTenancyApply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    gender: "",
    birthday: "",
    civil: "",
    nationality: "",
    contact: "",
    email: "",
    zip: "",
    street: "",
    city: "",
    barangay: "",
    province: "",
    country: "",
    business_name: "",
    business_type: "",
    business_nature: ""
  });
  const [files, setFiles] = useState<{
    [key: string]: File | null;
  }>({
    bcs_clearance: null,
    mayor_permits: null,
    dti_sec: null,
    drug_test: null
  });

  // Logic handlers
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  }
  function handleFile(name: string, file: File | null) {
    setFiles(f => ({
      ...f,
      [name]: file
    }));
  }
  function handleDrop(e: React.DragEvent, name: string) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(name, e.dataTransfer.files[0]);
    }
  }
  function handleFileClick(name: string) {
    document.getElementById(`fileinput-${name}`)?.click();
  }
  function handleGoBack() {
    if (step === 0) {
      navigate("/application-for-leasehold-tenancy");
    } else {
      setStep(step - 1);
    }
  }
  function handleNext() {
    if (step < stepList.length - 1) setStep(step + 1);
  }
  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Submission logic here
  }

  // Step panels
  function InfoStep() {
    return <div>
        <h2 className="text-lg md:text-xl font-bold mb-1">Step 1: Information</h2>
        <p className="text-sm text-gray-500 mb-6">Fill out required fields</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="firstname" placeholder="Firstname" value={form.firstname} onChange={handleChange} />
          <Input name="middlename" placeholder="Middlename" value={form.middlename} onChange={handleChange} />
          <Input name="lastname" placeholder="Lastname" value={form.lastname} onChange={handleChange} />
          <Input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
          <div className="relative">
            <Input name="birthday" placeholder="Birthday" type="date" value={form.birthday} onChange={handleChange} className="pr-10" />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <Input name="civil" placeholder="Civil Status" value={form.civil} onChange={handleChange} />
          <Input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} />
          <Input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="zip" placeholder="ZIP/Postal Code" value={form.zip} onChange={handleChange} />
          <Input name="street" placeholder="House/Unit Number, Street" value={form.street} onChange={handleChange} />
          <Input name="city" placeholder="City/Municipality" value={form.city} onChange={handleChange} />
          <Input name="barangay" placeholder="Barangay" value={form.barangay} onChange={handleChange} />
          <Input name="province" placeholder="Province/State" value={form.province} onChange={handleChange} />
          <Input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
        </div>
      </div>;
  }
  function BizStep() {
    return <div>
        <h2 className="text-lg md:text-xl font-bold mb-1">Step 2: Business Details</h2>
        <p className="text-sm text-gray-500 mb-6">Fill out required fields</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="business_name" placeholder="Business Name" value={form.business_name} onChange={handleChange} />
          <Input name="business_type" placeholder="Type of Business" value={form.business_type} onChange={handleChange} />
        </div>
        <Textarea name="business_nature" placeholder="Short description of what the business does" rows={2} value={form.business_nature} onChange={handleChange} className="mt-4" />
      </div>;
  }
  function ReqStep() {
    return <div>
        <h2 className="text-lg md:text-xl font-bold mb-1">Step 3: Requirements</h2>
        <p className="text-sm text-gray-500 mb-2">Upload a readable and valid document</p>
        <ul className="list-disc text-sm text-gray-600 pl-5 mb-4">
          <li>BCS Clearance</li>
          <li>Mayor Permits</li>
          <li>DTI&apos;s / SEC Registration</li>
          <li>Drug Test Result</li>
        </ul>
        <div className="flex flex-col gap-5">
          {fileFields.map(ff => <div key={ff.name} className="border-2 border-dashed border-gray-300 bg-white/50 rounded-xl px-4 py-7 flex flex-col items-center justify-center relative transition-border duration-200" onDrop={e => handleDrop(e, ff.name)} onDragOver={e => e.preventDefault()}>
              <span className="text-base font-semibold text-gray-800 mb-3">{ff.label}</span>
              <Upload className="text-green-700 mb-2" size={32} />
              {files[ff.name] ? <span className="text-green-700 mb-1">{files[ff.name]?.name}</span> : <span className="text-gray-500 text-sm mb-1">Drag and Drop or <button type="button" tabIndex={-1} className="text-green-700 underline" onClick={() => handleFileClick(ff.name)}>Choose file</button></span>}
              <span className="text-xs text-gray-400">(JPG, PNG, or PDF format)</span>
              <input id={`fileinput-${ff.name}`} type="file" accept=".jpg,.png,.pdf,.jpeg" className="hidden" onChange={e => {
            if (e.target.files && e.target.files[0]) handleFile(ff.name, e.target.files[0]);
          }} />
            </div>)}
        </div>
      </div>;
  }
  function ReviewStep() {
    return <div>
        <h2 className="text-lg md:text-xl font-bold mb-1">Step 4: Review &amp; Submit</h2>
        <p className="text-sm text-gray-500 mb-6">Review your information before submitting</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/50 rounded-lg p-4">
          <div>
            <h3 className="font-semibold text-base mb-2">Personal Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><span className="font-medium">Name:</span> {form.firstname} {form.middlename} {form.lastname}</li>
              <li><span className="font-medium">Gender:</span> {form.gender}</li>
              <li><span className="font-medium">Birthday:</span> {form.birthday}</li>
              <li><span className="font-medium">Civil Status:</span> {form.civil}</li>
              <li><span className="font-medium">Nationality:</span> {form.nationality}</li>
              <li><span className="font-medium">Contact:</span> {form.contact}</li>
              <li><span className="font-medium">Email:</span> {form.email}</li>
              <li><span className="font-medium">ZIP/Postal:</span> {form.zip}</li>
              <li><span className="font-medium">Address:</span> {form.street}, {form.barangay}, {form.city}, {form.province}, {form.country}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2">Business Details</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><span className="font-medium">Business Name:</span> {form.business_name}</li>
              <li><span className="font-medium">Type:</span> {form.business_type}</li>
              <li><span className="font-medium">Nature:</span> {form.business_nature}</li>
            </ul>
            <h3 className="font-semibold text-base my-2">Uploaded Documents</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {fileFields.map(ff => <li key={ff.name}>
                  <span className="font-medium">{ff.label}:</span> {files[ff.name]?.name || <span className="text-red-600">Not uploaded</span>}
                </li>)}
            </ul>
          </div>
        </div>
      </div>;
  }

  // Main render
  return <div className="min-h-screen bg-[#f6f7fa] flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-2 md:px-0 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto rounded-3xl flex flex-col gap-8 shadow-none">
          {/* Header & Home */}
          <div className="flex items-center mt-2 mb-1">
            <Button variant="ghost" className="p-2 rounded-full mr-2" onClick={handleGoBack} type="button">
              <ArrowLeft size={24} className="text-gray-500" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Application for Leasehold Tenancy</h1>
          </div>
          {/* Stepper */}
          <div className="w-full flex items-center justify-between mb-4">
            {stepList.map((s, idx) => <div key={s.label} className="flex-1 flex flex-col items-center relative">
                <div className={`flex items-center justify-center rounded-full w-9 h-9 border-2 shadow transition
                    ${idx === step ? "border-green-700 bg-green-700 text-white" : idx < step ? "border-green-400 bg-green-400 text-white" : "border-gray-300 bg-white text-gray-400"}
                  `}>
                  <span className="font-semibold">{idx + 1}</span>
                </div>
                <span className={`mt-1 text-xs font-medium ${idx === step ? "text-green-700" : "text-gray-500"}`}>{s.label}</span>
                {idx < stepList.length - 1 && <div className="absolute top-4 left-full w-full h-0.5 border-t border-gray-300 z-0" />}
              </div>)}
          </div>
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl p-6 md:py-10 md:px-8 shadow-lg flex flex-col gap-10 border border-gray-100">
            {/* Show relevant step only */}
            {step === 0 && <InfoStep />}
            {step === 1 && <BizStep />}
            {step === 2 && <ReqStep />}
            {step === 3 && <ReviewStep />}
            {/* Step controls */}
            <div className="flex gap-3 mt-6 items-center justify-between flex-row-reverse">
              {step === stepList.length - 1 ? <Button type="submit" className="w-48 bg-green-700 hover:bg-green-800 text-white text-lg font-medium h-12 rounded-lg shadow-md">
                  Submit
                </Button> : <Button type="button" onClick={handleNext} className="w-40 bg-green-700 hover:bg-green-800 text-white text-base font-medium h-11 rounded-lg flex items-center justify-center">
                  Next <ArrowRight size={18} className="ml-1" />
                </Button>}
              {step > 0 && <Button type="button" variant="secondary" onClick={handlePrev} className="w-32 h-11 rounded-lg flex items-center justify-center">
                  <ArrowLeft size={18} className="mr-1" /> Back
                </Button>}
            </div>
          </form>
        </div>
      </main>
    </div>;
}
