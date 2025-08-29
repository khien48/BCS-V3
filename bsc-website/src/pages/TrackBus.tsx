
import Header from "../components/Header";

const TrackBus = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Track Bus</h1>
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-lg text-gray-600">Bus tracking functionality will be implemented soon.</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 BCS Trip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TrackBus;
