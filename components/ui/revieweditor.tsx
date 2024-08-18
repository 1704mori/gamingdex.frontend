import { useState, useEffect } from "react";
import { Textarea } from "./textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { markdownToHtml } from "@/lib/utils";

interface ReviewEditorProps {
  onChange?: (html: string) => void;
  value?: string;
  preview?: boolean;
  reload?: boolean;
}

const ReviewEditor: React.FC<ReviewEditorProps> = ({
  onChange,
  value = "",
  preview = false,
  reload = true,
}) => {
  const [content, setContent] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(reload);

  useEffect(() => {
    if (isInitialLoad) {
      setContent(
        value.includes("<") && value.includes(">")
          ? htmlToMarkdown(value)
          : value,
      );
      setIsInitialLoad(false);
    }
  }, [value, isInitialLoad]);

  useEffect(() => setIsInitialLoad(reload), [reload]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  const htmlToMarkdown = (html: string): string => {
    return html
      .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
      .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
      .replace(/<em>(.*?)<\/em>/g, "*$1*")
      .replace(/<u>(.*?)<\/u>/g, "_$1_")
      .replace(/<del>(.*?)<\/del>/g, "~~$1~~")
      .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, "$2")
      .trim();
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="self-end">
        <TooltipProvider delayDuration={10}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="font-medium cursor-help text-sm text-neutral-400 dark:text-neutral-600">
                Formatting
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold text-sm">Examples:</p>
              <div className="flex items-center gap-1">
                <strong className="text-neutral-400 dark:text-neutral-400">
                  example
                </strong>
                <p>- **example**</p>
              </div>
              <div className="flex items-center gap-1">
                <em className="text-neutral-400 dark:text-neutral-400">
                  example
                </em>
                <p>- *example*</p>
              </div>
              <div className="flex items-center gap-1">
                <u className="text-neutral-400 dark:text-neutral-400">
                  example
                </u>
                <p>- _example_</p>
              </div>
              <div className="flex items-center gap-1">
                <del className="text-neutral-400 dark:text-neutral-400">
                  example
                </del>
                <p>- ~~example~~</p>
              </div>
              <div className="flex items-center gap-1">
                <a href="https://gamingdex.net" target="_blank">
                  example
                </a>
                <p>- [example](gamingdex.net)</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-2 rounded-md border border-neutral-200 shadow-sm dark:border-neutral-800">
        <Textarea
          rows={7}
          maxRows={40}
          value={content}
          onChange={handleInput}
          placeholder="Write your review here"
        />
        {preview && (
          <div className="mt-4 pt-4 border-t border-neutral-200 shadow-sm dark:border-neutral-800">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <div className="w-full max-h-28 overflow-y-scroll">
              <div
                className="prose dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(content),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewEditor;
