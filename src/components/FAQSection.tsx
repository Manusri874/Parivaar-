import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Search, Shield, Users, Clock, FileText, Smartphone, CreditCard, Send, Bot, X, Minimize2, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    question: "Who can use Pariwar+?",
    answer: "Pariwar+ is designed for families of all sizes. The account head (usually a parent or guardian) can create an account and add family members including children, elderly parents, and spouses. Each member gets appropriate access based on their role.",
    icon: Users,
    category: "General",
    color: "from-blue-500 to-blue-600"
  },
  {
    question: "Is my family's health data secure and private?",
    answer: "Absolutely! We use enterprise-grade encryption to protect your data. All information is stored securely and only accessible by authorized family members. We comply with healthcare privacy standards and never share your data with third parties.",
    icon: Shield,
    category: "Security",
    color: "from-green-500 to-green-600"
  },
  {
    question: "Can I use this to manage my elderly parents' health remotely?",
    answer: "Yes! Pariwar+ is perfect for caring for elderly family members remotely. You can set up their profiles, manage their medicine reminders, upload their medical documents, and generate emergency cards that they can carry.",
    icon: Users,
    category: "Family Care",
    color: "from-purple-500 to-purple-600"
  },
  {
    question: "How do the medicine reminders work?",
    answer: "You can set up customized reminders for each family member with specific times, dosages, and frequencies. Reminders can be sent via email, SMS, or through the app. You can also mark medicines as taken and track compliance.",
    icon: Clock,
    category: "Features",
    color: "from-orange-500 to-orange-600"
  },
  {
    question: "What types of medical documents can I upload?",
    answer: "You can upload prescriptions, lab reports, X-rays, MRI scans, vaccination records, insurance cards, and any other medical documents in PDF, JPG, or PNG format. All documents are automatically organized by date and type.",
    icon: FileText,
    category: "Features",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    question: "How does the emergency QR card work?",
    answer: "The emergency QR card contains critical health information like allergies, current medications, emergency contacts, and medical conditions. In an emergency, medical professionals can scan the QR code to quickly access this vital information.",
    icon: Shield,
    category: "Features",
    color: "from-red-500 to-red-600"
  },
  {
    question: "Is there a mobile app available?",
    answer: "Currently, Pariwar+ is available as a responsive web application that works perfectly on all devices including smartphones and tablets. A dedicated mobile app is in development and will be available soon.",
    icon: Smartphone,
    category: "Features",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    question: "How much does Pariwar+ cost?",
    answer: "We offer a free tier for basic family health management. Premium plans with advanced features like unlimited document storage, SMS reminders, and priority support start at just ₹299 per month for unlimited family members.",
    icon: CreditCard,
    category: "Pricing",
    color: "from-emerald-500 to-emerald-600"
  }
];

const categories = ["All", "General", "Security", "Family Care", "Features", "Technical", "Pricing"];

// Enhanced chatbot knowledge base
const chatbotKnowledge = {
  greetings: [
    "Hello! I'm your Pariwar+ AI assistant. How can I help you today?",
    "Hi there! Welcome to Pariwar+. I'm here to answer all your questions about family health management.",
    "Greetings! I'm your health buddy. What would you like to know about Pariwar+?",
    "Welcome to Pariwar+! I'm your AI health assistant, ready to help with any questions about family health management."
  ],
  features: [
    "Pariwar+ offers comprehensive family health management including document storage, medication reminders, emergency health cards, and medical timeline tracking.",
    "Our key features include AI-powered document organization, smart medication reminders, emergency health cards with QR codes, and collaborative family health management.",
    "Pariwar+ provides document management, medication tracking, emergency preparedness, health timeline, and family collaboration tools.",
    "Transform your family's health management with AI-powered organization, smart reminders, emergency cards, and comprehensive health tracking."
  ],
  pricing: [
    "Pariwar+ offers a free tier with basic features and premium plans starting at ₹299/month for advanced features and unlimited storage.",
    "We have a generous free plan and premium options starting at ₹299/month. All plans include family health management and emergency features.",
    "Start free with basic features, or upgrade to premium from ₹299/month for unlimited storage and advanced health analytics.",
    "Free forever plan available! Premium plans start at ₹299/month with unlimited storage, advanced analytics, and priority support."
  ],
  security: [
    "Your family's health data is protected with enterprise-grade encryption. We comply with healthcare privacy standards and never share data with third parties.",
    "Security is our top priority. We use military-grade encryption and follow strict healthcare privacy protocols to keep your family's health information safe.",
    "Bank-level security with end-to-end encryption, HIPAA compliance, and regular security audits to protect your family's sensitive health data.",
    "Your privacy is sacred. We use the same security standards as major banks and healthcare institutions to protect your family's health information."
  ],
  family: [
    "Pariwar+ is designed for families of all sizes. You can add unlimited family members, manage their health records, and coordinate care together.",
    "Perfect for families! Add parents, children, grandparents, and other family members. Everyone can have their own health profile with shared access.",
    "Family-focused design allows you to manage everyone's health in one place, from children to elderly parents, with appropriate privacy controls.",
    "Create a complete family health ecosystem. Add unlimited members, manage individual profiles, and coordinate care across generations."
  ],
  documents: [
    "Upload and organize medical documents like prescriptions, lab reports, bills, and more. Our AI helps categorize and search through your documents.",
    "Store all medical documents securely. We support PDFs, images, and other formats. AI-powered organization makes finding documents easy.",
    "Document management includes automatic categorization, search functionality, and secure cloud storage for all your family's medical records.",
    "Never lose a medical document again! AI-powered organization, smart search, and secure storage for all your family's health records."
  ],
  reminders: [
    "Set medication reminders for any family member with customizable schedules, dosage tracking, and compliance monitoring.",
    "Smart reminder system includes medication alerts, appointment reminders, and health check notifications with flexible timing options.",
    "Never miss a dose! Set up medication reminders with specific times, frequencies, and tracking for each family member.",
    "Smart medication management with customizable reminders, dosage tracking, and compliance monitoring for better health outcomes."
  ],
  emergency: [
    "Emergency health cards contain vital information like blood type, allergies, and emergency contacts. QR codes provide instant access in emergencies.",
    "Quick access emergency cards with QR codes show critical health information to medical professionals when every second counts.",
    "Emergency preparedness includes digital health cards with QR codes, emergency contacts, and vital health information for instant access.",
    "Be prepared for emergencies with digital health cards featuring QR codes, critical medical information, and instant access for healthcare providers."
  ],
  mobile: [
    "Pariwar+ works perfectly on all devices - smartphones, tablets, and computers. Our responsive design ensures great experience everywhere.",
    "Access your family's health information anywhere! Our mobile-friendly platform works on iOS, Android, and all web browsers.",
    "Fully responsive platform works on all devices. Access health records, set reminders, and manage family health on the go.",
    "Your family's health information in your pocket! Works seamlessly on all devices with offline access to emergency information."
  ],
  support: [
    "We provide round-the-clock support to ensure you never feel alone in managing your family's health. Our team is always ready to help!",
    "24/7 customer support available through chat, email, and phone. We're here to help you make the most of Pariwar+.",
    "Never feel alone in your health journey. Our dedicated support team is available 24/7 to assist you with any questions or concerns.",
    "Comprehensive support including live chat, email support, and detailed help guides to ensure you get the most from Pariwar+."
  ],
  technology: [
    "Built with modern React/TypeScript technology, using Supabase for secure database and storage, with real-time capabilities and AI-powered features.",
    "Cutting-edge technology stack including React 18, TypeScript, Supabase PostgreSQL, real-time subscriptions, and AI document organization.",
    "Modern web technologies ensure fast, secure, and reliable performance with real-time updates and AI-powered intelligence.",
    "State-of-the-art technology with React, TypeScript, and Supabase providing a secure, scalable, and intelligent health management platform."
  ],
  dataManagement: [
    "All your health data is automatically organized by date, type, and family member. Our AI helps categorize documents and provides smart search capabilities.",
    "Intelligent data organization with automatic categorization, smart search, and easy retrieval by date, document type, or family member.",
    "AI-powered data management automatically organizes your health information and provides instant search across all family members.",
    "Smart data organization with automatic categorization, intelligent search, and easy access to all your family's health information."
  ],
  accessibility: [
    "Pariwar+ is designed to be accessible to everyone, including elderly users. We have large fonts, simple navigation, and voice-friendly interfaces.",
    "Accessibility is key - our platform works on all devices, has intuitive navigation, and is designed for users of all technical levels.",
    "User-friendly design with large fonts, simple navigation, and accessibility features for users of all ages and technical abilities.",
    "Inclusive design ensures Pariwar+ is accessible to everyone, from tech-savvy users to elderly family members."
  ],
  compliance: [
    "We comply with all major healthcare privacy standards including HIPAA guidelines, ensuring your family's health information is protected according to industry best practices.",
    "Pariwar+ follows strict healthcare compliance standards and undergoes regular security audits to maintain the highest level of data protection.",
    "Healthcare compliance certified with regular audits, HIPAA adherence, and industry-standard security protocols.",
    "Full compliance with healthcare privacy standards including HIPAA, with regular security audits and industry best practices."
  ],
  integration: [
    "Currently, Pariwar+ works as a standalone platform. We're developing integrations with popular health apps and wearable devices for seamless data sync.",
    "While we're a standalone platform now, we're actively working on integrations with health apps, wearables, and medical devices for better connectivity.",
    "Standalone platform with future integrations planned for health apps, wearables, and medical devices to create a connected health ecosystem.",
    "Independent platform today, with exciting integrations coming soon for wearables, health apps, and medical devices."
  ],
  backup: [
    "Your data is automatically backed up in real-time with multiple redundancy layers. We also provide export options so you can keep local copies of your health records.",
    "Data backup is automatic and continuous. We use enterprise-grade cloud storage with multiple backup locations to ensure your data is never lost.",
    "Automatic real-time backup with multiple redundancy layers and export options to ensure your family's health data is always safe.",
    "Enterprise-grade backup with real-time synchronization, multiple redundancy, and export capabilities for complete data protection."
  ],
  customization: [
    "Pariwar+ is highly customizable. You can set up personalized health goals, customize reminder schedules, and tailor the interface to your family's needs.",
    "Customization options include personalized health goals, custom reminder schedules, family member profiles, and flexible notification preferences.",
    "Personalize your health management with custom goals, flexible reminders, and tailored interfaces for your family's unique needs.",
    "Flexible customization with personalized health goals, custom schedules, and adaptable interfaces to match your family's lifestyle."
  ],
  analytics: [
    "Our health analytics provide insights into medication adherence, health trends, and family wellness patterns. You get visual charts and progress tracking.",
    "Health analytics include medication compliance tracking, health trend analysis, wellness scores, and personalized health insights for your family.",
    "Comprehensive health analytics with medication adherence tracking, trend analysis, and personalized insights for better family wellness.",
    "Smart analytics provide insights into medication compliance, health trends, and family wellness patterns with visual progress tracking."
  ],
  collaboration: [
    "Family members can collaborate on health management. Parents can monitor children's health, and caregivers can coordinate elderly care with real-time updates.",
    "Collaboration features allow family members to share health updates, coordinate care, and stay informed about each other's wellness journey.",
    "Family collaboration tools enable shared health management, care coordination, and real-time updates across all family members.",
    "Seamless family collaboration with shared health management, care coordination, and real-time updates for better family wellness."
  ],
  notifications: [
    "Notifications are customizable and include medicine reminders, appointment alerts, health check reminders, and important health updates.",
    "Our notification system covers medicine reminders, appointment alerts, health check reminders, and can be customized for each family member's preferences.",
    "Smart notifications with customizable medicine reminders, appointment alerts, and health check notifications for each family member.",
    "Flexible notification system with medicine reminders, appointment alerts, and customizable health notifications for your family."
  ],
  storage: [
    "Free tier includes 1GB storage, premium plans offer unlimited storage for all your medical documents, images, and health records.",
    "Storage starts at 1GB for free users and goes unlimited with premium plans, ensuring you never run out of space for important health documents.",
    "Generous storage with 1GB free and unlimited storage on premium plans for all your family's medical documents and health records.",
    "Ample storage space with 1GB free tier and unlimited storage on premium plans for comprehensive health record management."
  ],
  updates: [
    "Pariwar+ receives regular updates with new features, security improvements, and performance enhancements. All updates are automatic and free.",
    "We regularly update the platform with new features, security improvements, and performance enhancements. Updates are automatic and included in all plans.",
    "Continuous platform updates with new features, security enhancements, and performance improvements, all automatic and free.",
    "Regular platform updates with new features, security improvements, and performance enhancements, automatically delivered to all users."
  ],
  training: [
    "We provide comprehensive onboarding guides, video tutorials, and live training sessions to help you get started with Pariwar+.",
    "Training resources include step-by-step guides, video tutorials, live webinars, and dedicated support to ensure you get the most out of Pariwar+.",
    "Complete training resources with onboarding guides, video tutorials, and live sessions to help you master Pariwar+ quickly.",
    "Comprehensive training with guides, tutorials, and live sessions to ensure you and your family get the most from Pariwar+."
  ],
  comparison: [
    "Pariwar+ stands out with its family-focused approach, AI-powered organization, emergency health cards, and comprehensive health management features.",
    "Unlike other health apps, Pariwar+ is specifically designed for families, offering comprehensive health management with AI assistance and emergency preparedness.",
    "Unique family-focused platform with AI-powered organization, emergency preparedness, and comprehensive health management unlike any other app.",
    "Distinctive family health platform with AI intelligence, emergency features, and comprehensive management designed specifically for families."
  ],
  future: [
    "We're constantly developing new features including AI health insights, wearable device integration, telemedicine integration, and advanced analytics.",
    "Future plans include AI-powered health insights, wearable device integration, telemedicine features, and advanced health analytics for better family wellness.",
    "Exciting roadmap with AI health insights, wearable integration, telemedicine features, and advanced analytics for enhanced family wellness.",
    "Innovative future plans including AI insights, wearable integration, telemedicine, and advanced analytics for comprehensive family health management."
  ],
  default: [
    "I'm not sure about that specific question, but I'd be happy to help you with general information about Pariwar+. Could you rephrase your question?",
    "That's an interesting question! While I don't have specific information about that, I can help you with general Pariwar+ features and functionality.",
    "I'm still learning about that topic. Let me help you with something else about Pariwar+ or connect you with our support team.",
    "Great question! Let me help you with something else about Pariwar+ or connect you with our support team for more specific assistance."
  ]
};

// Enhanced chatbot response logic
const getChatbotResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
    return getRandomResponse(chatbotKnowledge.greetings);
  }
  
  // Features and capabilities
  if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capability') || lowerMessage.includes('what does') || lowerMessage.includes('how does') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
    return getRandomResponse(chatbotKnowledge.features);
  }
  
  // Pricing and costs
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan') || lowerMessage.includes('₹') || lowerMessage.includes('free') || lowerMessage.includes('premium') || lowerMessage.includes('subscription') || lowerMessage.includes('billing')) {
    return getRandomResponse(chatbotKnowledge.pricing);
  }
  
  // Security and privacy
  if (lowerMessage.includes('secure') || lowerMessage.includes('privacy') || lowerMessage.includes('encryption') || lowerMessage.includes('safe') || lowerMessage.includes('protect') || lowerMessage.includes('hack') || lowerMessage.includes('breach') || lowerMessage.includes('confidential')) {
    return getRandomResponse(chatbotKnowledge.security);
  }
  
  // Family management
  if (lowerMessage.includes('family') || lowerMessage.includes('member') || lowerMessage.includes('elderly') || lowerMessage.includes('children') || lowerMessage.includes('parent') || lowerMessage.includes('spouse') || lowerMessage.includes('relative') || lowerMessage.includes('caregiver')) {
    return getRandomResponse(chatbotKnowledge.family);
  }
  
  // Document management
  if (lowerMessage.includes('document') || lowerMessage.includes('upload') || lowerMessage.includes('file') || lowerMessage.includes('report') || lowerMessage.includes('prescription') || lowerMessage.includes('lab') || lowerMessage.includes('x-ray') || lowerMessage.includes('mri') || lowerMessage.includes('scan')) {
    return getRandomResponse(chatbotKnowledge.documents);
  }
  
  // Medicine reminders
  if (lowerMessage.includes('reminder') || lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('alert') || lowerMessage.includes('pill') || lowerMessage.includes('dosage') || lowerMessage.includes('schedule') || lowerMessage.includes('compliance')) {
    return getRandomResponse(chatbotKnowledge.reminders);
  }
  
  // Emergency features
  if (lowerMessage.includes('emergency') || lowerMessage.includes('qr') || lowerMessage.includes('card') || lowerMessage.includes('urgent') || lowerMessage.includes('critical') || lowerMessage.includes('allergy') || lowerMessage.includes('blood type') || lowerMessage.includes('medical condition')) {
    return getRandomResponse(chatbotKnowledge.emergency);
  }
  
  // Mobile and apps
  if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('phone') || lowerMessage.includes('ios') || lowerMessage.includes('android') || lowerMessage.includes('tablet') || lowerMessage.includes('responsive') || lowerMessage.includes('download')) {
    return getRandomResponse(chatbotKnowledge.mobile);
  }
  
  // Support and help
  if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact') || lowerMessage.includes('assist') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('troubleshoot') || lowerMessage.includes('customer service')) {
    return getRandomResponse(chatbotKnowledge.support);
  }
  
  // Technology and technical details
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('react') || lowerMessage.includes('typescript') || lowerMessage.includes('supabase') || lowerMessage.includes('database') || lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('real-time') || lowerMessage.includes('api')) {
    return getRandomResponse(chatbotKnowledge.technology);
  }
  
  // Data management and organization
  if (lowerMessage.includes('data') || lowerMessage.includes('organize') || lowerMessage.includes('categorize') || lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('sort') || lowerMessage.includes('filter') || lowerMessage.includes('manage')) {
    return getRandomResponse(chatbotKnowledge.dataManagement);
  }
  
  // Accessibility and usability
  if (lowerMessage.includes('accessible') || lowerMessage.includes('easy') || lowerMessage.includes('simple') || lowerMessage.includes('user-friendly') || lowerMessage.includes('elderly') || lowerMessage.includes('senior') || lowerMessage.includes('intuitive') || lowerMessage.includes('navigate')) {
    return getRandomResponse(chatbotKnowledge.accessibility);
  }
  
  // Compliance and standards
  if (lowerMessage.includes('compliance') || lowerMessage.includes('hipaa') || lowerMessage.includes('standard') || lowerMessage.includes('regulation') || lowerMessage.includes('audit') || lowerMessage.includes('certification') || lowerMessage.includes('legal') || lowerMessage.includes('policy')) {
    return getRandomResponse(chatbotKnowledge.compliance);
  }
  
  // Integrations and connectivity
  if (lowerMessage.includes('integration') || lowerMessage.includes('connect') || lowerMessage.includes('sync') || lowerMessage.includes('wearable') || lowerMessage.includes('device') || lowerMessage.includes('app') || lowerMessage.includes('third-party') || lowerMessage.includes('import') || lowerMessage.includes('export')) {
    return getRandomResponse(chatbotKnowledge.integration);
  }
  
  // Backup and data protection
  if (lowerMessage.includes('backup') || lowerMessage.includes('save') || lowerMessage.includes('recover') || lowerMessage.includes('lost') || lowerMessage.includes('restore') || lowerMessage.includes('cloud') || lowerMessage.includes('storage') || lowerMessage.includes('redundancy')) {
    return getRandomResponse(chatbotKnowledge.backup);
  }
  
  // Customization and personalization
  if (lowerMessage.includes('customize') || lowerMessage.includes('personalize') || lowerMessage.includes('tailor') || lowerMessage.includes('goal') || lowerMessage.includes('preference') || lowerMessage.includes('setting') || lowerMessage.includes('option') || lowerMessage.includes('flexible')) {
    return getRandomResponse(chatbotKnowledge.customization);
  }
  
  // Analytics and insights
  if (lowerMessage.includes('analytics') || lowerMessage.includes('insight') || lowerMessage.includes('track') || lowerMessage.includes('monitor') || lowerMessage.includes('progress') || lowerMessage.includes('trend') || lowerMessage.includes('chart') || lowerMessage.includes('report') || lowerMessage.includes('statistic')) {
    return getRandomResponse(chatbotKnowledge.analytics);
  }
  
  // Collaboration and sharing
  if (lowerMessage.includes('collaborate') || lowerMessage.includes('share') || lowerMessage.includes('coordinate') || lowerMessage.includes('team') || lowerMessage.includes('together') || lowerMessage.includes('update') || lowerMessage.includes('inform') || lowerMessage.includes('communicate')) {
    return getRandomResponse(chatbotKnowledge.collaboration);
  }
  
  // Notifications and alerts
  if (lowerMessage.includes('notification') || lowerMessage.includes('alert') || lowerMessage.includes('message') || lowerMessage.includes('email') || lowerMessage.includes('sms') || lowerMessage.includes('push') || lowerMessage.includes('remind') || lowerMessage.includes('notify')) {
    return getRandomResponse(chatbotKnowledge.notifications);
  }
  
  // Storage and capacity
  if (lowerMessage.includes('storage') || lowerMessage.includes('space') || lowerMessage.includes('capacity') || lowerMessage.includes('gb') || lowerMessage.includes('megabyte') || lowerMessage.includes('unlimited') || lowerMessage.includes('full') || lowerMessage.includes('size')) {
    return getRandomResponse(chatbotKnowledge.storage);
  }
  
  // Updates and maintenance
  if (lowerMessage.includes('update') || lowerMessage.includes('upgrade') || lowerMessage.includes('version') || lowerMessage.includes('new') || lowerMessage.includes('improvement') || lowerMessage.includes('maintenance') || lowerMessage.includes('latest') || lowerMessage.includes('current')) {
    return getRandomResponse(chatbotKnowledge.updates);
  }
  
  // Training and learning
  if (lowerMessage.includes('train') || lowerMessage.includes('learn') || lowerMessage.includes('tutorial') || lowerMessage.includes('guide') || lowerMessage.includes('help') || lowerMessage.includes('onboard') || lowerMessage.includes('webinar') || lowerMessage.includes('demo')) {
    return getRandomResponse(chatbotKnowledge.training);
  }
  
  // Comparison with other apps
  if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus') || lowerMessage.includes('better') || lowerMessage.includes('different') || lowerMessage.includes('unique') || lowerMessage.includes('advantage') || lowerMessage.includes('competitor')) {
    return getRandomResponse(chatbotKnowledge.comparison);
  }
  
  // Future features and roadmap
  if (lowerMessage.includes('future') || lowerMessage.includes('coming') || lowerMessage.includes('soon') || lowerMessage.includes('plan') || lowerMessage.includes('roadmap') || lowerMessage.includes('next') || lowerMessage.includes('develop') || lowerMessage.includes('upcoming')) {
    return getRandomResponse(chatbotKnowledge.future);
  }
  
  // General questions about the platform
  if (lowerMessage.includes('what is pariwar') || lowerMessage.includes('pariwar') || lowerMessage.includes('health management') || lowerMessage.includes('family health') || lowerMessage.includes('platform') || lowerMessage.includes('service') || lowerMessage.includes('product')) {
    return "Pariwar+ is a comprehensive family health management platform that helps families track medical records, manage medications, set reminders, and maintain emergency health information. It's designed to be the central hub for all your family's health needs with AI-powered organization and real-time collaboration features.";
  }
  
  // How to get started
  if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('sign up') || lowerMessage.includes('register') || lowerMessage.includes('create account') || lowerMessage.includes('get started') || lowerMessage.includes('onboard')) {
    return "Getting started with Pariwar+ is easy! Simply visit our website, click 'Sign Up', and create your account. You'll be guided through setting up your family profiles, adding family members, and uploading your first medical documents. Our onboarding process takes just a few minutes and includes helpful tutorials to get you up and running quickly.";
  }
  
  // Benefits and advantages
  if (lowerMessage.includes('benefit') || lowerMessage.includes('advantage') || lowerMessage.includes('why') || lowerMessage.includes('value') || lowerMessage.includes('worth') || lowerMessage.includes('helpful') || lowerMessage.includes('useful')) {
    return "Pariwar+ offers numerous benefits: centralized health management for your entire family, AI-powered document organization, smart medication reminders, emergency health cards for safety, secure data storage, real-time collaboration, and comprehensive health analytics. It saves time, reduces stress, and ensures your family's health information is always accessible when you need it most.";
  }
  
  // Use cases and scenarios
  if (lowerMessage.includes('use case') || lowerMessage.includes('scenario') || lowerMessage.includes('situation') || lowerMessage.includes('when') || lowerMessage.includes('example') || lowerMessage.includes('scenario') || lowerMessage.includes('case study')) {
    return "Pariwar+ is perfect for various scenarios: managing children's vaccination schedules, coordinating elderly parent care, tracking family medication compliance, organizing medical documents for insurance claims, emergency situations requiring quick health information access, and maintaining comprehensive health records for the whole family. It's especially valuable for families with multiple health conditions or those managing care for elderly relatives.";
  }
  
  // Technical requirements
  if (lowerMessage.includes('requirement') || lowerMessage.includes('device') || lowerMessage.includes('browser') || lowerMessage.includes('internet') || lowerMessage.includes('system') || lowerMessage.includes('specification') || lowerMessage.includes('compatible')) {
    return "Pariwar+ works on any device with a modern web browser and internet connection. We support Chrome, Firefox, Safari, and Edge browsers. The platform is fully responsive, so it works perfectly on smartphones, tablets, and desktop computers. No special software or hardware is required - just access to the internet and a web browser.";
  }
  
  // Data export and portability
  if (lowerMessage.includes('export') || lowerMessage.includes('download') || lowerMessage.includes('backup') || lowerMessage.includes('transfer') || lowerMessage.includes('move') || lowerMessage.includes('portable') || lowerMessage.includes('copy')) {
    return "Yes, you can export your health data from Pariwar+ at any time. We provide options to download your medical documents, export health records in standard formats, and create comprehensive backups. Your data belongs to you, and we make it easy to take it with you if needed. Premium users get additional export options and formats.";
  }
  
  // Privacy and data ownership
  if (lowerMessage.includes('own') || lowerMessage.includes('ownership') || lowerMessage.includes('my data') || lowerMessage.includes('belong') || lowerMessage.includes('control') || lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
    return "You own 100% of your health data in Pariwar+. You have complete control over what information is stored, who can access it, and can delete any data at any time. We never sell, share, or use your health information for any purpose other than providing the service you requested. Your privacy and data ownership are our top priorities.";
  }
  
  // Performance and speed
  if (lowerMessage.includes('fast') || lowerMessage.includes('speed') || lowerMessage.includes('performance') || lowerMessage.includes('slow') || lowerMessage.includes('loading') || lowerMessage.includes('response') || lowerMessage.includes('efficient')) {
    return "Pariwar+ is built for speed and performance. Our platform uses modern cloud infrastructure that ensures fast loading times, quick search results, and responsive document management. We optimize for performance across all devices and internet connections. Premium users get priority access to our fastest servers for even better performance.";
  }
  
  // Multi-language support
  if (lowerMessage.includes('language') || lowerMessage.includes('hindi') || lowerMessage.includes('english') || lowerMessage.includes('multilingual') || lowerMessage.includes('translate') || lowerMessage.includes('local') || lowerMessage.includes('regional')) {
    return "Currently, Pariwar+ is available in English, but we're actively working on adding support for Hindi and other regional languages. Our goal is to make family health management accessible to everyone in India. We'll announce new language support as soon as it's available.";
  }
  
  // Offline functionality
  if (lowerMessage.includes('offline') || lowerMessage.includes('internet') || lowerMessage.includes('no wifi') || lowerMessage.includes('disconnect') || lowerMessage.includes('airplane') || lowerMessage.includes('no connection')) {
    return "Pariwar+ requires an internet connection for most features, but we're developing offline capabilities for viewing emergency health cards and basic health information. This will ensure your critical health data is accessible even when you're offline. For now, we recommend downloading emergency health cards to your device for offline access.";
  }
  
  return getRandomResponse(chatbotKnowledge.default);
};

const getRandomResponse = (responses: string[]) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// Chat message interface
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const FAQSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm Pariwar+ Assistant. How can I help you learn about our family health management platform?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getChatbotResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick question suggestions
  const quickQuestions = [
    "How much does it cost?",
    "Is my data secure?",
    "How do medicine reminders work?",
    "What documents can I upload?",
    "How many family members can I add?",
    "Is there a mobile app?",
    "How do emergency cards work?",
    "What makes Pariwar+ different?",
    "How do I get started?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-feature rounded-full px-6 py-3 mb-8 shadow-soft">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Got Questions?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about Pariwar+. Can't find what you're looking for? 
            Chat with our AI assistant below!
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-soft"
                      : "bg-white/50 text-muted-foreground hover:bg-white/80 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {filteredFaqs.map((faq, index) => (
              <div 
                  key={index} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`item-${index}`} className="border-none">
                    <AccordionTrigger className="px-8 py-6 text-left hover:no-underline group-hover:bg-white/50 transition-all duration-300">
                      <div className="flex items-start gap-4 w-full">
                        <div className={`w-12 h-12 bg-gradient-to-br ${faq.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                          <faq.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {faq.question}
                          </h3>
                          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-muted-foreground">{faq.category}</span>
                          </div>
                        </div>
                      </div>
                  </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6">
                      <div className="pl-16">
                        <p className="text-muted-foreground leading-relaxed text-base">
                    {faq.answer}
                        </p>
                      </div>
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
          </div>
            ))}
          </div>
        </div>

        {/* AI Chatbot */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Chat with AI Assistant
            </h3>
            <p className="text-white/90 mb-6 text-lg">
              Get instant answers to your questions about Pariwar+
            </p>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold shadow-soft hover:shadow-card transform hover:scale-105 transition-all duration-300"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
          <div className={`bg-white rounded-3xl shadow-2xl border border-gray-200 transition-all duration-500 transform ${
            isChatMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          }`}>
            {/* Enhanced Chat Header */}
            <div className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-white p-4 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Pariwar+ Assistant</h4>
                  <p className="text-xs text-white/90 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    AI-powered support
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatMinimized(!isChatMinimized)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  {isChatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isChatMinimized && (
              <div className="flex flex-col h-[500px]">
                {/* Enhanced Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-gradient-to-b from-gray-50 to-white">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                            message.isUser
                              ? 'bg-gradient-to-r from-primary to-purple-600 text-white rounded-br-md'
                              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className={`text-xs mt-2 ${
                            message.isUser ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Enhanced Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Enhanced Quick Questions */}
                <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <p className="text-xs text-gray-600 mb-3 font-medium">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs bg-white hover:bg-primary hover:text-white text-gray-700 px-3 py-2 rounded-full transition-all duration-300 border border-gray-200 hover:border-primary shadow-sm hover:shadow-md transform hover:scale-105"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enhanced Chat Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-3xl">
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question about Pariwar+..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all duration-300"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-gradient-to-r from-primary to-purple-600 text-white p-3 rounded-xl hover:from-purple-600 hover:to-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FAQSection;