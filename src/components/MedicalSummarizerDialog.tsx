import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const MedicalSummarizerDialog: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [summary, setSummary] = useState("");
  const [simplified, setSimplified] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOriginalText("");
      setSummary("");
      setSimplified("");
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:8000/api/summarizer/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setOriginalText(res.data.original_text);
      setSummary(res.data.summary);
      setSimplified(res.data.simplified);

      toast({
        title: "Success",
        description: "Medical report summarized successfully.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message || "Failed to summarize",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>🩺 Medical Report Summarizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="application/pdf" onChange={handleFileChange} />

        <Button onClick={handleSummarize} disabled={!file || loading}>
          {loading ? "Summarizing..." : "Summarize"}
        </Button>

        {originalText && (
          <>
            <h3 className="text-lg font-semibold">Extracted Text</h3>
            <Textarea value={originalText} readOnly rows={6} />
          </>
        )}

        {summary && (
          <>
            <h3 className="text-lg font-semibold">Summary</h3>
            <Textarea value={summary} readOnly rows={4} />
          </>
        )}

        {simplified && (
          <>
            <h3 className="text-lg font-semibold">Simplified Summary</h3>
            <Textarea value={simplified} readOnly rows={4} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalSummarizerDialog;
