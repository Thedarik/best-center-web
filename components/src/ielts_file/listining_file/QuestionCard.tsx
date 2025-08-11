"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'true-false' | 'gap-filling';
  question: string;
  options?: string[];
  correctAnswer: string;
  passage?: string;
  gapText?: string; // For gap-filling format
  gapNumbers?: number[]; // Which gaps this question covers
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  allAnswers?: Record<number, string>; // For gap-filling display
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
  allAnswers = {}
}: QuestionCardProps) => {

  const renderGapFillingText = (text: string, gapNumbers: number[]) => {
    let processedText = text;
    
    // Replace [N] format gaps with input fields
    gapNumbers.forEach((gapNum) => {
      const gapPattern = new RegExp(`\\[${gapNum}\\]`, 'g');
      const inputValue = allAnswers[gapNum] || '';
      const inputField = `<input class="gap-input" data-gap="${gapNum}" value="${inputValue}" placeholder="${gapNum}" />`;
      processedText = processedText.replace(gapPattern, inputField);
    });
    
    return processedText;
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'gap-filling':
        return (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
              <p className="font-medium text-ielts-dark mb-2">Complete the notes below.</p>
              <p className="text-sm text-ielts-red font-medium">
                Choose <span className="font-bold">ONE WORD ONLY</span> from the passage for each answer.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Write your answers in boxes <span className="font-medium text-ielts-red">1-{question.gapNumbers?.length || 0}</span> on your answer sheet.
              </p>
            </div>

            {/* Gap-filling text */}
            {question.gapText && question.gapNumbers && (
              <div className="p-6 border-2 border-muted rounded-lg bg-background">
                <h3 className="text-lg font-bold text-ielts-red mb-4 text-center">
                  {question.question}
                </h3>
                
                <div className="space-y-4">
                  {question.gapText.split('\n\n').map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      {section.includes(':') && (
                        <h4 className="font-bold text-ielts-red mb-2">
                          {section.split(':')[0]}:
                        </h4>
                      )}
                      
                      <div 
                        className="text-base leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: renderGapFillingText(section, question.gapNumbers || [])
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gap input fields */}
            <div className="space-y-3">
              <h4 className="font-semibold text-ielts-dark">Gap Answers:</h4>
              {question.gapNumbers?.map((gapNum) => (
                <div key={gapNum} className="flex items-center space-x-3">
                  <Label htmlFor={`gap-${gapNum}`} className="w-8 text-center font-bold text-ielts-red">
                    {gapNum}.
                  </Label>
                  <Input
                    id={`gap-${gapNum}`}
                    type="text"
                    value={allAnswers[gapNum] || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    placeholder={`Answer for gap ${gapNum}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium text-ielts-dark">{question.question}</p>
            <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'fill-in-the-blank':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium text-ielts-dark">{question.question}</p>
            <Input
              type="text"
              value={selectedAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Your answer here..."
              className="w-full"
            />
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-4">
            <p className="text-lg font-medium text-ielts-dark">{question.question}</p>
            <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="text-base">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="text-base">False</Label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-ielts-dark">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <Badge variant="outline" className="border-ielts-red text-ielts-red">
            {question.type.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderQuestion()}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
