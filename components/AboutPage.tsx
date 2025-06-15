
import React, { useEffect, useRef } from 'react';

// Define SVG Icons as React Components for clarity within this file
const MissionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    {/* Target/Bullseye like icon */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m0 11.836A11.953 11.953 0 0112 10.5c2.998 0 5.74 1.1 7.843 2.918m0-2.918a8.959 8.959 0 012.157 5.836M3 12.001a8.959 8.959 0 012.157-5.836m12.686 0A11.978 11.978 0 0012 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 003 12.001c0 .778.099 1.533.284 2.253" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TechnologyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // Chip / AI Brain Icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9.75V12m0 2.25V12m0 0h1.5m-1.5 0V9.75M12 7.5v1.5M12 15v1.5M8.25 9.75h1.5M14.25 9.75h1.5M8.25 14.25h1.5M14.25 14.25h1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12L9 9m3 3l3-3m-3 3l-3 3m3-3l3 3" />
  </svg>
);

const KhmerUnderstandingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 // Simple Language/Culture Icon (e.g., stylized Angkor Wat or similar unique Khmer symbol - using a generic speech/brain for now)
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.75c0 .621.504 1.125 1.125 1.125zM3.375 16.5h17.25c.621 0 1.125-.504 1.125-1.125v-.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V15.375c0 .621.504 1.125 1.125 1.125z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75A2.25 2.25 0 0114.25 9v1.5a2.25 2.25 0 01-4.5 0V9A2.25 2.25 0 0112 6.75zM12 12.75c-1.336 0-2.5.376-3.5 1.002A4.5 4.5 0 0112 15.75c1.336 0 2.5-.376 3.5-1.002a4.524 4.524 0 00-3.5-1.998z" />
 </svg>
);

const BilingualIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // Globe or two speech bubbles icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 6.061 14.287 6.5 15.5 6.5m6 0v2.625m0 0A48.474 48.474 0 0115.5 9.5m0 0c-1.12 0-2.233-.038-3.334-.114m-2.666 0A2.25 2.25 0 019.5 7.125V6.75a2.25 2.25 0 012.25-2.25H13.5a2.25 2.25 0 012.25 2.25v.375m1.5-1.875a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" />
  </svg>
);

const UserCentricIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EvolutionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // Arrows in circle / growth icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const FriendlyBotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  // Friendly robot/AI face
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3h9m-9.303-17.854A17.926 17.926 0 0112 3c3.563 0 6.885 1.033 9.303 2.746M9 8.25a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM12 12.75h.008v.008H12v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const AboutPage: React.FC = () => {
  const khmerFont = "font-['Kantumruy_Pro',_sans-serif]";
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const specialFeatures = [
    {
      Icon: KhmerUnderstandingIcon,
      title: "ការយល់ដឹងជ្រៅជ្រះភាសាខ្មែរ (Deep Khmer Understanding)",
      description: "លើសពីការបកប្រែត្រង់ៗ AI របស់យើងយល់ពីឃ្លា វប្បធម៌ និងបរិបទរបស់ខ្មែរធានាថាការសន្ទនាមានអារម្មណ៍ធម្មជាតិ និងគោរព។ (Beyond direct translation, our AI comprehends Khmer nuances, culture, and context, ensuring conversations feel natural and respectful.)",
      color: "text-red-500 dark:text-red-400", 
      bgColor: "bg-red-50 dark:bg-red-900/30",
      titleColor: "text-red-700 dark:text-red-300",
    },
    {
      Icon: BilingualIcon,
      title: "ភាពបត់បែនពីរភាសា (Bilingual Agility)",
      description: "ប្តូររវាងភាសាខ្មែរ និងអង់គ្លេសដោយងាយស្រួល។ AI របស់យើងសម្របខ្លួនយ៉ាងរលូន ដែលធ្វើឱ្យវាក្លាយជាឧបករណ៍ដែលអាចប្រើបានច្រើនសម្រាប់តម្រូវការទំនាក់ទំនងចម្រុះ។ (Switch between Khmer and English effortlessly. Our AI adapts seamlessly, making it a versatile tool for diverse communication needs.)",
      color: "text-sky-500 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-900/30",
      titleColor: "text-sky-700 dark:text-sky-300",
    },
    {
      Icon: UserCentricIcon,
      title: "ផ្តោតលើអ្នកប្រើប្រាស់ (User-Centric Design)",
      description: "ចំណុចប្រទាក់ដែលវិចារណញាណ និងបទពិសោធន៍ជជែកដែលត្រូវបានបង្កើតឡើងដោយគិតពីអ្នក ដោយផ្តល់អាទិភាពភាពងាយស្រួលនៃការប្រើប្រាស់ និងលទ្ធភាពប្រើប្រាស់សម្រាប់ទាំងអស់គ្នា។ (An intuitive interface and chat experience crafted with you in mind, prioritizing ease of use and accessibility for all.)",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      titleColor: "text-green-700 dark:text-green-300",
    },
    {
      Icon: EvolutionIcon,
      title: "ការវិវត្តឥតឈប់ឈរ (Constant Evolution)",
      description: "យើងប្តេជ្ញាកែលម្អ និងពង្រីកសមត្ថភាពរបស់ AI Plus Khmer Chat ជាបន្តបន្ទាប់ ដោយផ្អែកលើមតិអ្នកប្រើប្រាស់ និងការរីកចម្រើននៃ AI ដើម្បីបម្រើអ្នកកាន់តែប្រសើរ។ (We are committed to continuously improving and expanding AI Plus Khmer Chat's capabilities, driven by user feedback and advancements in AI to serve you better.)",
      color: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      titleColor: "text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className={`flex flex-col items-center min-h-full p-4 sm:p-6 ${khmerFont} bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-gray-800 dark:to-slate-700 overflow-y-auto`}>
      <div className="w-full max-w-4xl space-y-10 sm:space-y-16 py-8">
        {/* Header Section */}
        <header className="text-center px-2">
          <h1 
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-indigo-100 dark:focus:ring-offset-slate-900 rounded-sm"
          >
            ស្វែងយល់បន្ថែមអំពី AI Plus Khmer Chat
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
            (Discover More About AI Plus Khmer Chat)
          </p>
        </header>

        {/* Mission Section */}
        <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-2xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <MissionIcon className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-500 dark:text-indigo-400 mb-4 sm:mb-0 flex-shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                បេសកកម្មរបស់យើង (Our Mission)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                បេសកកម្មរបស់យើងគឺភ្ជាប់វប្បធម៌តាមរយៈភាសា ដោយផ្តល់នូវដៃគូ AI ដែលអាចយល់ និយាយ និងគាំទ្រដល់អ្នកប្រើប្រាស់ជាភាសាខ្មែរ និងអង់គ្លេស ដោយការលើកកម្ពស់ការយល់ដឹង ការផ្តល់ជំនួយភ្លាមៗ និងការអបអរសាទរភាពចម្រុះភាសា។ យើងមានបំណងធ្វើឱ្យបច្ចេកវិទ្យា AI អាចចូលប្រើបាន និងផ្តល់អត្ថប្រយោជន៍សម្រាប់សហគមន៍ដែលនិយាយភាសាខ្មែរនៅទូទាំងពិភពលោក។
                <br className="my-1" />
                (Our mission is to bridge cultures through language, offering an AI companion that understands, converses, and supports users in both Khmer and English by fostering understanding, providing instant assistance, and celebrating linguistic diversity. We aim to make AI technology accessible and beneficial for the Khmer-speaking community worldwide.)
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-2xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <TechnologyIcon className="w-16 h-16 sm:w-20 sm:h-20 text-purple-500 dark:text-purple-400 mb-4 sm:mb-0 flex-shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                បច្ចេកវិទ្យានៅពីក្រោយ (The Technology Behind It)
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                AI Plus Khmer Chat ត្រូវបានបំពាក់ដោយ Gemini API ដ៏ទំនើបរបស់ Google ដែលធានានូវការយល់ដឹងភាសាធម្មជាតិកម្រិតខ្ពស់ និងសមត្ថភាពបង្កើតការឆ្លើយតប។ ផ្នែកខាងមុខត្រូវបានបង្កើតឡើងដោយប្រើ React និង Tailwind CSS ធានាបាននូវអន្តរកម្មអ្នកប្រើប្រាស់ដ៏ទំនើប ឆ្លើយតប និងរីករាយ។
                <br className="my-1" />
                (AI Plus Khmer Chat is powered by Google's state-of-the-art Gemini API, ensuring advanced natural language understanding and response generation capabilities. The frontend is built with React and Tailwind CSS, ensuring a cutting-edge, responsive, and delightful user interaction.)
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Us Special Section */}
        <section className="px-1">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500">
            អ្វីដែលធ្វើឱ្យយើងពិសេស (What Makes Us Special)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {specialFeatures.map((feature) => (
              <div key={feature.title} className={`p-6 rounded-lg shadow-lg hover:shadow-xl dark:shadow-gray-700/50 dark:hover:shadow-gray-600/60 transition-shadow duration-300 flex flex-col items-center text-center ${feature.bgColor}`}>
                <feature.Icon className={`w-12 h-12 sm:w-14 sm:h-14 mb-4 ${feature.color}`} />
                <h3 className={`text-xl sm:text-2xl font-semibold ${feature.titleColor} mb-2`}>{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Meet Your AI Section */}
        <section className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 dark:from-pink-700 dark:via-red-700 dark:to-yellow-600 p-6 sm:p-8 rounded-xl shadow-xl text-white">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <FriendlyBotIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white mb-4 sm:mb-0 flex-shrink-0 filter drop-shadow-lg" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                ជួបជាមួយ AI របស់អ្នក (Meet Your AI)
              </h2>
              <p className="text-base sm:text-lg leading-relaxed opacity-95 dark:opacity-90">
                AI Plus Khmer Chat មិនមែនគ្រាន់តែជាកម្មវិធីទេ វាជាដៃគូឌីជីថលរបស់អ្នក។ យើងបានរចនាវាឡើងដើម្បីឱ្យមានប្រយោជន៍ ទាក់ទាញ និងត្រៀមខ្លួនជានិច្ចដើម្បីរៀនជាមួយអ្នក ដែលធ្វើឱ្យរាល់ការជជែកជាជំហានឆ្ពោះទៅរកការប្រាស្រ័យទាក់ទងកាន់តែឆ្លាតវៃ។
                <br className="my-1" />
                (AI Plus Khmer Chat isn't just a program; it's your digital companion. We've designed it to be helpful, engaging, and always ready to learn alongside you, making every chat a step towards smarter communication.)
              </p>
            </div>
          </div>
        </section>

      </div>

      <footer className="mt-auto pt-8 pb-4 sm:pb-6 text-center text-sm text-gray-700 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Plus Khmer Chat. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
