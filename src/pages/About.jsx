import { useState } from 'react';
import { AcademicCapIcon, GlobeAltIcon, UsersIcon, LightBulbIcon } from '@heroicons/react/outline';

const About = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'About Us',
      subtitle: 'Excellence in Bilingual Education',
      principalMessage: {
        title: "Principal's Welcome",
        message: "Welcome to Lycée Bilingue Obessa, where we believe in the power of bilingual education to shape future leaders. Our institution has been a beacon of educational excellence for years, combining the best of English and French educational systems to provide students with a truly global perspective.",
        principalName: "Dr. Jean-Marc Obessa",
        principalTitle: "Principal"
      },
      mission: {
        title: "Our Mission",
        items: [
          "Provide quality bilingual education that prepares students for global opportunities",
          "Foster critical thinking, creativity, and innovation in our students",
          "Create a supportive and inclusive learning environment",
          "Develop responsible citizens who contribute positively to society"
        ]
      },
      vision: {
        title: "Our Vision",
        statement: "To be the leading bilingual institution in the region, recognized for academic excellence, innovative teaching methods, and graduates who make meaningful contributions to their communities and the world."
      },
      philosophy: {
        title: "Bilingual Education Philosophy",
        description: "We believe that bilingual education enhances cognitive development, cultural awareness, and future career opportunities. Our curriculum is designed to help students achieve fluency in both English and French while excelling in all academic areas.",
        benefits: [
          "Enhanced cognitive abilities and problem-solving skills",
          "Greater cultural awareness and global perspective",
          "Increased career opportunities in international markets",
          "Improved communication skills across cultures"
        ]
      },
      timeline: [
        { year: "1995", event: "Founded as a small bilingual school" },
        { year: "2005", event: "Expanded to include secondary education" },
        { year: "2015", event: "Launched digital learning platform" },
        { year: "2020", event: "Introduced online learning capabilities" },
        { year: "2024", event: "Integrated video conferencing for live classes" }
      ]
    },
    fr: {
      title: 'À propos de nous',
      subtitle: 'Excellence en éducation bilingue',
      principalMessage: {
        title: "Message du Principal",
        message: "Bienvenue au Lycée Bilingue Obessa, où nous croyons au pouvoir de l'éducation bilingue pour façonner les leaders de demain. Notre institution est un phare d'excellence éducative depuis des années, combinant le meilleur des systèmes éducatifs anglais et français pour offrir aux étudiants une perspective véritablement mondiale.",
        principalName: "Dr. Jean-Marc Obessa",
        principalTitle: "Principal"
      },
      mission: {
        title: "Notre Mission",
        items: [
          "Fournir une éducation bilingue de qualité qui prépare les étudiants aux opportunités mondiales",
          "Favoriser la pensée critique, la créativité et l'innovation chez nos étudiants",
          "Créer un environnement d'apprentissage favorable et inclusif",
          "Développer des citoyens responsables qui contribuent positivement à la société"
        ]
      },
      vision: {
        title: "Notre Vision",
        statement: "Être l'institution bilingue leader dans la région, reconnue pour l'excellence académique, les méthodes d'enseignement innovantes et les diplômés qui apportent des contributions significatives à leurs communautés et au monde."
      },
      philosophy: {
        title: "Philosophie de l'Éducation Bilingue",
        description: "Nous croyons que l'éducation bilingue améliore le développement cognitif, la conscience culturelle et les opportunités de carrière futures. Notre programme est conçu pour aider les étudiants à atteindre la fluidité en anglais et en français tout en excellant dans tous les domaines académiques.",
        benefits: [
          "Capacités cognitives et compétences en résolution de problèmes améliorées",
          "Conscience culturelle et perspective mondiale accrues",
          "Opportunités de carrière accrues sur les marchés internationaux",
          "Compétences de communication améliorées entre les cultures"
        ]
      },
      timeline: [
        { year: "1995", event: "Fondé comme une petite école bilingue" },
        { year: "2005", event: "Élargi pour inclure l'enseignement secondaire" },
        { year: "2015", event: "Lancement de la plateforme d'apprentissage numérique" },
        { year: "2020", event: "Introduction des capacités d'apprentissage en ligne" },
        { year: "2024", event: "Intégration de la visioconférence pour les cours en direct" }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {t.title}
              </h1>
              <p className="text-xl text-blue-100">{t.subtitle}</p>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="px-4 py-2 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {language === 'en' ? 'Français' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Principal's Message */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-blue-800 mr-3" />
                {t.principalMessage.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {t.principalMessage.message}
              </p>
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {t.principalMessage.principalName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{t.principalMessage.principalName}</p>
                  <p className="text-gray-600">{t.principalMessage.principalTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t.mission.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {t.mission.items.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md card-hover">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-amber-50 rounded-2xl p-8 md:p-12">
              <LightBulbIcon className="h-16 w-16 text-amber-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {t.vision.title}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {t.vision.statement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bilingual Philosophy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            {t.philosophy.title}
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            {t.philosophy.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {t.philosophy.benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md card-hover">
                <div className="flex items-start">
                  <GlobeAltIcon className="h-6 w-6 text-blue-800 mr-4 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === 'en' ? 'Our History' : 'Notre Histoire'}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              {t.timeline.map((item, index) => (
                <div key={index} className="relative flex items-start mb-8">
                  <div className="absolute left-6 w-5 h-5 bg-blue-800 rounded-full border-4 border-white shadow"></div>
                  <div className="ml-16 flex-grow">
                    <div className="bg-gray-50 rounded-xl p-6 card-hover">
                      <span className="text-2xl font-bold text-blue-800">{item.year}</span>
                      <p className="text-gray-700 mt-2">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {language === 'en' ? 'Our Values' : 'Nos Valeurs'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: AcademicCapIcon, title: language === 'en' ? 'Excellence' : 'Excellence', color: 'bg-blue-100 text-blue-600' },
              { icon: UsersIcon, title: language === 'en' ? 'Community' : 'Communauté', color: 'bg-amber-100 text-amber-600' },
              { icon: GlobeAltIcon, title: language === 'en' ? 'Diversity' : 'Diversité', color: 'bg-green-100 text-green-600' },
              { icon: LightBulbIcon, title: language === 'en' ? 'Innovation' : 'Innovation', color: 'bg-purple-100 text-purple-600' }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md card-hover">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${value.color} mx-auto mb-4`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;