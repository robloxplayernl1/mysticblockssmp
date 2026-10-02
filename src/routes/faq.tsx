import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { faqQuery } from "@/lib/queries";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "Veelgestelde vragen · BlokCraft" },
    { name: "description", content: "Antwoorden op veelgestelde vragen over BlokCraft." },
    { property: "og:title", content: "Veelgestelde vragen · BlokCraft" },
    { property: "og:description", content: "Antwoorden op veelgestelde vragen over BlokCraft." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FaqPage,
});

function FaqPage() {
  const { data, isLoading, isError } = useQuery(faqQuery);
  return <SiteLayout><section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
    <h1 className="text-3xl sm:text-5xl font-bold text-glow text-center mb-10">Veelgestelde vragen</h1>
    {isLoading && <p className="text-center text-muted-foreground">Laden...</p>}
    {isError && <p className="text-center text-destructive">Vragen konden niet worden geladen.</p>}
    {!isLoading && !isError && !data?.length && <p className="text-center text-muted-foreground">Er zijn nog geen vragen toegevoegd.</p>}
    <Accordion type="single" collapsible className="divide-y divide-border border-y border-border">
      {data?.map((item) => <AccordionItem key={item.id} value={item.id}>
        <AccordionTrigger className="text-left text-base sm:text-lg">{item.question}</AccordionTrigger>
        <AccordionContent className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words">{item.answer}</AccordionContent>
      </AccordionItem>)}
    </Accordion>
  </section></SiteLayout>;
}