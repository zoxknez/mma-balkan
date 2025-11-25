import * as React from "react"
import { Switch as HeadlessSwitch } from "@headlessui/react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof HeadlessSwitch>,
  Omit<React.ComponentPropsWithoutRef<typeof HeadlessSwitch>, "onChange"> & {
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <HeadlessSwitch
    checked={checked ?? false}
    onChange={onCheckedChange || (() => {})}
    ref={ref}
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[unchecked]:bg-input",
      className
    )}
    {...props}
  >
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0"
      )}
    />
  </HeadlessSwitch>
))
Switch.displayName = "Switch"

export { Switch }
