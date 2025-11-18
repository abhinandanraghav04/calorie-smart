"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Copy, Check } from "lucide-react";

export default function DesignSystem() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);

  const showToast = (type: "success" | "error" | "info" | "default") => {
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} toast`,
      description: `This is a ${type} toast notification message.`,
      type,
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-6 py-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A showcase of UI primitives, components, and patterns.
        </p>
      </div>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Colors</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <ColorCard
            name="Primary"
            className="bg-primary text-primary-foreground"
            hex="#3b82f6"
          />
          <ColorCard
            name="Secondary"
            className="bg-secondary text-secondary-foreground"
            hex="#f1f5f9"
          />
          <ColorCard
            name="Accent"
            className="bg-accent text-accent-foreground"
            hex="#f97316"
          />
          <ColorCard
            name="Destructive"
            className="bg-destructive text-destructive-foreground"
            hex="#ef4444"
          />
          <ColorCard
            name="Muted"
            className="bg-muted text-muted-foreground"
            hex="#f1f5f9"
          />
          <ColorCard
            name="Background"
            className="bg-background text-foreground border"
            hex="#ffffff"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Typography</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <code className="text-muted-foreground mt-2 block text-xs">
                text-4xl font-bold
              </code>
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <code className="text-muted-foreground mt-2 block text-xs">
                text-3xl font-semibold
              </code>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <code className="text-muted-foreground mt-2 block text-xs">
                text-2xl font-semibold
              </code>
            </div>
            <div>
              <p className="text-base">
                Body text: The quick brown fox jumps over the lazy dog. This is
                a sample paragraph demonstrating the default body text style.
              </p>
              <code className="text-muted-foreground mt-2 block text-xs">
                text-base
              </code>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Muted text: Secondary information or less important details.
              </p>
              <code className="text-muted-foreground mt-2 block text-xs">
                text-sm text-muted-foreground
              </code>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Buttons</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                Default
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">👍</Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                Variants
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-3 text-sm font-medium">
                States
              </p>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Cards</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>This is a basic card component.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Cards are versatile containers for grouping related content.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Highlighted Card</CardTitle>
              <CardDescription>With a subtle primary accent.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Use background colors to draw attention to important
                information.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Cards can contain actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Add buttons or other interactive elements.
              </p>
              <Button size="sm" variant="outline">
                Learn more
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Form Controls</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input</label>
              <Input placeholder="Enter your text here..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Input (disabled)</label>
              <Input disabled placeholder="Disabled input" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select</label>
              <Select defaultValue="option1">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select (disabled)</label>
              <Select disabled>
                <option>Disabled select</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Modal</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="text-muted-foreground text-sm">
              Click the button below to open a modal dialog with smooth
              animations.
            </p>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Toasts</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <p className="text-muted-foreground text-sm">
              Click the buttons below to trigger toast notifications.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="default" onClick={() => showToast("default")}>
                Default Toast
              </Button>
              <Button variant="default" onClick={() => showToast("success")}>
                Success Toast
              </Button>
              <Button variant="destructive" onClick={() => showToast("error")}>
                Error Toast
              </Button>
              <Button variant="outline" onClick={() => showToast("info")}>
                Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        description="This is a demonstration of the modal component with smooth animations."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        }
      >
        <p>
          Modals are great for focusing user attention on critical information
          or actions. They support animations and respect reduced motion
          preferences.
        </p>
      </Modal>
    </div>
  );
}

function ColorCard({
  name,
  className,
  hex,
}: {
  name: string;
  className: string;
  hex: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-24 ${className}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <CardDescription className="text-xs">{hex}</CardDescription>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={copy}
            aria-label="Copy color code"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
