import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';
import DynamicTranslation from './DynamicTranslation';
import TranslatedText from './TranslatedText';

/**
 * Example component demonstrating dynamic translation capabilities
 */
const ExampleDynamicContent: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [translateNow, setTranslateNow] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const { translateDynamic, detectLanguage } = useTranslation();
  const [manuallyTranslated, setManuallyTranslated] = useState('');
  
  const handleDetectLanguage = async () => {
    if (!userInput) return;
    
    const detected = await detectLanguage(userInput);
    setDetectedLanguage(detected);
  };
  
  const handleManualTranslation = async () => {
    if (!userInput) return;
    
    const translated = await translateDynamic(userInput);
    setManuallyTranslated(translated);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <TranslatedText textKey="dynamicTranslationDemo" as="span">
            Dynamic Translation Demo
          </TranslatedText>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">
            <TranslatedText textKey="enterText" as="span">
              Enter text to translate:
            </TranslatedText>
          </p>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type something here..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <p className="font-medium">
            <TranslatedText textKey="automaticTranslation" as="span">
              Automatic Translation:
            </TranslatedText>
          </p>
          
          {userInput && (
            <div className="p-3 bg-gray-50 rounded-md">
              {translateNow ? (
                <DynamicTranslation showOriginal>
                  {userInput}
                </DynamicTranslation>
              ) : (
                <p className="text-gray-400 italic">
                  <TranslatedText textKey="clickTranslate" as="span">
                    Click translate to see this text translated
                  </TranslatedText>
                </p>
              )}
            </div>
          )}
        </div>
        
        {detectedLanguage && (
          <div>
            <p className="text-sm">
              <TranslatedText textKey="detectedLanguage" as="span">
                Detected Language:
              </TranslatedText>{' '}
              <span className="font-semibold">{detectedLanguage}</span>
            </p>
          </div>
        )}
        
        {manuallyTranslated && (
          <div className="space-y-2">
            <p className="font-medium">
              <TranslatedText textKey="manualTranslation" as="span">
                Manual Translation:
              </TranslatedText>
            </p>
            <div className="p-3 bg-blue-50 rounded-md">
              <p>{manuallyTranslated}</p>
              <p className="text-xs text-gray-500 mt-1">(Original: {userInput})</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleDetectLanguage}
          disabled={!userInput}
        >
          <TranslatedText textKey="detectLanguage" as="span">
            Detect Language
          </TranslatedText>
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={handleManualTranslation}
            disabled={!userInput}
          >
            <TranslatedText textKey="manuallyTranslate" as="span">
              Manually Translate
            </TranslatedText>
          </Button>
          
          <Button
            variant="default"
            onClick={() => setTranslateNow(true)}
            disabled={!userInput}
          >
            <TranslatedText textKey="translate" as="span">
              Translate
            </TranslatedText>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExampleDynamicContent; 