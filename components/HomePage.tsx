
import React, { useEffect, useRef } from 'react';

// Define SVG Icons as React Components for clarity
const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.697-3.697H8.25c-1.135 0-2.165-.93-2.165-2.165V8.511c0-.495.148-.975.416-1.378A4.895 4.895 0 018.25 6h6.75c.615 0 1.217.256 1.659.723S17.445 7.9 17.75 8.511zM12.75 11.25H11.25L12 9.75l.75 1.5zM15 11.25H13.5L14.25 9.75l.75 1.5zM7.5 11.25H6L6.75 9.75l.75 1.5z" />
  </svg>
);

const LanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 6.061 14.287 6.5 15.5 6.5m6 0v2.625m0 0A48.474 48.474 0 0115.5 9.5m0 0c-1.12 0-2.233-.038-3.334-.114M12.5 9.136V6.5m0 0a3 3 0 00-3-3h-.75a3 3 0 00-3 3v.375c0 .621.124 1.223.355 1.789m2.29-1.159a3 3 0 00-3 3v3.159c0 .621.124 1.223.355 1.789m.645-3.359A3 3 0 019.75 9.5m0 0c1.213 0 2.316.312 3.25.864m2.093-4.331A3 3 0 0012.5 6.5m0 0L9 5.25m3.5 1.25v2.364" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75l-1.25-1.75L14 12l1.25-1.25L17 9l1.25 1.75L19.5 12zM12.75 5.25L12 6.5l-.75-1.25L10.5 5.25l.75-.75L12 3l.75.75.75.75z" />
  </svg>
);

const UserFriendlyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LearningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a11.95 11.95 0 01-4.5 0m0-2.355a12.06 12.06 0 00-4.5 0m6.75-10.098a6.75 6.75 0 016.75 0m-6.75 0a6.75 6.75 0 00-6.75 0m6.75 0v.375A2.625 2.625 0 019.75 12h-.008A2.625 2.625 0 017.125 9.375v-.375m0 0A2.625 2.625 0 019.75 6h.008a2.625 2.625 0 012.625 2.625v.375m0 0A2.625 2.625 0 0114.25 12h.008a2.625 2.625 0 012.625-2.625v-.375m0 0a6.75 6.75 0 00-6.75 0z" />
  </svg>
);

const KeyboardInputIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
  </svg>
);

const AiProcessingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v3.75A2.25 2.25 0 0014.25 13.5h1.5V12A2.25 2.25 0 0013.5 9.75h-1.5A2.25 2.25 0 019.75 7.5V6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V6m0 1.5V6m0 1.5v3.75m0-3.75V6m3.75 1.5A2.25 2.25 0 0113.5 9.75h-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 16.5a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115.75 16.5v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V16.5z" />
  </svg>
);

const AiResponseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.75c0 .621.504 1.125 1.125 1.125zM3.375 16.5h17.25c.621 0 1.125-.504 1.125-1.125v-.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V15.375c0 .621.504 1.125 1.125 1.125z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.336 0-2.5.376-3.5 1.002A4.5 4.5 0 0112 15.75c1.336 0 2.5-.376 3.5-1.002a4.524 4.524 0 00-3.5-1.998z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75A2.25 2.25 0 0114.25 9v1.5a2.25 2.25 0 01-4.5 0V9A2.25 2.25 0 0112 6.75z" />
  </svg>
);


const HomePage: React.FC = () => {
  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const keyFeatures = [
    {
      Icon: ChatBubbleIcon,
      title: "ការសន្ទនាឆ្លាតវៃ (Intelligent Conversations)",
      description: "ចូលរួមក្នុងការសន្ទនាបែបធម្មជាតិ និងឆ្លាតវៃ។ AI របស់យើងយល់ពីបរិបទ និងផ្តល់ការឆ្លើយតបដែលពាក់ព័ន្ធ។ (Engage in natural and intelligent conversations. Our AI understands context and provides relevant responses.)"
    },
    {
      Icon: LanguageIcon,
      title: "ផ្តោតលើភាសាខ្មែរ (Khmer Language Focus)",
      description: "រចនាឡើងជាពិសេសសម្រាប់ការប្រាស្រ័យទាក់ទងយ៉ាងរលូនជាភាសាខ្មែរ ជាមួយនឹងការយល់ដឹង និងការបង្កើតភាសាខ្មែរដ៏ល្អឥតខ្ចោះ។ (Specifically designed for seamless communication in Khmer, with excellent understanding and generation of the Khmer language.)"
    },
    {
      Icon: SparklesIcon,
      title: "ដំណើរការដោយ Gemini (Powered by Gemini)",
      description: "ប្រើប្រាស់ Gemini API ដ៏ទំនើបពី Google សម្រាប់សមត្ថភាព AI ដ៏មានឥទ្ធិពល និងត្រឹមត្រូវ។ (Leveraging the cutting-edge Gemini API from Google for powerful and accurate AI capabilities.)"
    }
  ];

  const benefits = [
     {
      Icon: LanguageIcon, // Re-using LanguageIcon for bilingual support
      title: "ការគាំទ្រពីរភាសាគ្មានថ្នេរ (Seamless Bilingual Support)",
      description: "ងាយស្រួលប្តូររវាងភាសាខ្មែរ និងអង់គ្លេស។ AI របស់យើងសម្របខ្លួនទៅតាមចំណូលចិត្តភាសារបស់អ្នក។ (Easily switch between Khmer and English. Our AI adapts to your language preference.)"
    },
    {
      Icon: UserFriendlyIcon,
      title: "ចំណុចប្រទាក់ងាយស្រួលប្រើ (User-Friendly Interface)",
      description: "រចនាឡើងដោយភាពសាមញ្ញក្នុងចិត្ត ធ្វើឱ្យការជជែកមានភាពងាយស្រួល និងរីករាយសម្រាប់មនុស្សគ្រប់គ្នា។ (Designed with simplicity in mind, making chatting easy and enjoyable for everyone.)"
    },
    {
      Icon: LearningIcon,
      title: "រៀនសូត្រ និងកែលម្អជានិច្ច (Always Learning & Improving)",
      description: "AI របស់យើងត្រូវបានធ្វើបច្ចុប្បន្នភាព និងកែលម្អជាបន្តបន្ទាប់ ដើម្បីផ្តល់នូវបទពិសោធន៍កាន់តែប្រសើរឡើង។ (Our AI is continuously updated and refined to provide an ever-improving experience.)"
    }
  ];

  const howItWorksSteps = [
    {
      Icon: KeyboardInputIcon,
      title: "១. អ្នកវាយបញ្ចូល (1. You Type)",
      description: "ចាប់ផ្តើមដោយវាយសំណួរ ឬឃ្លារបស់អ្នកទៅក្នុងប្រអប់ជជែក។ អ្នកអាចប្រើភាសាខ្មែរ ឬអង់គ្លេស។ (Start by typing your question or phrase into the chat box. You can use Khmer or English.)"
    },
    {
      Icon: AiProcessingIcon,
      title: "២. AI ដំណើរការ (2. AI Processes)",
      description: "AI ដ៏ឆ្លាតវៃរបស់យើងវិភាគការបញ្ចូលរបស់អ្នកភ្លាមៗ ដោយយល់ពីបរិបទ និងគោលបំណង។ (Our intelligent AI instantly analyzes your input, understanding the context and intent.)"
    },
    {
      Icon: AiResponseIcon,
      title: "៣. AI ឆ្លើយតប (3. AI Responds)",
      description: "AI បង្កើតការឆ្លើយតបដែលពាក់ព័ន្ធ និងមានប្រយោជន៍ជាភាសាដែលអ្នកបានជ្រើសរើស។ (The AI generates a relevant and helpful response in your chosen language.)"
    }
  ];


  return (
    <div className={`flex flex-col items-center justify-start min-h-full p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 ${khmerFont} overflow-y-auto`}>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-3xl mt-6 mb-8">
        <h1 
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-white dark:focus:ring-offset-slate-800 rounded-sm"
        >
          សូមស្វាគមន៍មកកាន់ AI Plus Khmer! (Welcome to AI Plus Khmer!)
        </h1>
        <p className="text-md sm:text-lg text-gray-700 dark:text-gray-300 mb-4 text-center">
          នេះគឺជាគេហទំព័រដើមរបស់អ្នក។ ស្វែងយល់ពីលក្ខណៈពិសេសរបស់យើង ហើយចាប់ផ្តើមជាមួយជំនួយការ AI ដ៏ឆ្លាតវៃរបស់យើង។
          (This is your home page. Explore our features and get started with our intelligent AI assistant.)
        </p>
        <p className="text-sm sm:text-md text-gray-600 dark:text-gray-400 text-center">
          ចុចលើ "AI Plus Khmer Chat" នៅក្នុង Navbar ដើម្បីចាប់ផ្តើមការសន្ទនា។
          (Click on "AI Plus Khmer Chat" in the navigation bar to start chatting.)
        </p>
      </div>

      {/* Key Features Section */}
      <div className="w-full max-w-4xl px-2 mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-8 text-center">
          លក្ខណៈពិសេសសំខាន់ៗ (Key Features)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {keyFeatures.map((feature, index) => (
            <div key={`feature-${index}`} className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transition-shadow duration-300">
              <feature.Icon className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full max-w-4xl px-2 mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-teal-600 dark:text-teal-400 mb-8 text-center">
          អត្ថប្រយោជន៍ដែលអ្នកទទួលបាន (Benefits You Get)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div key={`benefit-${index}`} className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transition-shadow duration-300">
              <benefit.Icon className="w-12 h-12 sm:w-16 sm:h-16 text-teal-500 dark:text-teal-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-4xl px-2 mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-orange-600 dark:text-orange-400 mb-8 text-center">
          របៀបដែលវាដំណើរការ (How It Works)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {howItWorksSteps.map((step, index) => (
            <div key={`step-${index}`} className="flex flex-col items-center text-center bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transition-shadow duration-300">
              <step.Icon className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 dark:text-orange-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

       <footer className="mt-auto pt-8 pb-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Plus Khmer Chat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
