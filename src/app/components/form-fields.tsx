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
          placeholder="Paste your syllabus here or upload a file..."
          className="min-h-[150px] resize-y bg-background"
          required={false}
        />
        <p className="text-sm text-muted-foreground">Paste your syllabus content here. You can also upload a PDF or TXT file instead.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file" className="text-base font-semibold">Upload Syllabus (PDF/TXT)</Label>
        <Input 
          id="file" 
          name="file" 
          type="file" 
          accept=".pdf,.txt" 
          className="bg-background"
          required={false}
        />
        <p className="text-sm text-muted-foreground">Upload a file (max 5MB). Either paste text above or upload a file.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exam_type" className="text-base font-semibold">Exam Type</Label>
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
            <Label htmlFor="time_value" className="text-base font-semibold">Study Time</Label>
            <Input 
              id="time_value" 
              name="time_value" 
              type="number" 
              defaultValue="7" 
              min="1"
              className="bg-background" 
              required={true}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time_unit" className="text-base font-semibold">Unit</Label>
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
