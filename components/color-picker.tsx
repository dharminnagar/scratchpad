'use client';

import { Portal } from '@ark-ui/react/portal';
import {
  ColorPicker as ArkColorPicker,
  parseColor,
} from '@ark-ui/react/color-picker';
import { PipetteIcon } from 'lucide-react';
import { Palette } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onReset: () => void;
}

const thumbCls =
  'absolute w-3 h-3 bg-white border-2 border-black rounded-full shadow-sm -translate-x-1/2 -translate-y-1/2';

export function ColorPicker({ color, onChange, onReset }: ColorPickerProps) {
  return (
    <ArkColorPicker.Root
      value={parseColor(color || '#000000')}
      onValueChange={(details) => onChange(details.value.toString('hex'))}
    >
      <ArkColorPicker.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group/toggle extend-touch-target size-8 hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent"
          onContextMenu={(e) => {
            e.preventDefault();
            onReset();
          }}
          title={
            color
              ? `Text color: ${color} — right-click to reset`
              : 'Set text color'
          }
        >
          <Palette
            className="size-4 transition-colors duration-150"
            style={{ color: color || undefined }}
          />
          <span className="sr-only">Set text color</span>
        </Button>
      </ArkColorPicker.Trigger>

      <Portal>
        <ArkColorPicker.Positioner>
          <ArkColorPicker.Content
            className={cn(
              'bg-popover text-popover-foreground border border-border',
              'rounded-lg p-4 shadow-lg space-y-4 z-50 w-72'
            )}
          >
            {/* Saturation/lightness area */}
            <ArkColorPicker.Area className="w-full h-36 rounded-md overflow-hidden relative">
              <ArkColorPicker.AreaBackground className="w-full h-full" />
              <ArkColorPicker.AreaThumb className={thumbCls} />
            </ArkColorPicker.Area>

            {/* Eyedropper + hue/alpha sliders */}
            <div className="flex items-center gap-3">
              <ArkColorPicker.EyeDropperTrigger
                className={cn(
                  'p-2 text-muted-foreground hover:text-foreground',
                  'border border-border rounded-md hover:bg-muted transition-colors'
                )}
              >
                <PipetteIcon className="w-4 h-4" />
              </ArkColorPicker.EyeDropperTrigger>

              <div className="flex-1 space-y-2">
                {/* Hue */}
                <ArkColorPicker.ChannelSlider
                  channel="hue"
                  className="relative w-full h-3 rounded-full overflow-hidden"
                >
                  <ArkColorPicker.ChannelSliderTrack
                    className="w-full h-full"
                    style={{
                      background:
                        'linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))',
                    }}
                  />
                  <ArkColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 bg-white border-2 border-black rounded-full shadow-sm -translate-y-1/2 -translate-x-1/2" />
                </ArkColorPicker.ChannelSlider>

                {/* Alpha */}
                <ArkColorPicker.ChannelSlider
                  channel="alpha"
                  className="relative w-full h-3 rounded-full overflow-hidden"
                >
                  <ArkColorPicker.TransparencyGrid className="w-full h-full [--size:6px]" />
                  <ArkColorPicker.ChannelSliderTrack className="w-full h-full" />
                  <ArkColorPicker.ChannelSliderThumb className="absolute top-1/2 w-3 h-3 bg-white border-2 border-black rounded-full shadow-sm -translate-y-1/2 -translate-x-1/2" />
                </ArkColorPicker.ChannelSlider>
              </div>
            </div>

            {/* Hex + alpha inputs */}
            <div className="flex gap-2">
              <ArkColorPicker.ChannelInput
                channel="hex"
                className={cn(
                  'flex-1 px-3 py-1.5 text-xs font-mono',
                  'border border-border rounded-md bg-background text-foreground',
                  'focus:outline-none focus:ring-1 focus:ring-ring'
                )}
              />
              <ArkColorPicker.ChannelInput
                channel="alpha"
                className={cn(
                  'w-14 px-3 py-1.5 text-xs font-mono',
                  'border border-border rounded-md bg-background text-foreground',
                  'focus:outline-none focus:ring-1 focus:ring-ring'
                )}
              />
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={onReset}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              reset to default
            </button>
          </ArkColorPicker.Content>
        </ArkColorPicker.Positioner>
      </Portal>

      <ArkColorPicker.HiddenInput />
    </ArkColorPicker.Root>
  );
}
