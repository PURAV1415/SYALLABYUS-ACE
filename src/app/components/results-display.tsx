'use client';

import { useState, useEffect } from 'react';
import type { GenerateSyllabusTiersOutput } from '@/ai/flows/generate-syllabus-tiers-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, ShieldAlert, NotebookText, Award, ClipboardList, CheckSquare, Layers, RotateCw, Download, Share2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

interface ResultsDisplayProps {
  result: GenerateSyllabusTiersOutput;
  onShare?: () => void;
}

const tierConfig = {
  tier1: {
    icon: <Medal className="h-5 w-5 text-accent" />,
    title: 'Tier 1: Top Priority',
    style: 'bg-accent/10 border-accent/20',
  },
  tier2: {
    icon: <Award className="h-5 w-5 text-primary" />,
    title: 'Tier 2: Secondary Focus',
    style: 'bg-primary/10 border-primary/20',
  },
  tier3: {
    icon: <ClipboardList className="h-5 w-5 text-muted-foreground" />,
    title: 'Tier 3: Best Effort',
    style: 'bg-muted/50 border-muted',
  },
};

type TierKey = keyof typeof tierConfig;

function Flashcard({ card }: { card: { question: string; answer: string } }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="[perspective:1000px] w-full h-48" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={cn(
          'relative h-full w-full rounded-xl shadow-md transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card p-4 text-center [backface-visibility:hidden]">
          <div>
            <p className="text-sm text-muted-foreground">Question</p>
            <p className="font-semibold text-lg">{card.question}</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-accent/20 p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
           <div>
            <p className="text-sm text-muted-foreground">Answer</p>
            <p className="font-semibold text-lg">{card.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ResultsDisplay({ result, onShare }: ResultsDisplayProps) {
  const tiers = (Object.keys(tierConfig) as TierKey[]).filter(
    tier => result[tier] && (result[tier] as string[]).length > 0
  );
  const firstTier = tiers.length > 0 ? tiers[0] : undefined;

  const [activeTab, setActiveTab] = useState('syllabus');
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const checklistItems = result.hourly_checklist || [];
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  useEffect(() => {
    // Only reset on first load, preserve state on subsequent renders
    if (Object.keys(checkedState).length === 0 && progress === 0) {
      setFlashcardIndex(0);
    }
  }, []);

  const handleCheckboxChange = (id: string) => {
    const newCheckedState = {
      ...checkedState,
      [id]: !checkedState[id],
    };
    setCheckedState(newCheckedState);

    const totalItems = checklistItems.length;
    if (totalItems > 0) {
      const completedItems = Object.values(newCheckedState).filter(Boolean).length;
      setProgress((completedItems / totalItems) * 100);
    }
  };
  
  const flashcards = result.flashcards || [];

  const nextCard = () => {
    setFlashcardIndex(prev => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlashcardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 10;
    const lineHeight = 5;
    const margin = 10;
    
    // Title
    pdf.setFontSize(20);
    pdf.text('Study Plan - SyllabusAce', margin, yPosition);
    yPosition += 15;
    
    // Progress
    if (checklistItems.length > 0) {
      pdf.setFontSize(12);
      pdf.text(`Study Progress: ${Math.round(progress)}%`, margin, yPosition);
      yPosition += 8;
    }
    
    // Syllabus Tiers
    pdf.setFontSize(14);
    pdf.text('Syllabus Tiers', margin, yPosition);
    yPosition += 8;
    
    tiers.forEach(tier => {
      const config = tierConfig[tier];
      const topics = result[tier] as string[];
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(config.title, margin + 5, yPosition);
      yPosition += 6;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      topics.forEach((topic) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        const wrappedText = pdf.splitTextToSize(`• ${topic}`, pageWidth - margin * 2 - 5);
        pdf.text(wrappedText, margin + 8, yPosition);
        yPosition += wrappedText.length * lineHeight + 2;
      });
      yPosition += 3;
    });
    
    // Checklist if exists
    if (checklistItems.length > 0) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Study Checklist', margin, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      checklistItems.forEach((item) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        const status = checkedState[`checklist-${checklistItems.indexOf(item)}`] ? '✓' : '○';
        const wrappedText = pdf.splitTextToSize(`${status} ${item.time_slot}: ${item.topic}`, pageWidth - margin * 2 - 8);
        pdf.text(wrappedText, margin + 8, yPosition);
        yPosition += wrappedText.length * lineHeight + 2;
      });
      yPosition += 3;
    }
    
    // Risk Analysis
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFontSize(14);
    pdf.text('Risk Analysis', margin, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(10);
    pdf.text(`Overall Risk: ${result.risk_analysis.overall_risk}`, margin + 5, yPosition);
    yPosition += 6;
    
    if (result.risk_analysis.high_risk_if_skipped.length > 0) {
      pdf.setFontSize(10);
      pdf.text('High Risk Topics if Skipped:', margin + 5, yPosition);
      yPosition += 6;
      result.risk_analysis.high_risk_if_skipped.forEach((topic) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        const wrappedText = pdf.splitTextToSize(`• ${topic}`, pageWidth - margin * 2 - 10);
        pdf.text(wrappedText, margin + 10, yPosition);
        yPosition += wrappedText.length * lineHeight + 2;
      });
    }
    
    pdf.save("study-plan.pdf");
  };

  return (
    <ScrollArea className="h-full">
      <div className="pr-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          {checklistItems.length > 0 && (
            <div className="flex-1">
              <Label className="text-lg font-headline">Your Progress</Label>
              <div className="flex items-center gap-4 mt-2">
                <Progress value={progress} className="flex-1" />
                <span className="text-lg font-bold text-primary whitespace-nowrap">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
          <div className="flex gap-2 w-full md:w-auto">
            <Button type="button" onClick={handleDownload} className="flex-1 md:flex-initial bg-green-600 hover:bg-green-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {onShare && (
              <Button type="button" onClick={onShare} variant="outline" className="flex-1 md:flex-initial border-blue-500 text-blue-600 hover:bg-blue-50">
                <Share2 className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="syllabus" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="syllabus">Syllabus Tiers</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="revision">Quick Revision</TabsTrigger>
          </TabsList>
          
          <TabsContent value="syllabus" className="mt-4">
            <Accordion type="multiple" className="w-full space-y-4">
              {tiers.map(tier => {
                const config = tierConfig[tier];
                const topics = result[tier] as string[];
                return (
                  <AccordionItem key={tier} value={tier} className={`rounded-lg border ${config.style}`}>
                    <AccordionTrigger className="px-4 py-3 font-headline text-lg hover:no-underline">
                      <div className="flex items-center gap-3">
                        {config.icon}
                        <span>{config.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ul className="list-disc space-y-2 pl-5 text-base text-foreground/80">
                        {topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          <TabsContent value="checklist" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <CheckSquare className="h-6 w-6 text-primary" />
                  Study Checklist
                </CardTitle>
                <CardDescription>
                  Follow this plan and check off items as you complete them.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {checklistItems.map((item, index) => {
                  const id = `checklist-${index}`;
                  return (
                    <div key={id} className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${checkedState[id] ? 'bg-accent/10' : 'bg-card'}`}>
                      <Checkbox
                        id={id}
                        checked={!!checkedState[id]}
                        onCheckedChange={() => handleCheckboxChange(id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={id} className={`font-medium cursor-pointer ${checkedState[id] ? 'line-through text-muted-foreground' : ''}`}>
                          <span className="font-bold">{item.time_slot}:</span> {item.topic}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Layers className="h-6 w-6 text-primary" />
                  Flashcards
                </CardTitle>
                <CardDescription>Click a card to flip it. Use the buttons to navigate.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {flashcards.length > 0 ? (
                  <>
                    <Flashcard card={flashcards[flashcardIndex]} />
                    <div className="flex items-center justify-between">
                       <Button type="button" variant="outline" onClick={prevCard}>Previous</Button>
                       <span className="text-sm text-muted-foreground">
                        Card {flashcardIndex + 1} of {flashcards.length}
                       </span>
                       <Button type="button" variant="outline" onClick={nextCard}>Next</Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center">No flashcards generated.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                  Analysis & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm md:text-base">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Overall Recommendation</h3>
                  <p className="text-muted-foreground mt-1">{result.recommendation}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">Risk Analysis</h3>
                  <p><strong className="text-destructive">Overall Risk:</strong> {result.risk_analysis.overall_risk}</p>
                  <div>
                    <h4 className="font-semibold text-destructive">High Risk if Skipped:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.risk_analysis.high_risk_if_skipped.map((topic, index) => (
                        <Badge key={index} variant="destructive">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                  <p><strong className="text-foreground/80">Notes:</strong> {result.risk_analysis.notes}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revision" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <NotebookText className="h-6 w-6 text-primary" />
                  Quick Revision Notes
                </CardTitle>
                <CardDescription>Key points for last-minute review.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.quick_revision).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="font-semibold text-primary">{key}</h3>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">{String(value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
