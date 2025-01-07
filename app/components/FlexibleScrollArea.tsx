import { ScrollArea } from "~/components/ui/scroll-area";

type ScrollProps = {
  content: string;
  maxHeight?: string;
};

const FlexibleScrollArea = ({ content, maxHeight = "h-60" }: ScrollProps) => {
  return (
    <div className={`relative max-${maxHeight}`}>
      <ScrollArea className="h-full">
        <div className="pr-4" dangerouslySetInnerHTML={{ __html: content }} />
      </ScrollArea>
    </div>
  );
};

export default FlexibleScrollArea;
