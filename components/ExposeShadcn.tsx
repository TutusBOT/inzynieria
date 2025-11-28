"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

export default function ExposeShadcn() {
	useEffect(() => {
		try {
			// Use safer typing instead of `any`
			const win = window as unknown as Window & {
				__shadcn?: Record<string, unknown>;
			};

			// Base map
			const shadcnMap: Record<string, unknown> = {
				Button,
				Input,
				Label,
				Checkbox,
				Tabs,
				TabsList,
				TabsTrigger,
				TabsContent,
				Accordion,
				AccordionItem,
				AccordionTrigger,
				AccordionContent,
			};

			win.__shadcn = shadcnMap;

			// Attach properties so code using Tabs.List or Accordion.Item works
			const maybeTabs = (win.__shadcn?.Tabs ?? null) as unknown;
			const maybeAccordion = (win.__shadcn?.Accordion ?? null) as unknown;

			if (maybeTabs && typeof maybeTabs === "function") {
				// assign properties on the function object using unknown -> Record
				const tabsObj = maybeTabs as unknown as Record<string, unknown>;
				tabsObj.List = win.__shadcn?.TabsList ?? TabsList;
				tabsObj.Trigger = win.__shadcn?.TabsTrigger ?? TabsTrigger;
				tabsObj.Content = win.__shadcn?.TabsContent ?? TabsContent;
			}

			if (maybeAccordion && typeof maybeAccordion === "function") {
				const accObj = maybeAccordion as unknown as Record<string, unknown>;
				accObj.Item = win.__shadcn?.AccordionItem ?? AccordionItem;
				accObj.Trigger = win.__shadcn?.AccordionTrigger ?? AccordionTrigger;
				accObj.Content = win.__shadcn?.AccordionContent ?? AccordionContent;
			}
		} catch {
			// ignore in non-browser environments
		}
	}, []);

	return null;
}
