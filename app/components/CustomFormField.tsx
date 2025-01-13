import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/hooks/use-toast";
import ImageUploadProgressBar from "./ImageUploadProgressBar";
import ViewImage from "./ViewImage";
import RichTextEditor from "./Editor";
import { undefined } from "zod";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  savedImage?: string;
  hasInputFileClicked?: {
    thumbnail: boolean;
    ticket: boolean;
  };
  setHasInputFileClicked?: React.Dispatch<
    React.SetStateAction<{
      thumbnail: boolean;
      ticket: boolean;
    }>
  >;
  isThumbnailImageUploading?: (value: boolean) => void;
  isTicketImageUploading?: (value: boolean) => void;
}

const CustomFormField = ({
  form,
  name,
  label,
  placeholder,
  type,
  savedImage,
  hasInputFileClicked,
  setHasInputFileClicked,
  isThumbnailImageUploading,
  isTicketImageUploading,
}: FormFieldProps) => {
  const [isFirstFocus, setIsFirstFocus] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<{ public_id: string; context: string; status: number }>();
  const uploadingRef = useRef(false);

  // Handle upload status changes
  useEffect(() => {
    const isUploading = fetcher.state !== "idle";

    // Only update if the status has changed
    if (uploadingRef.current !== isUploading) {
      uploadingRef.current = isUploading;

      if (name === "thumbnail" && isThumbnailImageUploading) {
        isThumbnailImageUploading(isUploading);
      }
      if (name === "ticket" && isTicketImageUploading) {
        isTicketImageUploading(isUploading);
      }
    }
  }, [fetcher.state, name, isThumbnailImageUploading, isTicketImageUploading]);

  // Handle successful upload
  useEffect(() => {
    if (fetcher.data?.public_id) {
      form.setValue(`${name}ImagePublicId`, fetcher.data.public_id);
    }
    if (fetcher.data && fetcher.data.status !== 201) {
      toast({
        title: "Error",
        description: "Error uploading image",
        variant: "destructive",
      });
      form.setValue(name, undefined);
      form.trigger(name);
      fetcher.submit(null, { method: "PUT", action: "/api/upload-to-cloudinary" });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // clearing the file input. Otherwise, the same file will not trigger onChange event.
      }
    }
  }, [fetcher.data, form, name]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      form.setValue(name, undefined);
      await form.trigger(name);
      fetcher.submit(null, { method: "PUT", action: "/api/upload-to-cloudinary" });
      return;
    }

    form.setValue(name, file);
    await form.trigger(name);

    if (form.formState.errors[name]) {
      form.setValue(`${name}ImagePublicId`, "");

      // Submitting a PUT request just to clear fetcher.data. Othewise, the image will be shown in the UI during the next upload.
      fetcher.submit(null, { method: "PUT", action: "/api/upload-to-cloudinary" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("context", name);

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/upload-to-cloudinary",
      encType: "multipart/form-data",
    });
  };

  const handleInputFocus = () => {
    setIsFirstFocus(true);
    if (setHasInputFileClicked) {
      setHasInputFileClicked((prev) => ({ ...prev, [name]: true }));
    }
    // Below line will prevent the error message from showing up on first focus (before even selecting files).
    if (!isFirstFocus) return;
    setTimeout(() => {
      // without settimeout, it shows a flash of the error message
      form.trigger(name);
    }, 200);
  };

  if (type === "editor") {
    return (
      <div className="grid gap-2">
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-2 flex-1">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor={`${name}-input`}>{label}</FormLabel>
            <FormControl>
              {type === "file" ? (
                <Input
                  id={`${name}-input`}
                  placeholder={placeholder}
                  type="file"
                  accept="image/*"
                  multiple={false}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  onFocus={handleInputFocus}
                />
              ) : (
                <Input
                  id={`${name}-input`}
                  placeholder={placeholder}
                  {...field}
                  type={type || "text"}
                />
              )}
            </FormControl>
            <div className="min-h-[20px]">
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      {type === "file" && (
        <div className="relative">
          {!form.formState.errors[name] && <ImageUploadProgressBar fetcherState={fetcher.state} />}
          {/* @ts-ignore */}
          {savedImage && hasInputFileClicked && !hasInputFileClicked[name] && (
            <ViewImage public_id={savedImage} />
          )}
          {fetcher.data?.public_id && !form.formState.errors[name] && (
            <ViewImage public_id={fetcher.data.public_id} />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomFormField;
