'use client';

import { useState, useEffect } from 'react';
import type { GenerateSyllabusTiersOutput } from '@/ai/flows/generate-syllabus-tiers-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, ShieldAlert, NotebookText, Award, ClipboardList, CheckSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ResultsDisplayProps {
  result: GenerateSyllabusTiersOutput;
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

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const tiers = (Object.keys(tierConfig) as TierKey[]).filter(
    tier => result[tier] && (result[tier] as string[]).length > 0
  );
  const firstTier = tiers.length > 0 ? tiers[0] : undefined;

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const checklistItems = result.hourly_checklist || [];

  useEffect(() => {
    setCheckedState({});
    setProgress(0);
  }, [result]);

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

  return (
    <ScrollArea className="h-full">
      <div className="pr-4">
        {checklistItems.length > 0 && (
          <div className="mb-6">
            <Label className="text-lg font-headline">Your Progress</Label>
            <div className="flex items-center gap-4 mt-2">
              <Progress value={progress} className="w-full" />
              <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        <Tabs defaultValue="syllabus" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="syllabus">Syllabus Tiers</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="revision">Quick Revision</TabsTrigger>
          </TabsList>
          
          <TabsContent value="syllabus" className="mt-4">
            <Accordion type="single" collapsible defaultValue={firstTier} className="w-full space-y-4">
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
