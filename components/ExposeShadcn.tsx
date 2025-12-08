"use client";

import { useEffect } from "react";
import * as UI from "@/components/ui";
import type React from "react";

export default function ExposeShadcn() {
	useEffect(() => {
		try {
			// Expose the entire UI module under window.__shadcn so preview can import components by name
			const win = window as unknown as Window & {
				__shadcn?: Record<string, unknown>;
			};

			// Cast the imported UI barrel to a typed lookup for element types
			const uiLib = UI as unknown as Record<string, React.ElementType>;

			win.__shadcn = uiLib as Record<string, unknown>;

			// Attach common subcomponent properties so patterns like Tabs.List or Accordion.Item work
			const maybe = win.__shadcn ?? {};

			if ((maybe["Tabs"] as unknown) && typeof maybe["Tabs"] === "function") {
				const tabsObj = maybe["Tabs"] as unknown as Record<string, unknown>;
				tabsObj.List = maybe["TabsList"] ?? uiLib["TabsList"];
				tabsObj.Trigger = maybe["TabsTrigger"] ?? uiLib["TabsTrigger"];
				tabsObj.Content = maybe["TabsContent"] ?? uiLib["TabsContent"];
			}

			if (
				(maybe["Accordion"] as unknown) &&
				typeof maybe["Accordion"] === "function"
			) {
				const accObj = maybe["Accordion"] as unknown as Record<string, unknown>;
				accObj.Item = maybe["AccordionItem"] ?? uiLib["AccordionItem"];
				accObj.Trigger = maybe["AccordionTrigger"] ?? uiLib["AccordionTrigger"];
				accObj.Content = maybe["AccordionContent"] ?? uiLib["AccordionContent"];
			}

			if (
				(maybe["Avatar"] as unknown) &&
				typeof maybe["Avatar"] === "function"
			) {
				const avObj = maybe["Avatar"] as unknown as Record<string, unknown>;
				avObj.Image = maybe["AvatarImage"] ?? uiLib["AvatarImage"];
				avObj.Fallback = maybe["AvatarFallback"] ?? uiLib["AvatarFallback"];
			}

			if ((maybe["Card"] as unknown) && typeof maybe["Card"] === "function") {
				const cardObj = maybe["Card"] as unknown as Record<string, unknown>;
				cardObj.Header = maybe["CardHeader"] ?? uiLib["CardHeader"];
				cardObj.Title = maybe["CardTitle"] ?? uiLib["CardTitle"];
				cardObj.Description =
					maybe["CardDescription"] ?? uiLib["CardDescription"];
				cardObj.Content = maybe["CardContent"] ?? uiLib["CardContent"];
				cardObj.Footer = maybe["CardFooter"] ?? uiLib["CardFooter"];
				cardObj.Action = maybe["CardAction"] ?? uiLib["CardAction"];
			}
		} catch {
			// ignore on server
		}
	}, []);

	return null;
}
