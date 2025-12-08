// This file exists solely so Tailwind's content scanner picks up dynamic class names
// used by the shadcn components (cva variants, data- attributes, etc.).
// Do not import or execute this file at runtime; it's safe to keep it as a passive
// string that contains the classes Tailwind should preserve during build.

const _TAILWIND_SAFELIST = `
/* button */
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
bg-primary text-primary-foreground hover:bg-primary/90
bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60
border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50
bg-secondary text-secondary-foreground hover:bg-secondary/80
hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50
text-primary underline-offset-4 hover:underline
h-9 px-4 py-2 has-[>svg]:px-3
h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5
h-10 rounded-md px-6 has-[>svg]:px-4
size-9 size-8 size-10

/* badge */
inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1

/* card */
bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6
leading-none font-semibold
text-muted-foreground text-sm

/* avatar */
relative flex size-8 shrink-0 overflow-hidden rounded-full
aspect-square size-full
bg-muted flex size-full items-center justify-center rounded-full

/* tabs */
flex flex-col gap-2
bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]
inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm
flex-1 outline-none

/* accordion */
border-b last:border-b-0
flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline
data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm
pt-0 pb-4

/* utilities + common */
text-sm text-gray-500 text-red-500 text-muted-foreground text-foreground bg-white bg-gray-50 dark:bg-zinc-900 dark:bg-zinc-950
p-4 rounded shadow-sm
w-full h-full border
`;

export default null;
