import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Search, Filter, FileText, ArrowRight, BookOpen, ArrowUpRight, ChevronRight } from "lucide-react";

// Mock data for legal documentation
const LEGAL_CATEGORIES = [
  { id: 'criminal', name: 'Criminal Law', count: 24 },
  { id: 'civil', name: 'Civil Law', count: 18 },
  { id: 'family', name: 'Family Law', count: 15 },
  { id: 'property', name: 'Property Law', count: 12 },
  { id: 'constitutional', name: 'Constitutional Law', count: 10 },
  { id: 'corporate', name: 'Corporate Law', count: 14 },
  { id: 'tax', name: 'Tax Law', count: 8 },
  { id: 'labor', name: 'Labor Law', count: 9 },
  { id: 'intellectual', name: 'Intellectual Property', count: 7 }
];

// Mock legal articles/documentation
const LEGAL_ARTICLES = [
  {
    id: 1,
    title: 'Understanding Criminal Procedure Code in India',
    category: 'criminal',
    subcategory: 'procedure',
    level: 'beginner',
    description: 'A comprehensive guide to the Criminal Procedure Code (CrPC), 1973, covering FIR filing, investigation, and trial proceedings.',
    content: `
      <h2>Introduction to Criminal Procedure Code</h2>
      <p>The Criminal Procedure Code (CrPC), 1973 is the main legislation on procedure for administration of criminal law in India. It provides the machinery for the investigation of crime, apprehension of suspected criminals, collection of evidence, determination of guilt or innocence, and the imposition of penalties on the guilty.</p>
      
      <h3>First Information Report (FIR)</h3>
      <p>An FIR is the first step in the criminal justice process. It is a written document prepared by the police when they receive information about the commission of a cognizable offense. Under Section 154 of the CrPC, the police are obligated to register an FIR if the information discloses a cognizable offense.</p>
      
      <h3>Investigation Process</h3>
      <p>Under Sections 156-173 of the CrPC, after an FIR is registered, the police begin their investigation, which includes visiting the crime scene, recording witness statements, collecting evidence, and arresting suspects if necessary. The investigation must be completed without unnecessary delay.</p>
      
      <h3>Charge Sheet</h3>
      <p>Upon completion of the investigation, if sufficient evidence exists, the police file a charge sheet (final report) in court against the accused under Section 173 of the CrPC. If evidence is insufficient, a closure report may be filed instead.</p>
      
      <h3>Trial Process</h3>
      <p>The trial process under Sections 200-265 begins with the framing of charges, followed by the prosecution presenting its case. The defense can cross-examine witnesses and present its own evidence before final arguments. The judge then pronounces the judgment based on the evidence presented.</p>
    `,
    tags: ['criminal law', 'procedure', 'FIR', 'trial', 'CrPC', 'investigation', 'charge sheet'],
    date: '2023-05-15',
    views: 4230,
    relatedArticles: [2, 5, 9]
  },
  {
    id: 2,
    title: 'Rights of the Accused under Indian Constitution and Criminal Law',
    category: 'criminal',
    subcategory: 'rights',
    level: 'beginner',
    description: 'A detailed explanation of the fundamental rights guaranteed to accused persons in the Indian legal system under the Constitution and various statutes.',
    content: `
      <h2>Constitutional Protections</h2>
      <p>The Indian Constitution provides several protections to persons accused of crimes. Article 20 prohibits double jeopardy, self-incrimination, and ex-post facto laws. Article 21 guarantees the right to life and personal liberty, which has been interpreted to include the right to a fair trial. Article 22 provides specific rights upon arrest.</p>
      
      <h3>Right to Legal Representation</h3>
      <p>Under Article 22(1) of the Constitution and Section 303 of the CrPC, every accused person has the right to consult and be defended by a legal practitioner of their choice. If the accused cannot afford legal representation, free legal aid must be provided under Article 39A and the Legal Services Authorities Act, 1987.</p>
      
      <h3>Right to Fair Trial</h3>
      <p>The right to a fair trial, though not explicitly mentioned in the Constitution, has been recognized by the Supreme Court as a fundamental right under Article 21. This includes the right to be informed of charges, present evidence, cross-examine witnesses, and appeal against conviction.</p>
      
      <h3>Protection Against Arbitrary Arrest</h3>
      <p>Article 22 of the Constitution and Sections 50-60 of the CrPC provide protections against arbitrary arrest. The police must inform the accused of the grounds for arrest and produce them before a magistrate within 24 hours of arrest (excluding travel time). The landmark case of D.K. Basu v. State of West Bengal established additional guidelines for arrest and detention.</p>
    `,
    tags: ['criminal law', 'rights', 'constitution', 'fair trial', 'legal aid', 'arbitrary arrest', 'D.K. Basu guidelines'],
    date: '2023-03-22',
    views: 3650,
    relatedArticles: [1, 5, 7]
  },
  {
    id: 3,
    title: 'Property Ownership and Transfer under Indian Legal Framework',
    category: 'property',
    subcategory: 'ownership',
    level: 'intermediate',
    description: 'A comprehensive guide to property ownership types and transfer processes in India under the Transfer of Property Act and related legislations.',
    content: `
      <h2>Types of Property Ownership</h2>
      <p>Indian law recognizes various forms of property ownership. Under the Transfer of Property Act, 1882, and other property-related laws, property can be held in sole ownership, joint ownership, co-ownership with defined shares, and through corporate entities like companies or trusts.</p>
      
      <h3>Transfer of Property Act Framework</h3>
      <p>The Transfer of Property Act, 1882 is the primary legislation governing property transfers in India. Sections 5-53 deal with transfers of immovable property through sales, mortgages, leases, exchanges, and gifts. The Act specifies the formal requirements for valid transfers and restrictions on transfers.</p>
      
      <h3>Registration and Documentation</h3>
      <p>Under the Registration Act, 1908, property transfers typically require the execution of a sale deed, which must be registered with the Sub-Registrar's office in the jurisdiction where the property is located. Section 17 of the Act specifies which documents must be mandatorily registered.</p>
      
      <h3>Stamp Duty and Registration Fees</h3>
      <p>The Indian Stamp Act, 1899 and respective state stamp acts mandate payment of stamp duty on property transfer documents. Additionally, registration fees must be paid under the Registration Act. These rates vary by state and property value, with some states offering concessions for women property owners and certain categories of buyers.</p>
    `,
    tags: ['property law', 'ownership', 'transfer', 'sale deed', 'registration', 'stamp duty', 'Transfer of Property Act'],
    date: '2023-06-10',
    views: 2980,
    relatedArticles: [8, 11, 15]
  },
  {
    id: 4,
    title: 'Divorce Procedures under Various Personal Laws in India',
    category: 'family',
    subcategory: 'divorce',
    level: 'intermediate',
    description: 'Comparative analysis of divorce procedures under Hindu, Muslim, Christian, and Special Marriage Act with recent judicial interpretations.',
    content: `
      <h2>Hindu Marriage Act Provisions</h2>
      <p>Under the Hindu Marriage Act, 1955, divorce can be sought on grounds listed in Section 13, including adultery, cruelty, desertion for two years, conversion to another religion, mental disorder, communicable disease, renunciation of the world, presumption of death, and failure to resume cohabitation after a decree of judicial separation. Section 13B provides for divorce by mutual consent.</p>
      
      <h3>Muslim Personal Law</h3>
      <p>Muslim divorce law in India is governed by personal laws and the Muslim Women (Protection of Rights on Marriage) Act, 2019. Forms of divorce include Talaq (by husband), Khula (by wife with husband's consent), Mubarat (by mutual consent), and judicial divorce through the Dissolution of Muslim Marriages Act, 1939. The 2019 Act criminalizes triple talaq (talaq-e-biddat).</p>
      
      <h3>Christian Divorce Law</h3>
      <p>The Indian Divorce Act, 1869 (amended in 2001) governs divorce among Christians. Under Section 10, grounds for divorce include adultery, conversion, unsound mind, communicable disease, desertion, cruelty, and presumption of death. The 2001 amendment removed the earlier requirement that Christian women needed to prove additional grounds beyond adultery.</p>
      
      <h3>Special Marriage Act</h3>
      <p>The Special Marriage Act, 1954 provides for civil marriages irrespective of religion. Section 27 of the Act provides divorce grounds similar to the Hindu Marriage Act, including adultery, desertion, imprisonment, cruelty, mental disorder, and communicable disease. Section 28 allows for divorce by mutual consent after one year of marriage.</p>
    `,
    tags: ['family law', 'divorce', 'marriage', 'personal laws', 'Hindu Marriage Act', 'Muslim law', 'Christian law', 'Special Marriage Act'],
    date: '2023-04-05',
    views: 5120,
    relatedArticles: [10, 13, 17]
  },
  {
    id: 5,
    title: 'Fundamental Rights under the Indian Constitution: A Comprehensive Guide',
    category: 'constitutional',
    subcategory: 'fundamental rights',
    level: 'beginner',
    description: 'Detailed explanation of the fundamental rights enshrined in Part III of the Indian Constitution with landmark Supreme Court judgments.',
    content: `
      <h2>Right to Equality (Articles 14-18)</h2>
      <p>Articles 14-18 of the Constitution guarantee equality before law and equal protection of the laws, prohibition of discrimination on grounds of religion, race, caste, sex, or place of birth, equality of opportunity in public employment, abolition of untouchability, and abolition of titles except military and academic distinctions.</p>
      
      <h3>Right to Freedom (Articles 19-22)</h3>
      <p>Articles 19-22 provide for six fundamental freedoms: speech and expression, assembly, association, movement, residence, and profession. These freedoms are subject to reasonable restrictions in the interests of sovereignty, integrity, public order, decency, and morality. Articles 20-22 provide protections in respect of conviction for offenses, protection of life and personal liberty, and protection against arbitrary arrest and detention.</p>
      
      <h3>Right Against Exploitation (Articles 23-24)</h3>
      <p>Articles 23-24 prohibit trafficking in human beings and forced labor (Article 23), and employment of children below 14 years in factories, mines, or other hazardous occupations (Article 24). The Supreme Court in People's Union for Democratic Rights v. Union of India expanded the scope of Article 23 to include other forms of forced labor.</p>
      
      <h3>Right to Freedom of Religion (Articles 25-28)</h3>
      <p>Articles 25-28 ensure freedom of conscience and free profession, practice, and propagation of religion, subject to public order, morality, and health. Article 26 gives freedom to manage religious affairs, Article 27 prohibits taxes for promotion of any religion, and Article 28 concerns freedom from religious instruction in state-funded educational institutions.</p>
      
      <h3>Cultural and Educational Rights (Articles 29-30)</h3>
      <p>Articles 29-30 protect the interests of minorities by ensuring their right to conserve their language, script, or culture, and their right to establish and administer educational institutions of their choice. The Supreme Court in TMA Pai Foundation v. State of Karnataka clarified the scope of these rights for minority educational institutions.</p>
    `,
    tags: ['constitutional law', 'fundamental rights', 'equality', 'freedom', 'constitution', 'right to equality', 'right to freedom', 'Supreme Court'],
    date: '2023-01-26',
    views: 6750,
    relatedArticles: [2, 7, 11]
  },
  {
    id: 6,
    title: 'Corporate Governance Framework in India: Laws, Regulations, and Best Practices',
    category: 'corporate',
    subcategory: 'governance',
    level: 'advanced',
    description: 'Comprehensive overview of corporate governance requirements under the Companies Act, SEBI regulations, and international best practices for Indian companies.',
    content: `
      <h2>Companies Act 2013 Requirements</h2>
      <p>The Companies Act, 2013 (particularly Chapters IX-XII) provides the primary regulatory framework for corporate governance in India. Key provisions include mandatory independent directors for listed companies (Section 149), code for independent directors (Schedule IV), board committees including audit committee (Section 177) and nomination and remuneration committee (Section 178), restrictions on layers of subsidiaries (Section 186), and CSR obligations (Section 135).</p>
      
      <h3>SEBI Guidelines and LODR Regulations</h3>
      <p>For listed companies, the Securities and Exchange Board of India (SEBI) has issued the Listing Obligations and Disclosure Requirements (LODR) Regulations, 2015. These include requirements for board composition (Regulation 17), maximum number of directorships (Regulation 17A), committee compositions (Regulations 18-21), related party transactions (Regulation 23), and disclosure requirements (Regulations 24-27).</p>
      
      <h3>Board Structure and Committees</h3>
      <p>Regulations require a balanced board with executive, non-executive, and independent directors. Listed companies must have at least one woman director and at least one-third of the board as independent directors (if the chairperson is non-executive) or at least half the board (if the chairperson is executive). Mandatory committees include audit committee, nomination and remuneration committee, stakeholders relationship committee, and risk management committee (for top 1000 listed entities).</p>
      
      <h3>Disclosure and Transparency Requirements</h3>
      <p>Companies must make regular disclosures regarding financial information, material events, and related party transactions to ensure transparency and accountability. Quarterly and annual financial results, shareholding patterns, corporate governance reports, business responsibility reports (for top 1000 listed companies), and specific event-based disclosures are mandatory under SEBI LODR Regulations.</p>
    `,
    tags: ['corporate law', 'governance', 'SEBI', 'Companies Act', 'board of directors', 'disclosure', 'compliance', 'independent directors'],
    date: '2023-07-12',
    views: 2350,
    relatedArticles: [9, 12, 14]
  },
  {
    id: 7,
    title: 'Habeas Corpus and Civil Liberties in India',
    category: 'constitutional',
    subcategory: 'writs',
    level: 'intermediate',
    description: 'Detailed examination of the writ of habeas corpus under Article 32 and 226 of the Indian Constitution with landmark judgments on civil liberties.',
    content: `
      <h2>Constitutional Foundation of Habeas Corpus</h2>
      <p>Habeas corpus, literally meaning "to have the body," is a constitutional remedy provided under Articles 32 and 226 of the Indian Constitution. It is a writ issued by the Supreme Court or High Courts to produce a person who has been detained, before the court, to determine if the detention is legal.</p>
      
      <h3>Historical Development in India</h3>
      <p>The writ has a long history in India, dating back to the British period. The Supreme Court in A.K. Gopalan v. State of Madras (1950) addressed the scope of habeas corpus in independent India. However, its suspension during the Emergency (1975-77) through the 42nd Amendment led to the infamous ADM Jabalpur v. Shivkant Shukla case, which was later overruled in K.S. Puttaswamy v. Union of India (2017).</p>
      
      <h3>Scope and Procedure</h3>
      <p>Habeas corpus can be filed by any person on behalf of the detainee, not necessarily the detainee themselves. The courts have expanded its scope to include various forms of detention, including in private custody. The procedure is summary in nature, requiring the detaining authority to prove the legality of detention.</p>
      
      <h3>Landmark Judgments</h3>
      <p>In Rudul Sah v. State of Bihar (1983), the Supreme Court awarded compensation for illegal detention. In Sunil Batra v. Delhi Administration (1978), the court expanded the writ to cover prison conditions. Recent judgments like Arnab Goswami v. State of Maharashtra (2020) have reaffirmed the importance of this writ in safeguarding personal liberty.</p>
    `,
    tags: ['constitutional law', 'habeas corpus', 'writs', 'civil liberties', 'Article 32', 'Article 226', 'detention'],
    date: '2023-02-18',
    views: 3850,
    relatedArticles: [2, 5, 11]
  },
  {
    id: 8,
    title: 'Real Estate (Regulation and Development) Act: Impact on Property Transactions',
    category: 'property',
    subcategory: 'regulation',
    level: 'intermediate',
    description: 'Analysis of RERA provisions and their impact on property developers, buyers, and the real estate market in India.',
    content: `
      <h2>Introduction to RERA</h2>
      <p>The Real Estate (Regulation and Development) Act, 2016 (RERA) was enacted to regulate the real estate sector, ensure transparency in transactions, and protect homebuyers' interests. It came into full effect on May 1, 2017, and has significantly transformed the real estate landscape in India.</p>
      
      <h3>Registration Requirements</h3>
      <p>Sections 3-10 of RERA mandate the registration of real estate projects with the Real Estate Regulatory Authority of each state. Developers must provide comprehensive details about the project, including land status, approvals, completion timeline, and development plans. Registration is mandatory for projects larger than 500 square meters or with more than 8 apartments.</p>
      
      <h3>Buyer Protections</h3>
      <p>RERA provides significant protections to homebuyers, including the requirement that 70% of buyer payments be kept in a separate escrow account (Section 4), prohibition of changes to plans without buyer consent (Section 14), structural defect liability period of 5 years (Section 14(3)), and compensation for delays with interest (Section 18).</p>
      
      <h3>Dispute Resolution</h3>
      <p>RERA establishes a three-tier dispute resolution mechanism: the Real Estate Regulatory Authority at the first level, the Real Estate Appellate Tribunal at the second level, and the High Court at the third level. These forums aim to provide faster resolution compared to consumer forums or civil courts, with cases to be decided within 60 days.</p>
    `,
    tags: ['property law', 'RERA', 'real estate', 'regulation', 'homebuyers', 'consumer protection', 'dispute resolution'],
    date: '2023-04-30',
    views: 4120,
    relatedArticles: [3, 15, 18]
  },
  {
    id: 9,
    title: 'Criminal Trial Stages: From Arrest to Appeal',
    category: 'criminal',
    subcategory: 'trial',
    level: 'intermediate',
    description: 'Step-by-step explanation of criminal trial procedure in India under the Criminal Procedure Code with relevant case law.',
    content: `
      <h2>Pre-Trial Stage</h2>
      <p>The pre-trial stage begins with the filing of an FIR under Section 154 of the CrPC for cognizable offenses or a complaint before a magistrate under Section 190 for non-cognizable offenses. This is followed by police investigation under Sections 156-173, including evidence collection, witness statements, and arrest if necessary.</p>
      
      <h3>Committal and Charge Framing</h3>
      <p>After the investigation, if a charge sheet is filed, the case is committed to the appropriate court under Section 209 (for sessions trials) or proceeds directly in the magistrate's court. Charges are then framed under Sections 211-224, clearly stating the offense alleged. The accused may plead guilty (Section 229) or claim trial.</p>
      
      <h3>Trial Proceedings</h3>
      <p>The trial begins with the prosecution evidence under Section 231, where witnesses are examined, cross-examined, and re-examined. After the prosecution closes its case, the court records the accused's statement under Section 313. The defense then presents its evidence under Section 233. Final arguments follow under Section 234.</p>
      
      <h3>Judgment and Appeal</h3>
      <p>The judgment is pronounced under Section 235, acquitting or convicting the accused. If convicted, a hearing on the sentence follows. Appeals can be made to higher courts under Sections 374-394 of the CrPC. A sessions court judgment can be appealed to the High Court, and a High Court judgment to the Supreme Court.</p>
    `,
    tags: ['criminal law', 'trial', 'procedure', 'CrPC', 'arrest', 'charge sheet', 'evidence', 'appeal'],
    date: '2023-06-22',
    views: 3270,
    relatedArticles: [1, 2, 12]
  },
  {
    id: 10,
    title: 'Child Custody Laws and Best Interests Principle in India',
    category: 'family',
    subcategory: 'custody',
    level: 'intermediate',
    description: 'Analysis of child custody laws under different personal laws and the evolving "best interests of the child" doctrine in Indian courts.',
    content: `
      <h2>Hindu Law on Child Custody</h2>
      <p>Under Hindu law, the Hindu Minority and Guardianship Act, 1956 governs custody matters. Section 6 recognizes the father as the natural guardian of a Hindu minor boy or unmarried girl, and the mother as the guardian after the father. However, Section 13 states that the welfare of the minor shall be the paramount consideration in appointing or declaring a guardian.</p>
      
      <h3>Muslim Law on Custody</h3>
      <p>In Muslim law, custody (Hizanat) traditionally recognizes the mother's right to custody of young children: boys until 7 years and girls until puberty. The father is considered the natural guardian of the child's property. However, Indian courts have increasingly prioritized the child's welfare over these traditional rules, as seen in Shabana Bano v. Imran Khan (2010).</p>
      
      <h3>The "Best Interests" Doctrine</h3>
      <p>In Gaurav Nagpal v. Sumedha Nagpal (2009), the Supreme Court firmly established that regardless of personal laws, the paramount consideration in custody cases is the welfare and best interests of the child. This principle considers factors like the child's age, gender, education, emotional attachment, stability, and parents' ability to provide care.</p>
      
      <h3>Shared Parenting and Visitation Rights</h3>
      <p>Indian courts are increasingly recognizing the importance of both parents in a child's life. In ABC v. State (NCT of Delhi) (2015), the Supreme Court acknowledged unwed mothers as legal guardians without requiring the father's consent, while still recognizing the importance of father-child relationships in appropriate cases. Courts now regularly grant visitation rights to non-custodial parents.</p>
    `,
    tags: ['family law', 'child custody', 'guardianship', 'best interests', 'Hindu law', 'Muslim law', 'visitation rights'],
    date: '2023-03-15',
    views: 3540,
    relatedArticles: [4, 13, 17]
  },
  {
    id: 11,
    title: 'Constitutional Remedies and Writ Jurisdiction in India',
    category: 'constitutional',
    subcategory: 'remedies',
    level: 'intermediate',
    description: 'Comprehensive guide to constitutional remedies under Articles 32 and 226, including the five types of writs and their applications.',
    content: `
      <h2>Constitutional Framework of Remedies</h2>
      <p>Articles 32 and 226 of the Constitution provide for writ jurisdiction to the Supreme Court and High Courts respectively. Article 32, being a fundamental right itself, allows direct approach to the Supreme Court for enforcement of fundamental rights. Article 226 gives wider powers to High Courts, allowing writs for enforcement of fundamental rights and "for any other purpose."</p>
      
      <h3>Habeas Corpus</h3>
      <p>This writ, meaning "to have the body," is issued to produce a person who has been detained, to determine if the detention is legal. In Sunil Batra v. Delhi Administration (1978), the Supreme Court extended this writ to protect prisoners from inhuman treatment. It can be filed by any person, not just the detainee.</p>
      
      <h3>Mandamus</h3>
      <p>Mandamus ("we command") directs public authorities to perform their legal duties. It cannot be issued against private individuals, the President, Governor, or judicial officers acting in judicial capacity. In Bandhua Mukti Morcha v. Union of India (1984), the court issued mandamus for enforcement of labor laws.</p>
      
      <h3>Prohibition and Certiorari</h3>
      <p>Prohibition prevents lower courts or tribunals from exceeding their jurisdiction and is issued during pending proceedings. Certiorari quashes decisions already made in excess of jurisdiction. In A.K. Kraipak v. Union of India (1969), the court extended certiorari to administrative actions having civil consequences.</p>
      
      <h3>Quo Warranto</h3>
      <p>This writ questions the legality of a person holding a public office. It can be sought by any citizen, as it protects the public from usurpers of public office. The Supreme Court in University of Mysore v. Govinda Rao (1964) clarified that the office must be created by statute or the Constitution and be of public nature.</p>
    `,
    tags: ['constitutional law', 'writs', 'Article 32', 'Article 226', 'habeas corpus', 'mandamus', 'certiorari', 'prohibition', 'quo warranto'],
    date: '2023-02-05',
    views: 4250,
    relatedArticles: [5, 7, 19]
  },
  {
    id: 12,
    title: 'Anticipatory Bail under Section 438 CrPC: Law and Procedure',
    category: 'criminal',
    subcategory: 'bail',
    level: 'intermediate',
    description: 'Detailed analysis of anticipatory bail provisions, procedures, and landmark Supreme Court judgments on pre-arrest bail in India.',
    content: `
      <h2>Concept and Legislative Framework</h2>
      <p>Anticipatory bail is a direction to release a person on bail, issued in anticipation of arrest on accusation of having committed a non-bailable offense. Section 438 of the CrPC provides that the High Court or Sessions Court may direct that a person be released on bail if arrested. It serves as a critical safeguard against unwarranted arrests and harassment.</p>
      
      <h3>Application Procedure and Considerations</h3>
      <p>An application for anticipatory bail must contain grounds showing reasonable belief of arrest and specific facts of the case. Courts consider factors like the nature and gravity of accusations, possibility of applicant fleeing justice, likelihood of witness tampering, and prima facie case against the applicant, as outlined in Gurbaksh Singh Sibbia v. State of Punjab (1980).</p>
      
      <h3>Duration and Conditions</h3>
      <p>In Sushila Aggarwal v. State of NCT of Delhi (2020), the Supreme Court clarified that anticipatory bail can continue till the end of the trial and need not be limited in time. However, courts may impose conditions under Section 438(2), including cooperation with investigation, not tampering with evidence, and not leaving the country without permission.</p>
      
      <h3>State Variations</h3>
      <p>Some states have amended Section 438 to restrict anticipatory bail in certain offenses. For instance, in Uttar Pradesh, anticipatory bail is not available for offenses under the Gangsters Act, while Maharashtra has specific provisions for serious economic offenses. The Supreme Court in Balchand Jain v. State of MP (1976) held that such state amendments are valid.</p>
    `,
    tags: ['criminal law', 'anticipatory bail', 'Section 438', 'arrest', 'CrPC', 'bail conditions', 'pre-arrest bail'],
    date: '2023-07-08',
    views: 3820,
    relatedArticles: [2, 9, 15]
  },
  {
    id: 13,
    title: 'Maintenance Rights under Section 125 CrPC and Personal Laws',
    category: 'family',
    subcategory: 'maintenance',
    level: 'beginner',
    description: 'Comparative study of maintenance provisions under CrPC and different personal laws with recent judicial developments.',
    content: `
      <h2>Section 125 CrPC: Universal Application</h2>
      <p>Section 125 of the Criminal Procedure Code provides for maintenance to wives, minor children, and parents who are unable to maintain themselves. This secular provision applies to all persons regardless of religion. The amount of maintenance is determined based on the income of the respondent and the needs of the claimant, with no fixed upper limit after the 2001 amendment.</p>
      
      <h3>Maintenance under Hindu Law</h3>
      <p>Section 18 of the Hindu Adoptions and Maintenance Act, 1956 provides for maintenance of Hindu wives during marriage and after separation. Section 19 deals with maintenance of widowed daughters-in-law, while Section 20 covers maintenance of children and aged parents. In Rajnesh v. Neha (2020), the Supreme Court issued comprehensive guidelines for determining maintenance amounts.</p>
      
      <h3>Muslim Law on Maintenance</h3>
      <p>Under Muslim personal law, maintenance (nafaqa) is payable to the wife during marriage and during the iddat period after divorce. The Muslim Women (Protection of Rights on Divorce) Act, 1986, enacted after the Shah Bano case, provides for "fair and reasonable provision" for divorced Muslim women. In Shamim Ara v. State of UP (2002), the Supreme Court held that triple talaq must be properly pronounced and proved.</p>
      
      <h3>Recent Judicial Trends</h3>
      <p>In Shayara Bano v. Union of India (2017), the Supreme Court invalidated instant triple talaq. In Danial Latifi v. Union of India (2001), the court interpreted the 1986 Act to include "reasonable and fair provision" extending beyond the iddat period. The trend is toward gender justice across religious boundaries, with courts increasingly awarding interim maintenance during pending proceedings.</p>
    `,
    tags: ['family law', 'maintenance', 'Section 125 CrPC', 'Hindu law', 'Muslim law', 'alimony', 'gender justice'],
    date: '2023-05-20',
    views: 4580,
    relatedArticles: [4, 10, 17]
  },
  {
    id: 14,
    title: 'Corporate Insolvency Resolution Process under IBC 2016',
    category: 'corporate',
    subcategory: 'insolvency',
    level: 'advanced',
    description: 'Step-by-step explanation of the corporate insolvency resolution process under the Insolvency and Bankruptcy Code with case studies.',
    content: `
      <h2>Initiation of CIRP</h2>
      <p>The Corporate Insolvency Resolution Process (CIRP) under the Insolvency and Bankruptcy Code, 2016 can be initiated by financial creditors (Section 7), operational creditors (Section 9), or the corporate debtor itself (Section 10). The minimum default threshold was increased from ₹1 lakh to ₹1 crore in 2020. The application is filed before the National Company Law Tribunal (NCLT), which must admit or reject it within 14 days.</p>
      
      <h3>Moratorium and Resolution Professional</h3>
      <p>Upon admission, a moratorium is declared under Section 14, preventing all legal proceedings against the corporate debtor. An Interim Resolution Professional (IRP) is appointed, who takes over the management and constitutes a Committee of Creditors (CoC) comprising financial creditors. The CoC may either confirm the IRP or appoint a new Resolution Professional (RP) under Section 22.</p>
      
      <h3>Resolution Plan and Approval</h3>
      <p>The RP invites resolution plans from potential resolution applicants. These plans must provide for insolvency resolution costs, management of affairs, implementation and supervision of the plan, and conform to Section 30(2) requirements. The CoC must approve the plan by a 66% majority vote, after which it is submitted to the NCLT for approval under Section 31.</p>
      
      <h3>Liquidation and Recent Developments</h3>
      <p>If no resolution plan is received or approved within the 330-day timeline (including extensions), the corporate debtor goes into liquidation under Section 33. In Swiss Ribbons v. Union of India (2019), the Supreme Court upheld the constitutional validity of various IBC provisions. The Code has been amended multiple times, including the 2020 suspension during COVID-19 and the 2021 pre-packaged insolvency resolution process for MSMEs.</p>
    `,
    tags: ['corporate law', 'insolvency', 'IBC', 'NCLT', 'resolution', 'liquidation', 'Committee of Creditors'],
    date: '2023-06-05',
    views: 2890,
    relatedArticles: [6, 9, 16]
  },
  {
    id: 15,
    title: 'Land Acquisition Process and Fair Compensation under RFCTLARR Act 2013',
    category: 'property',
    subcategory: 'acquisition',
    level: 'intermediate',
    description: 'Analysis of the land acquisition procedure under the 2013 Act with comparison to the previous regime and judicial interpretations.',
    content: `
      <h2>Shift from Land Acquisition Act 1894 to RFCTLARR 2013</h2>
      <p>The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013 replaced the colonial-era Land Acquisition Act, 1894. The new law addressed long-standing criticisms by incorporating consent requirements, Social Impact Assessment (SIA), enhanced compensation, and rehabilitation provisions.</p>
      
      <h3>Acquisition Procedure</h3>
      <p>The acquisition process under the 2013 Act includes: preliminary notification (Section 11), SIA and public hearing (Sections 4-9), consent requirement (80% for private projects, 70% for PPP projects), declaration and summary of rehabilitation plan (Section 19), compensation determination (Section 26-30), and possession (Section 38). The entire process must be completed within 42 months from the SIA notification.</p>
      
      <h3>Compensation Framework</h3>
      <p>The Act provides for market value determination based on the higher of: registered sale deeds, circle rates, or consented amounts for nearby properties. This is multiplied by a factor of 1-2 based on distance from urban areas. Additional amounts include 100% solatium, 12% per annum on market value from notification to award, and damages for standing crops or trees.</p>
      
      <h3>Judicial Interpretations</h3>
      <p>In Indore Development Authority v. Manoharlal (2020), the Supreme Court clarified that land acquisition proceedings would not lapse under Section 24(2) if compensation has been deposited in the treasury (rather than court) and landowners refused to accept it. In Delhi Development Authority v. Sukhbir Singh (2021), the court emphasized that acquisition for public purpose cannot be challenged merely on technical grounds after development has taken place.</p>
    `,
    tags: ['property law', 'land acquisition', 'RFCTLARR Act', 'compensation', 'rehabilitation', 'public purpose'],
    date: '2023-04-12',
    views: 3420,
    relatedArticles: [3, 8, 11]
  },
];

// More articles would be added in a real application

const LegalDocumentation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<'list' | 'article'>('list');
  const [selectedArticle, setSelectedArticle] = useState<typeof LEGAL_ARTICLES[0] | null>(null);
  
  // Get unique subcategories for the selected category
  const subcategories = selectedCategory 
    ? [...new Set(LEGAL_ARTICLES
        .filter(article => article.category === selectedCategory)
        .map(article => article.subcategory))]
    : [];
  
  // Get unique experience levels
  const levels = [...new Set(LEGAL_ARTICLES.map(article => article.level))];
  
  // Filter articles based on all criteria
  const filteredArticles = LEGAL_ARTICLES.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSubcategory = !subcategoryFilter || article.subcategory === subcategoryFilter;
    const matchesLevel = !levelFilter || article.level === levelFilter;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSubcategory && matchesLevel && matchesSearch;
  });
  
  // Handle article selection
  const handleArticleSelect = (article: typeof LEGAL_ARTICLES[0]) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo(0, 0);
  };
  
  // Handle back to list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
  };
  
  // Get related articles for the selected article
  const relatedArticles = selectedArticle
    ? LEGAL_ARTICLES.filter(article => selectedArticle.relatedArticles.includes(article.id))
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {currentView === 'list' ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
                  Legal Documentation
                </h1>
                <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
                  Comprehensive legal resources and guides to help you understand the Indian legal system
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar with categories and filters */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
                    <h3 className="font-medium text-lg mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Categories
                    </h3>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSubcategoryFilter(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition ${
                          !selectedCategory
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>All Categories</span>
                        <Badge variant="secondary">{LEGAL_ARTICLES.length}</Badge>
                      </button>
                      
                      {LEGAL_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSubcategoryFilter(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition ${
                            selectedCategory === category.id
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
                    <h3 className="font-medium text-lg mb-4 flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filters
                    </h3>
                    
                    {/* Subcategory filter */}
                    {selectedCategory && subcategories.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          Subcategory
                        </label>
                        <Select 
                          value={subcategoryFilter || "all"} 
                          onValueChange={(value) => setSubcategoryFilter(value === "all" ? null : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All subcategories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All subcategories</SelectItem>
                            {subcategories.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub.charAt(0).toUpperCase() + sub.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {/* Experience level filter */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Experience Level
                      </label>
                      <Select 
                        value={levelFilter || "all"} 
                        onValueChange={(value) => setLevelFilter(value === "all" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All levels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All levels</SelectItem>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Reset filters button */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSubcategoryFilter(null);
                        setLevelFilter(null);
                        setSearchQuery("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
                
                {/* Main content area */}
                <div className="lg:col-span-3">
                  {/* Search bar */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="text"
                      placeholder="Search legal documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  {/* Results count */}
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredArticles.length} results
                    {selectedCategory && (
                      <> for <span className="font-medium text-gray-700 dark:text-gray-300">
                        {LEGAL_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                      </span></>
                    )}
                    {subcategoryFilter && (
                      <> in <span className="font-medium text-gray-700 dark:text-gray-300">
                        {subcategoryFilter.charAt(0).toUpperCase() + subcategoryFilter.slice(1)}
                      </span></>
                    )}
                    {levelFilter && (
                      <> for <span className="font-medium text-gray-700 dark:text-gray-300">
                        {levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)} level
                      </span></>
                    )}
                  </div>
                  
                  {/* Articles list */}
                  {filteredArticles.length > 0 ? (
                    <div className="space-y-4">
                      {filteredArticles.map((article) => (
                        <Card key={article.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl hover:text-blue-600 cursor-pointer" onClick={() => handleArticleSelect(article)}>
                                  {article.title}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {article.description}
                                </CardDescription>
                              </div>
                              <Badge variant="secondary" className="text-xs capitalize">
                                {article.level}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {article.tags.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
                              <span>
                                {new Date(article.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span>{article.views.toLocaleString()} views</span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2 flex justify-end">
                            <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => handleArticleSelect(article)}>
                              Read More <ChevronRight size={16} className="ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No documents found matching your criteria</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSubcategoryFilter(null);
                          setLevelFilter(null);
                          setSearchQuery("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Article view
            selectedArticle && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <Button 
                  variant="ghost" 
                  className="mb-4 text-blue-600"
                  onClick={handleBackToList}
                >
                  <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                  Back to Documentation
                </Button>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">{selectedArticle.category}</Badge>
                    <Badge variant="secondary" className="capitalize">{selectedArticle.subcategory}</Badge>
                    <Badge variant="outline" className="capitalize">{selectedArticle.level}</Badge>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-lawxpert-navy dark:text-white mb-3">
                    {selectedArticle.title}
                  </h1>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span className="mr-4">
                      Published: {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span>{selectedArticle.views.toLocaleString()} views</span>
                  </div>
                  
                  <div className="prose prose-blue max-w-none dark:prose-invert" 
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
                  />
                </div>
                
                {/* Tags */}
                <div className="py-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium mb-3">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                {/* Related articles */}
                {relatedArticles.length > 0 && (
                  <div className="py-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium mb-4">Related Articles</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {relatedArticles.map(article => (
                        <Card key={article.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              <Button 
                                variant="link" 
                                className="p-0 h-auto text-left font-medium justify-start text-blue-600"
                                onClick={() => handleArticleSelect(article)}
                              >
                                {article.title}
                              </Button>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2 text-sm">
                            <p className="line-clamp-2 text-gray-600 dark:text-gray-300">
                              {article.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalDocumentation; 