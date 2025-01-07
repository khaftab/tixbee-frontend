import React, { useState, useEffect } from "react";
import { Progress } from "~/components/ui/progress";

interface ImageUploadProgressBarProps {
  fetcherState: "idle" | "loading" | "submitting";
}

const ImageUploadProgressBar: React.FC<ImageUploadProgressBarProps> = ({ fetcherState }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (fetcherState === "submitting") {
      setProgress(25);
    } else if (fetcherState === "loading") {
      setProgress(75);
    } else if (fetcherState === "idle") {
      setProgress(progress === 75 ? 100 : 0);
    }
  }, [fetcherState]); // Add progress to dependencies

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);
  if (progress === 0) return null;
  return <Progress value={progress} className="h-1 mb-3" />;
};

export default ImageUploadProgressBar;
