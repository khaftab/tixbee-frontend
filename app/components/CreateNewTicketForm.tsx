import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "@remix-run/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import CustomFormField from "./CustomFormField";
import { ticketCategory } from "~/lib/utils";
import { ticketSchema } from "~/lib/zodValidationSchema";
import { ToastErrorType, useToastError } from "~/hooks/useToastError";
import { TicketResult } from "~/types/types";

// Define strict types for the component props
interface TicketFormProps {
  mode: "create" | "edit";
  ticket?: TicketResult;
}

// Define interface for file upload state
interface FileUploadState {
  thumbnail: boolean;
  ticket: boolean;
}

// Define interface for form values
type FormValues = z.infer<typeof ticketSchema>;

const CreateNewTicketForm = ({ mode, ticket }: TicketFormProps) => {
  const fetcher = useFetcher();
  const isEdit = mode === "edit";

  // State management with proper typing
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    thumbnail: false,
    ticket: false,
  });
  const [uploadingStates, setUploadingStates] = useState({
    thumbnail: false,
    ticket: false,
  });

  useToastError(fetcher.data as ToastErrorType);

  // Dynamic schema generation based on file upload state
  const getValidationSchema = () => {
    let schema = ticketSchema;

    if (!fileUploadState.thumbnail && !fileUploadState.ticket && isEdit) {
      return schema.omit({ thumbnail: true, ticket: true });
    }
    if (fileUploadState.thumbnail && !fileUploadState.ticket) {
      return schema.omit({ ticket: true });
    }
    if (!fileUploadState.thumbnail && fileUploadState.ticket) {
      return schema.omit({ thumbnail: true });
    }
    return schema;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(getValidationSchema()),
    mode: "onTouched",
    defaultValues: {
      title: ticket?.title ?? "",
      price: ticket?.price ? String(ticket.price) : "",
      category: ticket?.category ?? "conference",
      thumbnail: undefined,
      ticket: undefined,
      thumbnailImagePublicId: ticket?.thumbnailImagePublicId ?? "",
      ticketImagePublicId: ticket?.ticketImagePublicId ?? "",
      description: ticket?.description ?? "",
    },
  });
  console.log("from erroe", form.formState.errors);
  const handleSubmit = (values: FormValues) => {
    const formData = new FormData();

    // Helper function to append form data
    const appendToForm = (key: string, value: string) => {
      formData.append(key, value);
    };

    // Handle image public IDs for edit mode
    if (isEdit) {
      const handleEditImages = () => {
        if (fileUploadState.thumbnail) {
          appendToForm("thumbnailImagePublicId", values.thumbnailImagePublicId);
          appendToForm("oldThumbnailImagePublicId", ticket!.thumbnailImagePublicId);
        } else {
          appendToForm("thumbnailImagePublicId", ticket!.thumbnailImagePublicId);
        }

        if (fileUploadState.ticket) {
          appendToForm("ticketImagePublicId", values.ticketImagePublicId);
          appendToForm("oldTicketImagePublicId", ticket!.ticketImagePublicId);
        } else {
          appendToForm("ticketImagePublicId", ticket!.ticketImagePublicId);
        }
      };

      handleEditImages();
      appendToForm("id", ticket!.id);
    } else {
      appendToForm("thumbnailImagePublicId", values.thumbnailImagePublicId);
      appendToForm("ticketImagePublicId", values.ticketImagePublicId);
    }

    // Common fields
    appendToForm("title", values.title);
    appendToForm("price", values.price.toString());
    appendToForm("category", values.category);
    appendToForm("description", values.description);

    fetcher.submit(formData, {
      method: isEdit ? "PUT" : "POST",
      action: "/tickets/new",
      encType: "multipart/form-data",
    });
  };

  const isSubmitting =
    fetcher.state === "submitting" || uploadingStates.thumbnail || uploadingStates.ticket;

  return (
    <div className="mx-2">
      <Card className="mx-auto max-w-xl w-full my-7 faded-bg bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Ticket</CardTitle>
          <CardDescription>{isEdit ? "Edit ticket" : "Create a new ticket"}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
              <CustomFormField
                form={form}
                name="title"
                label="Title"
                placeholder="React Conf 2024"
              />

              <CustomFormField form={form} name="price" label="Price" placeholder="100" />
              <div className="!mb-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ticketCategory).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <CustomFormField
                form={form}
                name="thumbnail"
                label="Thumbnail"
                type="file"
                placeholder="Browse or drop file here"
                savedImage={ticket?.thumbnailImagePublicId}
                hasInputFileClicked={fileUploadState}
                setHasInputFileClicked={setFileUploadState}
                isThumbnailImageUploading={(val: boolean) =>
                  setUploadingStates((prev) => ({ ...prev, thumbnail: val }))
                }
              />

              <CustomFormField
                form={form}
                name="ticket"
                label="Ticket image"
                type="file"
                placeholder="Browse or drop file here"
                savedImage={ticket?.ticketImagePublicId}
                hasInputFileClicked={fileUploadState}
                setHasInputFileClicked={setFileUploadState}
                isTicketImageUploading={(val: boolean) =>
                  setUploadingStates((prev) => ({ ...prev, ticket: val }))
                }
              />

              <CustomFormField
                form={form}
                name="description"
                label="Description"
                type="editor"
                placeholder="Enter a description"
              />
              {/* After invalid image selection, a request is made to clear the fetcher.data. So, the submit is disabled for a momment when the clear request is made. To counter that, below check is added. */}
              <Button
                type="submit"
                disabled={isSubmitting && Object.keys(form.formState.errors).length === 0}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewTicketForm;
