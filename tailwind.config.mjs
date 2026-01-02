import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	safelist: [
		{
			pattern:
				/^(bg|text|border|ring)-(primary|secondary|destructive|muted|accent|popover|card|input|background|foreground)(-foreground)?(\/\d+)?$/,
			variants: ["hover", "focus", "dark"],
		},
		{
			pattern:
				/^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|px)$/,
			variants: ["hover", "focus", "sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern:
				/^(w|h|min-w|min-h|max-w|max-h)-(0|px|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|auto|full|screen|min|max|fit)$/,
			variants: ["hover", "sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern:
				/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
		},
		{
			pattern:
				/^(flex|inline-flex|grid|inline-grid|block|inline-block|inline|hidden)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern:
				/^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap|1|auto|initial|none)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern:
				/^(items|justify)-(start|end|center|between|around|evenly|stretch|baseline)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|none)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^grid-rows-(1|2|3|4|5|6|none)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^col-span-(1|2|3|4|5|6|7|8|9|10|11|12|full)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/,
			variants: ["hover"],
		},
		{
			pattern: /^border(-0|-2|-4|-8)?$/,
			variants: ["hover", "focus"],
		},
		{
			pattern:
				/^(opacity|scale)-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100|105|110|125|150)$/,
			variants: ["hover"],
		},
		{
			pattern: /^shadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?$/,
			variants: ["hover"],
		},
		{
			pattern:
				/^(overflow|overflow-x|overflow-y)-(auto|hidden|clip|visible|scroll)$/,
		},
		{
			pattern: /^(static|fixed|absolute|relative|sticky)$/,
		},
		{
			pattern: /^z-(0|10|20|30|40|50|auto)$/,
		},
		{
			pattern:
				/^cursor-(auto|default|pointer|wait|text|move|help|not-allowed)$/,
			variants: ["hover"],
		},
		{
			pattern: /^pointer-events-(none|auto)$/,
		},
		{
			pattern: /^select-(none|text|all|auto)$/,
		},
		{
			pattern: /^transition(-all|-colors|-opacity|-shadow|-transform|-none)?$/,
		},
		{
			pattern: /^duration-(75|100|150|200|300|500|700|1000)$/,
		},
		{
			pattern: /^ease-(linear|in|out|in-out)$/,
		},
		{
			pattern:
				/^animate-(none|spin|ping|pulse|bounce|accordion-down|accordion-up)$/,
		},
		{
			pattern:
				/^(leading|tracking)-(none|tight|snug|normal|relaxed|loose|3|4|5|6|7|8|9|10)$/,
		},
		{
			pattern:
				/^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$/,
		},
		{
			pattern: /^text-(left|center|right|justify|start|end)$/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
		{
			pattern: /^(underline|overline|line-through|no-underline)$/,
			variants: ["hover"],
		},
		{
			pattern: /^underline-offset-(0|1|2|4|8|auto)$/,
		},
		{
			pattern: /^aspect-(auto|square|video)$/,
		},
		{
			pattern: /^(shrink|grow)(-0|-1)?$/,
		},
		{
			pattern: /^basis-(0|1|2|3|4|5|6|7|8|9|10|11|12|auto|px|full)$/,
		},
		{
			pattern: /^outline(-none|-0|-1|-2|-4|-8)?$/,
			variants: ["focus", "focus-visible"],
		},
		{
			pattern: /^ring(-0|-1|-2|-4|-8|-inset)?$/,
			variants: ["focus", "focus-visible"],
		},
		{
			pattern: /^ring-offset-(0|1|2|4|8)$/,
			variants: ["focus", "focus-visible"],
		},
	],
	plugins: [tailwindcssAnimate],
};

export default config;
