
import React, { useEffect, useRef } from 'react';
import { ActiveView } from '../types'; // Import ActiveView

// Define SVG Icons as React Components
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden="true">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.093 3.093-1.47-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.623-3.623Z" clipRule="evenodd" />
  </svg>
);

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden="true">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);

interface PricingPageProps {
  onNavigate: (view: ActiveView) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const pricingTiers = [
    {
      id: "free",
      name: "សេរី / Free",
      price: "$0",
      frequency: "/ខែ (month)",
      description: "ចាប់ផ្តើមដោយមិនគិតថ្លៃ។ (Get started for free.)",
      features: [
        "ការចូលប្រើការជជែក AI មូលដ្ឋាន (Basic AI chat access)",
        "50 សារក្នុងមួយថ្ងៃ (50 messages per day)",
        "ការគាំទ្រតាមអ៊ីមែល (Email support)",
        "ការធ្វើបច្ចុប្បន្នភាពជាប្រចាំ (Regular updates)",
      ],
      buttonText: "ចាប់ផ្តើមដោយឥតគិតថ្លៃ (Get Started Free)",
      buttonAction: () => onNavigate(ActiveView.CHAT_APP),
      buttonClass: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
      borderColor: "border-gray-300 dark:border-gray-600",
      isPopular: false,
      textColor: "text-indigo-700 dark:text-indigo-400",
      featureIconColor: "text-indigo-500 dark:text-indigo-400"
    },
    {
      id: "pro",
      name: "ជំនាញ / Pro",
      price: "$10",
      frequency: "/ខែ (month)",
      description: "សម្រាប់អ្នកប្រើប្រាស់កម្រិតខ្ពស់ និងក្រុមតូចៗ។ (For power users and small teams.)",
      features: [
        "ការជជែក AI គ្មានដែនកំណត់ (Unlimited AI chat)",
        "អាទិភាពការចូលប្រើមុខងារថ្មី (Priority access to new features)",
        "ការគាំទ្រអាទិភាព (Priority support)",
        "ការចូលប្រើប្រវត្តិជជែក (Chat history access)",
        "គ្មានការផ្សាយពាណិជ្ជកម្ម (Ad-free experience)",
      ],
      buttonText: "ជ្រើសរើសគម្រោង Pro (Choose Pro Plan)",
      buttonAction: () => onNavigate(ActiveView.CHAT_APP),
      buttonClass: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
      borderColor: "border-purple-500 dark:border-purple-500",
      isPopular: true,
      textColor: "text-purple-700 dark:text-purple-400",
      featureIconColor: "text-purple-500 dark:text-purple-400"
    },
    {
      id: "enterprise",
      name: "សហគ្រាស / Enterprise",
      price: "Custom",
      frequency: "",
      description: "ដំណោះស្រាយតាមតម្រូវការសម្រាប់អាជីវកម្មធំៗ។ (Tailored solutions for large businesses.)",
      features: [
        "មុខងារ Pro ទាំងអស់ (All Pro features)",
        "ការប្តូរម៉ូដែល AI តាមតម្រូវការ (Custom AI model tuning)",
        "ការគាំទ្រផ្តាច់មុខ និង SLA (Dedicated support & SLA)",
        "មុខងារសម្រាប់ក្រុម (Advanced team features)",
        "ការវិភាគកម្រិតខ្ពស់ (Advanced analytics)",
      ],
      buttonText: "ទាក់ទងផ្នែកលក់ (Contact Sales)",
      buttonAction: () => { window.location.href = "mailto:sales@aipuskhmer.com?subject=Enterprise%20Plan%20Inquiry"; },
      buttonClass: "bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600",
      borderColor: "border-gray-300 dark:border-gray-600",
      isPopular: false,
      textColor: "text-teal-700 dark:text-teal-400",
      featureIconColor: "text-teal-500 dark:text-teal-400"
    },
  ];

  return (
    <div className={`flex flex-col items-center min-h-full p-4 sm:p-6 ${khmerFont} bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200 dark:from-slate-900 dark:via-gray-800 dark:to-slate-700 overflow-y-auto`}>
      <div className="w-full max-w-5xl space-y-10 sm:space-y-16 py-8">
        <header className="text-center px-2">
          <h1 
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 rounded-sm"
          >
            គម្រោងតម្លៃរបស់យើង (Our Pricing Plans)
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            ជ្រើសរើសគម្រោងដែលស័ក្តិសមបំផុតសម្រាប់តម្រូវការរបស់អ្នក។ (Choose the plan that's right for you.)
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pricingTiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl dark:shadow-gray-700/50 dark:hover:shadow-gray-600/60 hover:scale-[1.02] transition-all duration-300 ease-in-out border-2 ${tier.isPopular ? tier.borderColor : 'border-transparent dark:border-transparent'} p-6 sm:p-8`}
            >
              {tier.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase ${tier.buttonClass.split(' ')[0]} rounded-full shadow-md`}>
                    <StarIcon className="w-4 h-4 mr-1.5" />
                    ពេញនិយមបំផុត (Most Popular)
                  </span>
                </div>
              )}
              <div className="flex-grow">
                <h2 className={`text-2xl sm:text-3xl font-semibold mb-2 text-center ${tier.textColor}`}>
                  {tier.name}
                </h2>
                <p className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">
                  {tier.price}
                  {tier.frequency && <span className="text-base sm:text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{tier.frequency}</span>}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">{tier.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircleIcon className={`w-5 h-5 ${tier.featureIconColor} mr-2.5 flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={tier.buttonAction}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-150 ease-in-out transform hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${tier.buttonClass} ${tier.isPopular ? 'focus:ring-purple-400 dark:focus:ring-purple-600' : 'focus:ring-indigo-400 dark:focus:ring-indigo-600'}`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </section>

        <section className="text-center text-gray-600 dark:text-gray-400 px-2">
          <p className="text-md sm:text-lg">
          ត្រូវការដំណោះស្រាយធំជាងនេះមែនទេ? (Need a bigger solution?)
          <br className="sm:hidden"/>
            <a href="mailto:sales@aipuskhmer.com?subject=Enterprise%20Plan%20Inquiry" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 active:text-indigo-800 font-semibold underline ml-1 transition-colors duration-150">
            ទាក់ទងមកពួកយើងសម្រាប់គម្រោងសហគ្រាសផ្ទាល់ខ្លួន។ (Contact us for custom enterprise plans.)
            </a>
          </p>
        </section>

      </div>

      <footer className="mt-auto pt-8 pb-4 sm:pb-6 text-center text-sm text-gray-700 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Plus Khmer Chat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PricingPage;
