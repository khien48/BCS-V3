import Header from "../components/Header";
import { Button } from "@/components/ui/button";
const docImage = "/lovable-uploads/61b5fe53-eadc-4b1c-9a2c-bdb6268d4e42.png";

import { useNavigate } from "react-router-dom";

export default function RenewalOfLeaseContract() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row gap-8 px-4 md:px-12 py-8 lg:py-16 max-w-7xl mx-auto w-full">
        {/* Left Column: Requirements & Steps */}
        <section className="flex-1 bg-white/0 rounded-lg shadow-md px-6 py-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Renewal of Lease Contract</h1>
            <h2 className="text-lg font-semibold mb-1 mt-4">Quick Guide</h2>
            <p className="text-gray-700 mb-6 leading-relaxed text-base">
              All registered stallholders are required to renew their Contract of Lease annually, which states therein the guidelines and conditions of their occupancy at the Bicol Central Station.
            </p>

            <h3 className="text-lg font-semibold mb-2 mt-8">Requirements</h3>
            <ul className="list-disc ml-6 mb-6 text-gray-800 space-y-1">
              <li>BCS Clearance on rental and electricity payments.</li>
              <li>Photocopy of Mayor’s Permit.</li>
              <li>Photocopy of DTI Business Name or SEC Registration.</li>
              <li>Original Board Resolution or authorization for representative (if applicable).</li>
              <li>Updated Certificate of Environmental Sanitation.</li>
              <li>Photo showing the stall in good condition with signage.</li>
              <li>Two photos of the applicant and employees. Notarized Affidavit of Undertaking.</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2 mt-8">Processing Steps:</h3>
            <p className="mb-4">Submit Documents: All required documents are submitted for review.</p>
            <ul className="mb-8 space-y-3 text-gray-800">
              <li>
                <span className="font-medium">•</span> Processing Time: 5 minutes<br />
                <span className="text-gray-600">Handled By: Narciso H. Mordal III</span>
              </li>
              <li>
                <span className="font-medium">•</span> Approval Process: Review by Market Committee, Treasurer, and Mayor for approval.<br />
                <span className="text-gray-600">Processing Time: 3 days<br />Handled By: City Mayor, Market Committee Chairman, City Treasurer</span>
              </li>
              <li>
                <span className="font-medium">•</span> Contract Issuance: Signed contract will be released to the applicant.<br />
                <span className="text-gray-600">Processing Time: 1 minute<br />Handled By: Jhona M. Landicho</span>
              </li>
            </ul>
          </div>
          <div>
            <Button
              className="w-full md:w-48 bg-green-700 hover:bg-green-800 text-white text-base py-3 mt-6"
              onClick={() => navigate("/renewal-of-lease-contract/apply")}
            >
              Apply Now
            </Button>
          </div>
        </section>
        {/* Right Column: PDF Viewer */}
        <section className="flex-1 flex flex-col">
          <div className="bg-gray-600 rounded-lg shadow-md flex-1 flex flex-col items-center py-6 px-2">
            <h2 className="text-2xl font-bold mb-6 text-white">Renewal of Lease Contract</h2>
            <div className="flex-1 flex justify-center items-center w-full">
              {/* PDF Viewer Preview - In real app, you can embed a PDF viewer */}
              <img
                src={docImage}
                alt="Lease Contract Sample Document"
                className="rounded-lg shadow-lg w-full max-w-[560px] mx-auto border-4 border-gray-300"
                style={{ background: "#fff" }}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
