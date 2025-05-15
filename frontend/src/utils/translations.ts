import { Language } from "@/contexts/LanguageContext";

export type TranslationKey = 
  // Navigation and common items
  | 'home' 
  | 'aiAssistant' 
  | 'findLawyers' 
  | 'documents' 
  | 'legalResources'
  | 'dashboard'
  | 'login'
  | 'signup'
  | 'profile'
  | 'adminDashboard'
  | 'logout'
  | 'analyzeDocument'
  | 'analyzing'
  | 'analyze'
  | 'documentSummary'
  | 'keyClauses'
  | 'importantTerms'
  | 'potentialRisks'
  
  // Dashboard widgets
  | 'recentDocuments'
  | 'upcomingConsultations'
  | 'legalAnalytics'
  | 'recommendedLawyers'
  | 'viewAll'
  | 'viewDetails'
  | 'seeMore'
  | 'noUpcomingConsultations'
  | 'scheduleConsultation'
  
  // Legal Documentation
  | 'categories'
  | 'allCategories'
  | 'filters'
  | 'subcategory'
  | 'allSubcategories'
  | 'experienceLevel'
  | 'allLevels'
  | 'resetFilters'
  | 'search'
  | 'searchDocuments'
  | 'showingResults'
  | 'for'
  | 'in'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'readMore'
  | 'backToDocumentation'
  | 'relatedTopics'
  | 'relatedArticles'
  | 'publishedOn'
  | 'views'
  
  // Chat Interface
  | 'askQuestion'
  | 'sendMessage'
  | 'typeMessage'
  | 'clearChat'
  | 'loading'
  | 'welcomeMessage'
  
  // Lawyer Marketplace
  | 'searchLawyers'
  | 'specialization'
  | 'location'
  | 'experience'
  | 'rating'
  | 'priceRange'
  | 'availability'
  | 'contactLawyer'
  | 'bookConsultation'
  | 'viewProfile'
  | 'reviews'
  | 'about'
  | 'expertise'
  | 'education'
  | 'languages'
  | 'consultationFee'
  
  // Document Management
  | 'myDocuments'
  | 'uploadDocument'
  | 'createDocument'
  | 'documentTemplates'
  | 'recentlyViewed'
  | 'shared'
  | 'drafts'
  | 'completed'
  | 'downloadDocument'
  | 'shareDocument'
  | 'deleteDocument'
  | 'documentName'
  | 'dateCreated'
  | 'dateModified'
  | 'status'
  | 'actions'
  
  // Authentication
  | 'welcomeBack'
  | 'emailAddress'
  | 'password'
  | 'forgotPassword'
  | 'dontHaveAccount'
  | 'createAccount'
  | 'alreadyHaveAccount'
  | 'fullName'
  | 'confirmPassword'
  | 'agreeToTerms'
  | 'termsAndConditions'
  | 'privacyPolicy'
  
  // Common UI elements
  | 'submit'
  | 'cancel'
  | 'save'
  | 'edit'
  | 'delete'
  | 'apply'
  | 'confirm'
  | 'back'
  | 'next'
  | 'continue'
  | 'loading'
  | 'success'
  | 'error'
  | 'warning'
  
  // Dynamic translation demo
  | 'dynamicTranslationDemo'
  | 'enterText'
  | 'automaticTranslation'
  | 'manualTranslation'
  | 'detectedLanguage'
  | 'clickTranslate'
  | 'detectLanguage'
  | 'manuallyTranslate'
  | 'translate'
  
  // Footer component
  | 'footer_about'
  | 'footer_resources'
  | 'footer_faq'
  | 'footer_glossary'
  | 'footer_contact'
  | 'footer_legal'
  | 'footer_privacy'
  | 'footer_terms'
  | 'footer_disclaimer'
  | 'footer_copyright'
  | 'footer_disclaimer_text'
  
  // Login Form
  | 'login_title'
  | 'login_description'
  | 'login_email'
  | 'login_emailPlaceholder'
  | 'login_password'
  | 'login_forgotPassword'
  | 'login_button'
  | 'login_signing'
  | 'login_noAccount'
  | 'login_success'
  | 'login_error'
  
  // Chat Interface
  | 'chat_title'
  | 'chat_tab'
  | 'chat_documents_tab'
  | 'chat_language'
  | 'chat_inputPlaceholder'
  | 'chat_disclaimer'
  | 'chat_welcomeMessage'
  | 'chat_documentsTitle'
  | 'chat_documentGenerate'
  | 'chat_documentDescription'
  | 'chat_voiceOn'
  | 'chat_voiceOff'
  ;

const translations: Record<TranslationKey, Record<Language, string>> = {
  // Navigation and common items
  home: {
    en: 'Home',
    hi: 'होम',
    hinglish: 'Home'
  },
  aiAssistant: {
    en: 'AI Assistant',
    hi: 'एआई सहायक',
    hinglish: 'AI Assistant'
  },
  findLawyers: {
    en: 'Find Lawyers',
    hi: 'वकील खोजें',
    hinglish: 'Vakil Search'
  },
  documents: {
    en: 'Documents',
    hi: 'दस्तावेज़',
    hinglish: 'Documents'
  },
  legalResources: {
    en: 'Legal Resources',
    hi: 'कानूनी संसाधन',
    hinglish: 'Legal Resources'
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    hinglish: 'Dashboard'
  },
  login: {
    en: 'Login',
    hi: 'लॉगिन',
    hinglish: 'Login'
  },
  signup: {
    en: 'Sign Up',
    hi: 'साइन अप',
    hinglish: 'Sign Up'
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफाइल',
    hinglish: 'Profile'
  },
  adminDashboard: {
    en: 'Admin Dashboard',
    hi: 'व्यवस्थापक डैशबोर्ड',
    hinglish: 'Admin Dashboard'
  },
  logout: {
    en: 'Log Out',
    hi: 'लॉग आउट',
    hinglish: 'Logout'
  },
  
  // Dashboard widgets
  recentDocuments: {
    en: 'Recent Documents',
    hi: 'हाल के दस्तावेज़',
    hinglish: 'Recent Documents'
  },
  upcomingConsultations: {
    en: 'Upcoming Consultations',
    hi: 'आगामी परामर्श',
    hinglish: 'Upcoming Consultations'
  },
  legalAnalytics: {
    en: 'Legal Analytics',
    hi: 'कानूनी विश्लेषण',
    hinglish: 'Legal Analytics'
  },
  recommendedLawyers: {
    en: 'Recommended Lawyers',
    hi: 'अनुशंसित वकील',
    hinglish: 'Recommended Vakils'
  },
  viewAll: {
    en: 'View All',
    hi: 'सभी देखें',
    hinglish: 'View All'
  },
  viewDetails: {
    en: 'View Details',
    hi: 'विवरण देखें',
    hinglish: 'Details Dekho'
  },
  seeMore: {
    en: 'See More',
    hi: 'और देखें',
    hinglish: 'Aur Dekho'
  },
  noUpcomingConsultations: {
    en: 'No upcoming consultations',
    hi: 'कोई आगामी परामर्श नहीं',
    hinglish: 'Koi upcoming consultation nahi hai'
  },
  scheduleConsultation: {
    en: 'Schedule Consultation',
    hi: 'परामर्श शेड्यूल करें',
    hinglish: 'Consultation Schedule Karo'
  },
  
  // Legal Documentation
  categories: {
    en: 'Categories',
    hi: 'श्रेणियाँ',
    hinglish: 'Categories'
  },
  allCategories: {
    en: 'All Categories',
    hi: 'सभी श्रेणियाँ',
    hinglish: 'All Categories'
  },
  filters: {
    en: 'Filters',
    hi: 'फिल्टर',
    hinglish: 'Filters'
  },
  subcategory: {
    en: 'Subcategory',
    hi: 'उपश्रेणी',
    hinglish: 'Subcategory'
  },
  allSubcategories: {
    en: 'All subcategories',
    hi: 'सभी उपश्रेणियाँ',
    hinglish: 'All subcategories'
  },
  experienceLevel: {
    en: 'Experience Level',
    hi: 'अनुभव स्तर',
    hinglish: 'Experience Level'
  },
  allLevels: {
    en: 'All levels',
    hi: 'सभी स्तर',
    hinglish: 'All levels'
  },
  resetFilters: {
    en: 'Reset Filters',
    hi: 'फिल्टर रीसेट करें',
    hinglish: 'Filters Reset Karo'
  },
  search: {
    en: 'Search',
    hi: 'खोज',
    hinglish: 'Search'
  },
  searchDocuments: {
    en: 'Search legal documents...',
    hi: 'कानूनी दस्तावेज़ खोजें...',
    hinglish: 'Legal documents search karo...'
  },
  showingResults: {
    en: 'Showing',
    hi: 'दिखा रहा है',
    hinglish: 'Showing'
  },
  for: {
    en: 'for',
    hi: 'के लिए',
    hinglish: 'for'
  },
  in: {
    en: 'in',
    hi: 'में',
    hinglish: 'mein'
  },
  beginner: {
    en: 'Beginner',
    hi: 'शुरुआती',
    hinglish: 'Beginner'
  },
  intermediate: {
    en: 'Intermediate',
    hi: 'मध्यवर्ती',
    hinglish: 'Intermediate'
  },
  advanced: {
    en: 'Advanced',
    hi: 'उन्नत',
    hinglish: 'Advanced'
  },
  readMore: {
    en: 'Read More',
    hi: 'और पढ़ें',
    hinglish: 'Aur Padho'
  },
  backToDocumentation: {
    en: 'Back to Documentation',
    hi: 'दस्तावेज़ीकरण पर वापस जाएं',
    hinglish: 'Documentation pe wapas jao'
  },
  relatedTopics: {
    en: 'Related Topics',
    hi: 'संबंधित विषय',
    hinglish: 'Related Topics'
  },
  relatedArticles: {
    en: 'Related Articles',
    hi: 'संबंधित लेख',
    hinglish: 'Related Articles'
  },
  publishedOn: {
    en: 'Published:',
    hi: 'प्रकाशित:',
    hinglish: 'Published:'
  },
  views: {
    en: 'views',
    hi: 'दृश्य',
    hinglish: 'views'
  },
  
  // Chat Interface
  askQuestion: {
    en: 'Ask a question',
    hi: 'एक प्रश्न पूछें',
    hinglish: 'Ek question pucho'
  },
  sendMessage: {
    en: 'Send',
    hi: 'भेजें',
    hinglish: 'Send'
  },
  typeMessage: {
    en: 'Type your message here...',
    hi: 'अपना संदेश यहां टाइप करें...',
    hinglish: 'Apna message yahan type karo...'
  },
  clearChat: {
    en: 'Clear Chat',
    hi: 'चैट साफ़ करें',
    hinglish: 'Chat Clear Karo'
  },
  loading: {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    hinglish: 'Loading...'
  },
  welcomeMessage: {
    en: 'Hello! How can I assist you with legal matters today?',
    hi: 'नमस्ते! आज मैं आपकी कानूनी मामलों में कैसे सहायता कर सकता हूं?',
    hinglish: 'Hello! Aaj main aapki legal matters mein kaise help kar sakta hoon?'
  },
  
  // Lawyer Marketplace
  searchLawyers: {
    en: 'Search lawyers...',
    hi: 'वकीलों को खोजें...',
    hinglish: 'Lawyers search karo...'
  },
  specialization: {
    en: 'Specialization',
    hi: 'विशेषज्ञता',
    hinglish: 'Specialization'
  },
  location: {
    en: 'Location',
    hi: 'स्थान',
    hinglish: 'Location'
  },
  experience: {
    en: 'Experience',
    hi: 'अनुभव',
    hinglish: 'Experience'
  },
  rating: {
    en: 'Rating',
    hi: 'रेटिंग',
    hinglish: 'Rating'
  },
  priceRange: {
    en: 'Price Range',
    hi: 'मूल्य श्रेणी',
    hinglish: 'Price Range'
  },
  availability: {
    en: 'Availability',
    hi: 'उपलब्धता',
    hinglish: 'Availability'
  },
  contactLawyer: {
    en: 'Contact Lawyer',
    hi: 'वकील से संपर्क करें',
    hinglish: 'Lawyer se contact karo'
  },
  bookConsultation: {
    en: 'Book Consultation',
    hi: 'परामर्श बुक करें',
    hinglish: 'Consultation Book Karo'
  },
  viewProfile: {
    en: 'View Profile',
    hi: 'प्रोफ़ाइल देखें',
    hinglish: 'Profile Dekho'
  },
  reviews: {
    en: 'Reviews',
    hi: 'समीक्षाएं',
    hinglish: 'Reviews'
  },
  about: {
    en: 'About',
    hi: 'परिचय',
    hinglish: 'About'
  },
  expertise: {
    en: 'Expertise',
    hi: 'विशेषज्ञता',
    hinglish: 'Expertise'
  },
  education: {
    en: 'Education',
    hi: 'शिक्षा',
    hinglish: 'Education'
  },
  languages: {
    en: 'Languages',
    hi: 'भाषाएँ',
    hinglish: 'Languages'
  },
  consultationFee: {
    en: 'Consultation Fee',
    hi: 'परामर्श शुल्क',
    hinglish: 'Consultation Fee'
  },
  
  // Document Management
  myDocuments: {
    en: 'My Documents',
    hi: 'मेरे दस्तावेज़',
    hinglish: 'Mere Documents'
  },
  uploadDocument: {
    en: 'Upload Document',
    hi: 'दस्तावेज़ अपलोड करें',
    hinglish: 'Document Upload Karo'
  },
  createDocument: {
    en: 'Create Document',
    hi: 'दस्तावेज़ बनाएं',
    hinglish: 'Document Create Karo'
  },
  documentTemplates: {
    en: 'Document Templates',
    hi: 'दस्तावेज़ टेम्पलेट',
    hinglish: 'Document Templates'
  },
  recentlyViewed: {
    en: 'Recently Viewed',
    hi: 'हाल ही में देखा गया',
    hinglish: 'Recently Viewed'
  },
  shared: {
    en: 'Shared',
    hi: 'साझा किया गया',
    hinglish: 'Shared'
  },
  drafts: {
    en: 'Drafts',
    hi: 'ड्राफ्ट',
    hinglish: 'Drafts'
  },
  completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    hinglish: 'Completed'
  },
  downloadDocument: {
    en: 'Download',
    hi: 'डाउनलोड',
    hinglish: 'Download'
  },
  shareDocument: {
    en: 'Share',
    hi: 'साझा करें',
    hinglish: 'Share'
  },
  deleteDocument: {
    en: 'Delete',
    hi: 'हटाएं',
    hinglish: 'Delete'
  },
  documentName: {
    en: 'Document Name',
    hi: 'दस्तावेज़ का नाम',
    hinglish: 'Document Name'
  },
  dateCreated: {
    en: 'Date Created',
    hi: 'बनाने की तिथि',
    hinglish: 'Creation Date'
  },
  dateModified: {
    en: 'Date Modified',
    hi: 'संशोधन की तिथि',
    hinglish: 'Modification Date'
  },
  status: {
    en: 'Status',
    hi: 'स्थिति',
    hinglish: 'Status'
  },
  actions: {
    en: 'Actions',
    hi: 'कार्रवाई',
    hinglish: 'Actions'
  },
  
  // Authentication
  welcomeBack: {
    en: 'Welcome Back',
    hi: 'वापसी पर स्वागत है',
    hinglish: 'Welcome Back'
  },
  emailAddress: {
    en: 'Email Address',
    hi: 'ईमेल पता',
    hinglish: 'Email Address'
  },
  password: {
    en: 'Password',
    hi: 'पासवर्ड',
    hinglish: 'Password'
  },
  forgotPassword: {
    en: 'Forgot Password?',
    hi: 'पासवर्ड भूल गए?',
    hinglish: 'Password bhool gaye?'
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    hi: 'खाता नहीं है?',
    hinglish: 'Account nahi hai?'
  },
  createAccount: {
    en: 'Create Account',
    hi: 'खाता बनाएं',
    hinglish: 'Account Create Karo'
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    hi: 'पहले से ही खाता है?',
    hinglish: 'Pehle se account hai?'
  },
  fullName: {
    en: 'Full Name',
    hi: 'पूरा नाम',
    hinglish: 'Full Name'
  },
  confirmPassword: {
    en: 'Confirm Password',
    hi: 'पासवर्ड की पुष्टि करें',
    hinglish: 'Password Confirm Karo'
  },
  agreeToTerms: {
    en: 'I agree to the',
    hi: 'मैं सहमत हूं',
    hinglish: 'Main agree karta hoon'
  },
  termsAndConditions: {
    en: 'Terms and Conditions',
    hi: 'नियम और शर्तें',
    hinglish: 'Terms and Conditions'
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
    hinglish: 'Privacy Policy'
  },
  
  // Common UI elements
  submit: {
    en: 'Submit',
    hi: 'जमा करें',
    hinglish: 'Submit'
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    hinglish: 'Cancel'
  },
  save: {
    en: 'Save',
    hi: 'सहेजें',
    hinglish: 'Save'
  },
  edit: {
    en: 'Edit',
    hi: 'संपादित करें',
    hinglish: 'Edit'
  },
  delete: {
    en: 'Delete',
    hi: 'हटाएं',
    hinglish: 'Delete'
  },
  apply: {
    en: 'Apply',
    hi: 'लागू करें',
    hinglish: 'Apply'
  },
  confirm: {
    en: 'Confirm',
    hi: 'पुष्टि करें',
    hinglish: 'Confirm'
  },
  back: {
    en: 'Back',
    hi: 'वापस',
    hinglish: 'Back'
  },
  next: {
    en: 'Next',
    hi: 'अगला',
    hinglish: 'Next'
  },
  continue: {
    en: 'Continue',
    hi: 'जारी रखें',
    hinglish: 'Continue'
  },
  success: {
    en: 'Success',
    hi: 'सफलता',
    hinglish: 'Success'
  },
  error: {
    en: 'Error',
    hi: 'त्रुटि',
    hinglish: 'Error'
  },
  warning: {
    en: 'Warning',
    hi: 'चेतावनी',
    hinglish: 'Warning'
  },
  
  // Dynamic translation demo
  dynamicTranslationDemo: {
    en: 'Dynamic Translation Demo',
    hi: 'गतिशील अनुवाद डेमो',
    hinglish: 'Dynamic Translation Demo'
  },
  enterText: {
    en: 'Enter text to translate:',
    hi: 'अनुवाद करने के लिए टेक्स्ट दर्ज करें:',
    hinglish: 'Translate karne ke liye text enter karo:'
  },
  automaticTranslation: {
    en: 'Automatic Translation:',
    hi: 'स्वचालित अनुवाद:',
    hinglish: 'Automatic Translation:'
  },
  manualTranslation: {
    en: 'Manual Translation:',
    hi: 'मैनुअल अनुवाद:',
    hinglish: 'Manual Translation:'
  },
  detectedLanguage: {
    en: 'Detected Language:',
    hi: 'पहचानी गई भाषा:',
    hinglish: 'Detected Language:'
  },
  clickTranslate: {
    en: 'Click translate to see this text translated',
    hi: 'इस पाठ का अनुवाद देखने के लिए अनुवाद पर क्लिक करें',
    hinglish: 'Text translate karne ke liye translate button click karo'
  },
  detectLanguage: {
    en: 'Detect Language',
    hi: 'भाषा का पता लगाएं',
    hinglish: 'Language Detect Karo'
  },
  manuallyTranslate: {
    en: 'Manually Translate',
    hi: 'स्वयं अनुवाद करें',
    hinglish: 'Manual Translate'
  },
  translate: {
    en: 'Translate',
    hi: 'अनुवाद करें',
    hinglish: 'Translate Karo'
  },
  
  // Footer component
  footer_about: {
    en: 'About Us',
    hi: 'हमारे बारे में',
    hinglish: 'Hamare Bare Mein'
  },
  footer_resources: {
    en: 'Resources',
    hi: 'संसाधन',
    hinglish: 'Resources'
  },
  footer_faq: {
    en: 'FAQ',
    hi: 'पूछे जाने वाले प्रश्न',
    hinglish: 'FAQ'
  },
  footer_glossary: {
    en: 'Legal Glossary',
    hi: 'कानूनी शब्दावली',
    hinglish: 'Legal Glossary'
  },
  footer_contact: {
    en: 'Contact Us',
    hi: 'संपर्क करें',
    hinglish: 'Contact Karein'
  },
  footer_legal: {
    en: 'Legal',
    hi: 'कानूनी',
    hinglish: 'Legal'
  },
  footer_privacy: {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
    hinglish: 'Privacy Policy'
  },
  footer_terms: {
    en: 'Terms of Service',
    hi: 'सेवा की शर्तें',
    hinglish: 'Terms of Service'
  },
  footer_disclaimer: {
    en: 'Legal Disclaimer',
    hi: 'कानूनी अस्वीकरण',
    hinglish: 'Legal Disclaimer'
  },
  footer_copyright: {
    en: '© {0} LawXpert. All rights reserved.',
    hi: '© {0} लॉएक्सपर्ट. सर्वाधिकार सुरक्षित.',
    hinglish: '© {0} LawXpert. All rights reserved.'
  },
  footer_disclaimer_text: {
    en: 'LawXpert is not a law firm and does not provide legal advice. The information provided is for general informational purposes only.',
    hi: 'लॉएक्सपर्ट एक कानूनी फर्म नहीं है और कानूनी सलाह प्रदान नहीं करता है। प्रदान की गई जानकारी केवल सामान्य सूचनात्मक उद्देश्यों के लिए है।',
    hinglish: 'LawXpert ek law firm nahi hai aur legal advice nahi deta hai. Information sirf general jankaari ke liye di gayi hai.'
  },
  
  // Login Form
  login_title: {
    en: 'Login to LawXpert',
    hi: 'लॉएक्सपर्ट में लॉगिन करें',
    hinglish: 'LawXpert mein Login karein'
  },
  login_description: {
    en: 'Enter your email and password to access your account',
    hi: 'अपने खाते तक पहुंचने के लिए अपना ईमेल और पासवर्ड दर्ज करें',
    hinglish: 'Apne account tak pahunchne ke liye email aur password darj karein'
  },
  login_email: {
    en: 'Email',
    hi: 'ईमेल',
    hinglish: 'Email'
  },
  login_emailPlaceholder: {
    en: 'name@example.com',
    hi: 'नाम@उदाहरण.कॉम',
    hinglish: 'name@example.com'
  },
  login_password: {
    en: 'Password',
    hi: 'पासवर्ड',
    hinglish: 'Password'
  },
  login_forgotPassword: {
    en: 'Forgot password?',
    hi: 'पासवर्ड भूल गए?',
    hinglish: 'Password bhool gaye?'
  },
  login_button: {
    en: 'Sign In',
    hi: 'साइन इन करें',
    hinglish: 'Sign In karein'
  },
  login_signing: {
    en: 'Signing In...',
    hi: 'साइन इन हो रहा है...',
    hinglish: 'Sign In ho raha hai...'
  },
  login_noAccount: {
    en: 'Don\'t have an account? Sign up',
    hi: 'खाता नहीं है? साइन अप करें',
    hinglish: 'Account nahi hai? Sign up karein'
  },
  login_success: {
    en: 'Login successful',
    hi: 'लॉगिन सफल रहा',
    hinglish: 'Login successful'
  },
  login_error: {
    en: 'Login failed. Please try again.',
    hi: 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।',
    hinglish: 'Login fail ho gaya. Phir se try karein.'
  },
  
  // Chat Interface
  chat_title: {
    en: 'LawXpert AI Assistant',
    hi: 'लॉएक्सपर्ट AI सहायक',
    hinglish: 'LawXpert AI Assistant'
  },
  chat_tab: {
    en: 'Chat',
    hi: 'चैट',
    hinglish: 'Chat'
  },
  chat_documents_tab: {
    en: 'Documents',
    hi: 'दस्तावेज़',
    hinglish: 'Documents'
  },
  chat_language: {
    en: 'Language',
    hi: 'भाषा',
    hinglish: 'Language'
  },
  chat_inputPlaceholder: {
    en: 'Ask a legal question...',
    hi: 'कोई कानूनी प्रश्न पूछें...',
    hinglish: 'Koi legal question puchein...'
  },
  chat_disclaimer: {
    en: 'This is not a substitute for professional legal advice. Consult a lawyer for legal matters.',
    hi: 'यह पेशेवर कानूनी सलाह का विकल्प नहीं है। कानूनी मामलों के लिए वकील से परामर्श करें।',
    hinglish: 'Yeh professional legal advice ka substitute nahi hai. Legal matters ke liye lawyer se consult karein.'
  },
  chat_welcomeMessage: {
    en: 'Hello! I\'m your LawXpert legal assistant. How can I help you with your legal queries today?',
    hi: 'नमस्ते! मैं आपका लॉएक्सपर्ट कानूनी सहायक हूँ। आज मैं आपके कानूनी प्रश्नों में कैसे मदद कर सकता हूँ?',
    hinglish: 'Hello! Main aapka LawXpert legal assistant hoon. Aaj main aapke legal questions mein kaise help kar sakta hoon?'
  },
  chat_documentsTitle: {
    en: 'Generate Legal Documents',
    hi: 'कानूनी दस्तावेज़ तैयार करें',
    hinglish: 'Legal Documents Generate karein'
  },
  chat_documentGenerate: {
    en: 'Fill a form to generate a document',
    hi: 'दस्तावेज़ तैयार करने के लिए एक फॉर्म भरें',
    hinglish: 'Document generate karne ke liye form bharein'
  },
  chat_documentDescription: {
    en: 'Fill a form to generate a document',
    hi: 'दस्तावेज़ तैयार करने के लिए एक फॉर्म भरें',
    hinglish: 'Document generate karne ke liye form bharein'
  },
  chat_voiceOn: {
    en: 'Voice input would be enabled in the final app',
    hi: 'अंतिम ऐप में वॉयस इनपुट सक्षम किया जाएगा',
    hinglish: 'Final app mein voice input enable kiya jayega'
  },
  chat_voiceOff: {
    en: 'Voice input stopped',
    hi: 'वॉयस इनपुट बंद किया गया',
    hinglish: 'Voice input band kiya gaya'
  },
  
  analyzeDocument: {
    en: 'Analyze Legal Document',
    hi: 'कानूनी दस्तावेज़ का विश्लेषण',
    hinglish: 'Legal Document ka Analysis'
  },
  analyzing: {
    en: 'Analyzing...',
    hi: 'विश्लेषण हो रहा है...',
    hinglish: 'Analysis ho raha hai...'
  },
  analyze: {
    en: 'Analyze',
    hi: 'विश्लेषण करें',
    hinglish: 'Analysis Karo'
  },
  documentSummary: {
    en: 'Document Summary',
    hi: 'दस्तावेज़ सारांश',
    hinglish: 'Document Summary'
  },
  keyClauses: {
    en: 'Key Clauses',
    hi: 'मुख्य खंड',
    hinglish: 'Key Clauses'
  },
  importantTerms: {
    en: 'Important Terms',
    hi: 'महत्वपूर्ण शर्तें',
    hinglish: 'Important Terms'
  },
  potentialRisks: {
    en: 'Potential Risks',
    hi: 'संभावित जोखिम',
    hinglish: 'Potential Risks'
  },
};

export const translate = (key: TranslationKey, language: Language): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translations[key][language] || translations[key]['en'];
};

export default translate; 