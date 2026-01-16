import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function FormFields() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="syllabus_text" className="text-base font-semibold">Syllabus Text</Label>
        <Textarea
          id="syllabus_text"
          name="syllabus_text"
          placeholder="Paste your syllabus here..."
          className="min-h-[150px] resize-y bg-background"
        />
        <p className="text-sm text-muted-foreground">Or upload a file below.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file" className="text-base font-semibold">Syllabus File (PDF/TXT)</Label>
        <Input id="file" name="file" type="file" accept=".pdf,.txt" className="bg-background" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-base font-semibold">Exam Type</Label>
          <Select name="exam_type" defaultValue="Semester">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Internal">Internal</SelectItem>
              <SelectItem value="Semester">Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="time_value" className="text-base font-semibold">Time</Label>
            <Input id="time_value" name="time_value" type="number" defaultValue="7" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Unit</Label>
            <Select name="time_unit" defaultValue="days">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
