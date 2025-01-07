import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqItems = [
  {
    value: "item-1",
    question: "How do I purchase a ticket?",
    answer: "Browse through the tickets and proceed to checkout or wait in the queue.",
  },
  {
    value: "item-2",
    question: "What payment methods are accepted?",
    answer: "We accept major credit cards like Visa, Mastercard for secure transactions.",
  },
  {
    value: "item-3",
    question: "How do I receive my tickets after purchase?",
    answer: "Your tickets will be available in your orders page as a downloadable e-ticket.",
  },
  {
    value: "item-4",
    question: "Can I get a refund if I can't attend the event?",
    answer: "No. All sales are final. However, you can resell your ticket on our platform.",
  },
];

const FAQ = () => {
  return (
    <section className="backdrop-blur-[2px] px-4 py-5 rounded-lg border border-border min-h-[22.5rem]">
      <div>
        <h2 className="text-2xl font-bold text-center mb-4 font-inter-regular">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="max-w-lg mx-auto">
        {faqItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="hover:no-underline text-foreground font-medium text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
