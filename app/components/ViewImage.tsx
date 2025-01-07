import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { generateCloudinaryUrl } from "~/lib/utils";

const ViewImage = ({ public_id }: { public_id: string }) => {
  return (
    <>
      <img
        src={generateCloudinaryUrl(public_id, "ar_1.5,c_crop,w_800,h_100")}
        alt="Ticket image"
        className="mx-auto"
      />
      <Dialog>
        <DialogTrigger asChild>
          <div className="absolute inset-0 cursor-pointer bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Button variant={"outline"} type="button" size={"sm"}>
              View
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="flex justify-center items-center">
          <DialogHeader className="hidden">
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {public_id && <img src={generateCloudinaryUrl(public_id)} alt="Ticket image" />}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewImage;
