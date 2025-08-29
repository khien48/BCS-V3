
import Header from "../components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">About BCS Trip</h1>
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-lg text-gray-600 mb-4">
              BCS Trip is a bus reservation and tracking service that provides reliable transportation solutions.
              Our mission is to make bus travel convenient, affordable, and comfortable for our customers.
            </p>
            <p className="text-lg text-gray-600">
              Founded in 2025, we operate multiple routes across the region with a focus on safety, punctuality, and customer satisfaction.
            </p>
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

export default About;
