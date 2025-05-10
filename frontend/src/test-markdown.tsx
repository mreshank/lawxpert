import { useState } from 'react';
import ChatMessage from './components/ChatMessage';

const TestMarkdown = () => {
  const [formattedMessage, setFormattedMessage] = useState(true);
  
  // This is exactly the content from the screenshot
  const markdownContent = `How to File an FIR (First Information Report)

Understanding an FIR
An FIR (First Information Report) is a written document prepared by the police when they receive information about the commission of a cognizable offence. A cognizable offence is one where the police can arrest without a warrant and start an investigation without the permission of the court. Examples include serious crimes like murder, rape, theft, etc.

#### Steps to File an FIR

1. Go to the Nearest Police Station
: The FIR should be filed in the police station under whose jurisdiction the crime was committed. If you are unsure, you can go to the nearest police station, and they will guide you.

2. Provide Oral Information
: Inform the police about the crime. You can either verbally explain the incident or submit a written complaint.

3. Drafting the FIR
: The police will write down the information you provide. This is your statement, and it forms the basis of the FIR.
- Details to Include:
- Date, time, and location of the incident.
- Names and descriptions of persons involved (if known).
- The sequence of events as they happened.
- Any evidence available (like documents, CCTV footage, etc.).

4. Read the FIR Carefully
: Once the police prepare the document, read it thoroughly to ensure that all details are correct before signing it.
- If there are any mistakes, ask for corrections before signing.

5. Sign the FIR
: After ensuring that all details are correct, sign the FIR. If you cannot write, your thumb impression can be taken.

6. Get a Copy
: By law, you are entitled to a free copy of the FIR. Always take your copy and keep it safe for future reference.

#### Key Rights and Considerations

    Zero FIR: If the crime was not committed in the jurisdiction of the police station you are at, they can register a "Zero FIR". This means the FIR is transferred to the appropriate police station later.

- Refusal to Register FIR: If the police refuse to register the complaint, you can:
  - Approach the Superintendent of Police or other higher authorities.
  - File a complaint to the Judicial Magistrate under Section 156(3) of CrPC.
  - File a writ petition in the High Court.

**IMPORTANT**: Filing a false FIR is a punishable offense under Section 182 of the Indian Penal Code.`;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Markdown Formatting Test</h1>
      
      <div className="mb-4">
        <button 
          onClick={() => setFormattedMessage(!formattedMessage)} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Toggle Formatting
        </button>
      </div>
      
      <div className="border rounded-lg p-4">
        {formattedMessage ? (
          <ChatMessage 
            content={markdownContent} 
            role="assistant" 
            timestamp={new Date()} 
          />
        ) : (
          <pre className="whitespace-pre-wrap">{markdownContent}</pre>
        )}
      </div>
    </div>
  );
};

export default TestMarkdown; 