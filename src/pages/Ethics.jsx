import { useState } from 'react';
import { BookOpenIcon, ShieldCheckIcon, UsersIcon, ScaleIcon } from '@heroicons/react/outline';

const Ethics = () => {
  const [language, setLanguage] = useState('en');

  const content = {
    en: {
      title: 'Final Guide on Ethics, Moral Values, Laicity and Secularism in GBHS Ombessa',
      subtitle: 'Discipline, Integrity, and Excellence for a Better Future',
      introduction: {
        title: 'Introduction',
        text: 'Ethics and morality are fundamental pillars in the development of every educational institution and society. Schools are not only centers for academic learning but also institutions responsible for shaping the character, behavior, and attitudes of learners. In this regard, Government Bilingual High School Ombessa has the responsibility of promoting values such as discipline, integrity, honesty, respect, responsibility, patriotism, tolerance, laicity, secularism, and peaceful coexistence among students and all members of the educational community.',
        text2: 'The increasing challenges faced by modern society, including indiscipline, violence, examination malpractice, drug abuse, disrespect for authority, indecent dressing, corruption, religious intolerance, and moral decadence, make it necessary for schools to reinforce ethical and moral standards. Moral education therefore becomes a collective responsibility involving the administration, teachers, parents, students, stakeholders, and the entire community of Ombessa.',
        text3: 'This guide provides a framework for the promotion of ethics, morality, laicity, and secularism within GBHS Ombessa. It outlines the responsibilities, expectations, dos and don\'ts of all actors involved in the educational process while emphasizing tolerance, equality, respect for diversity, discipline, and academic excellence.'
      },
      objectives: {
        title: 'Objectives',
        items: [
          'To instill discipline and responsibility among students.',
          'To promote respect for authority, school rules, and human dignity.',
          'To encourage academic honesty and integrity.',
          'To foster peaceful coexistence among all members of the school community.',
          'To promote tolerance, equality, and respect for religious and cultural diversity.',
          'To prevent social vices such as violence, corruption, drug abuse, discrimination, and immorality.'
        ]
      },
      stakeholders: {
        title: 'The Role of Stakeholders',
        description: 'Stakeholders including school administrators, government authorities, religious leaders, traditional rulers, NGOs, and educational partners must collaborate in ensuring moral discipline and ethical conduct within the school.',
        dos: [
          'Promote integrity, transparency, and accountability.',
          'Encourage fairness and equal treatment.',
          'Support discipline and moral education.',
          'Promote tolerance, peace, and national unity.',
          'Collaborate effectively with school authorities.'
        ],
        donts: [
          'Avoid corruption and favoritism.',
          'Avoid interference that weakens discipline.',
          'Avoid encouraging examination malpractice or indiscipline.',
          'Avoid discrimination or intolerance based on religion or ethnicity.'
        ]
      },
      community: {
        title: 'The Role of the Community of Ombessa',
        description: 'The community should promote peace, protect students from negative influences, support educational programs, and collaborate with the school in maintaining discipline and social harmony.',
        dos: [
          'Encourage good behavior among youths.',
          'Support educational and moral initiatives.',
          'Promote peace, unity, tolerance, and respect for cultural diversity.',
          'Help maintain security around the school.'
        ],
        donts: [
          'Avoid encouraging violence, drug abuse, or delinquency.',
          'Avoid exposing students to immoral activities.',
          'Avoid religious or ethnic discrimination.',
          'Avoid harboring students during school hours without justification.'
        ]
      },
      teachers: {
        title: 'The Role of Teachers as Educators',
        description: 'Teachers must serve as role models through decent and professional physical appearance, respectful and professional relationships with students, fairness, discipline, mentorship, and guidance, and respect for diversity and equal treatment of learners. Students must equally respect teachers and school authorities through obedience, discipline, politeness, and tolerance.',
        dos: [
          'Be punctual and committed to duty.',
          'Dress decently and professionally.',
          'Encourage discipline, honesty, and hard work.',
          'Maintain professionalism and confidentiality.',
          'Treat students fairly and respectfully regardless of their background.'
        ],
        donts: [
          'Avoid inappropriate relationships with students.',
          'Avoid insults, humiliation, and violence.',
          'Avoid favoritism and corruption.',
          'Avoid discrimination based on religion, ethnicity, or gender.',
          'Avoid negligence of duties.'
        ]
      },
      parents: {
        title: 'The Role of Parents',
        description: 'Parents are expected to instill discipline and honesty at home, monitor the academic and moral behavior of children, collaborate with school authorities, and encourage hard work, tolerance, and responsibility.',
        dos: [
          'Attend school meetings regularly.',
          'Encourage discipline and academic excellence.',
          'Cooperate with teachers and administrators.',
          'Teach children respect, tolerance, and peaceful coexistence.'
        ],
        donts: [
          'Avoid defending indiscipline blindly.',
          'Avoid insulting teachers before children.',
          'Avoid neglecting the moral upbringing of children.',
          'Avoid encouraging dishonesty, intolerance, or examination malpractice.'
        ]
      },
      students: {
        title: 'The Role of Students',
        description: 'Students should respect school rules and regulations, avoid violence, examination malpractice, and immoral behavior, demonstrate discipline, honesty, responsibility, and tolerance, respect diversity and the beliefs of others, and protect school property and maintain cleanliness.',
        dos: [
          'Be punctual and respectful.',
          'Study hard and obey school rules.',
          'Dress decently according to regulations.',
          'Practice honesty, teamwork, and tolerance.',
          'Respect teachers, parents, and fellow students.'
        ],
        donts: [
          'Avoid drug abuse and violence.',
          'Avoid bullying, theft, cultism, and discrimination.',
          'Avoid disrespect and disobedience.',
          'Avoid destruction of school property.',
          'Avoid indecent dressing and immoral conduct.'
        ]
      },
      laicity: {
        title: 'Aspects of Laicity and Secularism',
        description: 'Laicity and secularism are important principles in the educational system of Cameroon. They promote neutrality, tolerance, equality, respect for diversity, and peaceful coexistence among individuals from different religious, cultural, and social backgrounds.',
        description2: 'Government Bilingual High School Ombessa must remain a neutral educational environment where all students and staff are treated equally regardless of religion, denomination, ethnicity, gender, or social status. Every learner has the right to freedom of conscience and belief provided such practices do not disrupt school discipline and the rights of others.',
        dos: [
          'Respect the religious beliefs of others.',
          'Promote tolerance, peace, and mutual understanding.',
          'Encourage equality and non-discrimination.',
          'Uphold the secular nature of the school environment.'
        ],
        donts: [
          'Avoid religious intolerance or discrimination.',
          'Avoid forcing personal beliefs on others.',
          'Avoid hate speech, stigmatization, or exclusion.',
          'Avoid actions capable of disrupting social harmony within the school.'
        ]
      },
      recommendations: {
        title: 'Recommendations',
        items: [
          'Regular moral and civic education seminars should be organized.',
          'Guidance and counseling services should be strengthened.',
          'Parents and teachers should maintain regular communication.',
          'Strict disciplinary measures should be applied fairly and transparently.',
          'Students demonstrating exemplary behavior should be rewarded.',
          'Anti-drug, anti-violence, and anti-discrimination sensitization campaigns should be intensified.',
          'Community leaders should support educational and disciplinary initiatives.'
        ]
      },
      disciplinary: {
        title: 'Disciplinary Measures',
        description: 'The following measures may be applied in cases of misconduct. All disciplinary actions must respect fairness, dignity, and educational principles.',
        items: [
          'Verbal warning and counseling.',
          'Written warning.',
          'Community service within the school.',
          'Suspension depending on the gravity of the offense.',
          'Parent-teacher disciplinary meetings.',
          'Referral to disciplinary councils where necessary.'
        ]
      },
      motto: 'Discipline, Integrity, and Excellence for a Better Future.',
      conclusion: 'The promotion of ethics, morality, laicity, and secularism in Government Bilingual High School Ombessa is a shared responsibility that demands commitment, collaboration, and consistency from all actors involved in education. A disciplined and morally upright school environment can only be achieved when stakeholders, teachers, parents, students, and the community work together towards the realization of common educational goals.',
      conclusion2: 'Through professionalism, integrity, tolerance, respect for diversity, discipline, and peaceful coexistence, the institution will continue to produce responsible, patriotic, disciplined, and competent citizens capable of contributing meaningfully to the development of Cameroon.',
      conclusion3: 'Together, let us uphold the principles of discipline, integrity, fairness, accountability, tolerance, and hard work for a better future.',
      theme: 'Theme 2026: "Digital Transformation and Artificial Intelligence for Inclusive Governance and Quality Teaching-Learning in a Healthy and Protective Environment"'
    },
    fr: {
      title: 'Guide Final sur l\'Éthique, les Valeurs Morales, la Laïcité et le Sécularisme au Lycée Bilingue d\'Ombessa',
      subtitle: 'Discipline, Intégrité et Excellence pour un Avenir Meilleur',
      introduction: {
        title: 'Introduction',
        text: 'L\'éthique et la morale constituent des piliers fondamentaux dans le développement de toute institution éducative et de toute société. Les écoles ne sont pas seulement des centres d\'apprentissage académique, mais également des institutions chargées de façonner le caractère, le comportement et les attitudes des apprenants.',
        text2: 'À cet effet, le Lycée Bilingue d\'Ombessa a la responsabilité de promouvoir des valeurs telles que la discipline, l\'intégrité, l\'honnêteté, le respect, la responsabilité, le patriotisme, la tolérance, la laïcité, le sécularisme et la coexistence pacifique parmi les élèves et tous les membres de la communauté éducative.',
        text3: 'Ce guide fournit un cadre pour la promotion de l\'éthique, de la morale, de la laïcité et du sécularisme au sein du Lycée Bilingue d\'Ombessa. Il définit les responsabilités, les attentes, les à faire et à ne pas faire de tous les acteurs impliqués dans le processus éducatif tout en mettant l\'accent sur la tolérance, l\'égalité, le respect de la diversité, la discipline et l\'excellence académique.'
      },
      objectives: {
        title: 'Objectifs',
        items: [
          'Instaurer la discipline et le sens des responsabilités chez les élèves.',
          'Promouvoir le respect de l\'autorité, du règlement intérieur et de la dignité humaine.',
          'Encourager l\'honnêteté et l\'intégrité académiques.',
          'Favoriser la coexistence pacifique entre tous les membres de la communauté scolaire.',
          'Promouvoir la tolérance, l\'égalité et le respect de la diversité religieuse et culturelle.',
          'Prévenir les fléaux sociaux tels que la violence, la corruption, la drogue, la discrimination et l\'immoralité.'
        ]
      },
      stakeholders: {
        title: 'Le Rôle des Parties Prenantes',
        description: 'Les parties prenantes doivent collaborer pour garantir la discipline morale et la bonne conduite au sein de l\'établissement.',
        dos: [
          'Promouvoir l\'intégrité, la transparence et la responsabilité.',
          'Encourager l\'équité et l\'égalité de traitement.',
          'Soutenir la discipline et l\'éducation morale.',
          'Promouvoir la tolérance, la paix et l\'unité nationale.',
          'Collaborer efficacement avec les autorités scolaires.'
        ],
        donts: [
          'Éviter la corruption et le favoritisme.',
          'Éviter toute ingérence affaiblissant la discipline.',
          'Éviter d\'encourager la fraude académique ou l\'indiscipline.',
          'Éviter toute discrimination religieuse ou ethnique.'
        ]
      },
      community: {
        title: 'Le Rôle de la Communauté d\'Ombessa',
        description: 'La communauté doit promouvoir la paix, protéger les élèves contre les influences négatives et soutenir les programmes éducatifs.',
        dos: [
          'Encourager les bons comportements chez les jeunes.',
          'Soutenir les initiatives éducatives et morales.',
          'Promouvoir la paix, l\'unité et le respect des valeurs culturelles.',
          'Contribuer à la sécurité autour de l\'école.'
        ],
        donts: [
          'Éviter d\'encourager la violence, la drogue ou la délinquance.',
          'Éviter d\'exposer les élèves à des activités immorales.',
          'Éviter les discriminations religieuses ou ethniques.',
          'Éviter d\'abriter des élèves pendant les heures de classe sans justification.'
        ]
      },
      teachers: {
        title: 'Le Rôle des Enseignants en tant qu\'Éducateurs',
        description: 'Les enseignants doivent servir de modèles à travers une apparence physique décente et professionnelle, des relations respectueuses et professionnelles avec les élèves, l\'équité, la discipline, l\'encadrement et l\'orientation, et le respect de la diversité et l\'égalité de traitement des apprenants.',
        dos: [
          'Être ponctuels et assidus.',
          'S\'habiller de manière décente et professionnelle.',
          'Encourager la discipline, l\'honnêteté et le travail.',
          'Maintenir le professionnalisme et la confidentialité.',
          'Traiter tous les élèves équitablement et avec respect.'
        ],
        donts: [
          'Éviter les relations inappropriées avec les élèves.',
          'Éviter les insultes, humiliations et violences.',
          'Éviter le favoritisme et la corruption.',
          'Éviter toute discrimination basée sur la religion, l\'ethnicité ou le genre.',
          'Éviter la négligence des devoirs.'
        ]
      },
      parents: {
        title: 'Le Rôle des Parents',
        description: 'Les parents doivent instaurer la discipline et l\'honnêteté à la maison, suivre le comportement moral et académique des enfants, collaborer avec les autorités scolaires et encourager le travail, la tolérance et la responsabilité.',
        dos: [
          'Participer régulièrement aux réunions scolaires.',
          'Encourager la discipline et l\'excellence académique.',
          'Coopérer avec les enseignants et l\'administration.',
          'Enseigner le respect et la tolérance aux enfants.'
        ],
        donts: [
          'Éviter de défendre aveuglément l\'indiscipline.',
          'Éviter d\'insulter les enseignants devant les enfants.',
          'Éviter la négligence dans l\'éducation morale des enfants.',
          'Éviter d\'encourager la malhonnêteté, l\'intolérance ou la fraude académique.'
        ]
      },
      students: {
        title: 'Le Rôle des Élèves',
        description: 'Les élèves doivent respecter le règlement intérieur, éviter la violence et les comportements immoraux, faire preuve de discipline, d\'honnêteté et de responsabilité, respecter la diversité et les croyances des autres, et protéger les biens scolaires et maintenir la propreté.',
        dos: [
          'Être ponctuels et respectueux.',
          'Étudier sérieusement et obéir aux règles.',
          'S\'habiller décemment selon les règlements.',
          'Pratiquer l\'honnêteté, le travail d\'équipe et la tolérance.',
          'Respecter les enseignants, les parents et les camarades.'
        ],
        donts: [
          'Éviter la drogue, la violence et le vol.',
          'Éviter l\'intimidation, le vol, le cultisme et la discrimination.',
          'Éviter le manque de respect et la désobéissance.',
          'Éviter la destruction des biens scolaires.',
          'Éviter les tenues indécentes et les comportements immoraux.'
        ]
      },
      laicity: {
        title: 'Aspects de la Laïcité et du Sécularisme',
        description: 'La laïcité et le sécularisme favorisent la neutralité, la tolérance, l\'égalité et la coexistence pacifique entre les individus de différentes religions et cultures.',
        description2: 'Le Lycée Bilingue d\'Ombessa doit rester un environnement éducatif neutre où tous les élèves et le personnel sont traités équitablement indépendamment de la religion, de la dénomination, de l\'ethnicité, du genre ou du statut social. Chaque apprenant a le droit à la liberté de conscience et de croyance, à condition que ces pratiques ne perturbent pas la discipline scolaire et les droits des autres.',
        dos: [
          'Respecter les croyances religieuses des autres.',
          'Promouvoir la tolérance, la paix et la compréhension mutuelle.',
          'Encourager l\'égalité et la non-discrimination.',
          'Maintenir le caractère laïc de l\'environnement scolaire.'
        ],
        donts: [
          'Éviter l\'intolérance religieuse ou la discrimination.',
          'Éviter d\'imposer ses croyances aux autres.',
          'Éviter les discours haineux, la stigmatisation ou l\'exclusion.',
          'Éviter les actions susceptibles de perturber l\'harmonie sociale au sein de l\'école.'
        ]
      },
      recommendations: {
        title: 'Recommandations',
        items: [
          'Organiser régulièrement des séminaires d\'éducation morale et civique.',
          'Renforcer les services d\'orientation et de conseil.',
          'Encourager une communication régulière entre parents et enseignants.',
          'Appliquer les mesures disciplinaires de manière juste et transparente.',
          'Récompenser les élèves exemplaires.',
          'Intensifier les campagnes de sensibilisation anti-drogue, anti-violence et anti-discrimination.',
          'Les leaders communautaires devraient soutenir les initiatives éducatives et disciplinaires.'
        ]
      },
      disciplinary: {
        title: 'Mesures Disciplinaires',
        description: 'Les mesures suivantes peuvent être appliquées en cas de faute. Toutes les actions disciplinaires doivent respecter l\'équité, la dignité et les principes éducatifs.',
        items: [
          'Avertissement verbal et conseils.',
          'Avertissement écrit.',
          'Travaux d\'intérêt général.',
          'Suspension selon la gravité de la faute.',
          'Réunions disciplinaires parents-enseignants.',
          'Référé aux conseils disciplinaires si nécessaire.'
        ]
      },
      motto: 'Discipline, Intégrité et Excellence pour un Avenir Meilleur.',
      conclusion: 'La promotion de l\'éthique, de la morale, de la laïcité et du sécularisme au Lycée Bilingue d\'Ombessa est une responsabilité collective exigeant l\'engagement, la collaboration et la cohérence de tous les acteurs impliqués dans l\'éducation.',
      conclusion2: 'Grâce au professionnalisme, à l\'intégrité, à la tolérance, au respect de la diversité, à la discipline et à la coexistence pacifique, l\'établissement continuera à former des citoyens responsables, patriotiques, disciplinés et compétents capables de contribuer de manière significative au développement du Cameroun.',
      conclusion3: 'Ensemble, respectons les principes de discipline, d\'intégrité, d\'équité, de responsabilité, de tolérance et de travail pour un meilleur avenir.',
      theme: 'Thème 2026 : « Transformation numérique et Intelligence Artificielle pour une gouvernance inclusive et des enseignements-apprentissages de qualité dans un environnement sain et protecteur »'
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {language === 'en' ? 'Ethics & Values' : 'Éthique & Valeurs'}
              </h1>
              <p className="text-lg text-blue-100">{t.subtitle}</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.introduction.title}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{t.introduction.text}</p>
            <p>{t.introduction.text2}</p>
            <p>{t.introduction.text3}</p>
          </div>
        </section>

        {/* Objectives */}
        <section className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.objectives.title}
          </h2>
          <ul className="space-y-3">
            {t.objectives.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stakeholders */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.stakeholders.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.stakeholders.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.stakeholders.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.stakeholders.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.community.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.community.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.community.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.community.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Teachers */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.teachers.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.teachers.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.teachers.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.teachers.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Parents */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.parents.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.parents.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.parents.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.parents.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Students */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.students.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.students.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.students.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.students.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Laicity and Secularism */}
        <section className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <ScaleIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.laicity.title}
          </h2>
          <div className="space-y-4 text-gray-700 mb-6">
            <p>{t.laicity.description}</p>
            <p>{t.laicity.description2}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">{language === 'en' ? 'Dos' : 'À faire'}</h3>
              <ul className="space-y-2">
                {t.laicity.dos.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-3">{language === 'en' ? 'Don\'ts' : 'À éviter'}</h3>
              <ul className="space-y-2">
                {t.laicity.donts.map((item, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.recommendations.title}
          </h2>
          <ul className="space-y-3">
            {t.recommendations.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Disciplinary Measures */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-blue-800 mr-3" />
            {t.disciplinary.title}
          </h2>
          <p className="text-gray-700 mb-6">{t.disciplinary.description}</p>
          <ul className="space-y-3">
            {t.disciplinary.items.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-800 mr-3">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Motto */}
        <section className="bg-gradient-to-r from-blue-800 to-amber-500 rounded-xl p-8 mb-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">{language === 'en' ? 'Motto' : 'Devise'}</h2>
          <p className="text-xl font-semibold italic">"{t.motto}"</p>
        </section>

        {/* Conclusion */}
        <section className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{language === 'en' ? 'Conclusion' : 'Conclusion'}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{t.conclusion}</p>
            <p>{t.conclusion2}</p>
            <p className="font-semibold text-blue-800">{t.conclusion3}</p>
          </div>
        </section>

        {/* Theme 2026 */}
        <section className="bg-gradient-to-r from-amber-50 to-blue-50 rounded-xl p-8 text-center">
          <p className="text-lg font-semibold text-gray-800">{t.theme}</p>
        </section>
      </div>
    </div>
  );
};

export default Ethics;
