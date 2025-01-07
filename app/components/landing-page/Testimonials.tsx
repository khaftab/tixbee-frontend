import { cn } from "~/lib/utils";
import Marquee from "~/components/Marquee";

const reviews = [
  {
    name: "Sammy",
    username: "@sammy",
    body: "Smooth and easy process! Got my tickets without a hitch.",
    img: "https://avatar.iran.liara.run/public/14",
  },
  {
    name: "Smith",
    username: "@smith",
    body: "Finally a place where I feel secure buying and selling tickets!",
    img: "https://avatar.iran.liara.run/public/24",
  },
  {
    name: "Rehan",
    username: "@rehan_31",
    body: "The queue system worked perfectly. No stress!",
    img: "https://avatar.iran.liara.run/public/41",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Got my tickets without worrying about scalpers. Love it!",
    img: "https://avatar.iran.liara.run/public/37",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "Easy, reliable, and fair. Best ticket platform by far",
    img: "https://avatar.iran.liara.run/public/33",
  },
  {
    name: "Jarred",
    username: "@jarred",
    body: "Sold my tickets in minutes! Couldn't be easier.",
    img: "https://avatar.iran.liara.run/public/46",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Testimonials = () => {
  return (
    <>
      <div className="w-full rounded-lg border border-border px-3 py-4 md:py-6 faded-bg h-[350pxx] mx-auto overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </>
  );
};

export default Testimonials;
