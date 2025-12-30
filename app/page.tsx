import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container-islamic section-spacing">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading text-primary">
              Web Masjid
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern masjid web application with Islamic-inspired design system
            </p>
          </div>

          {/* Design System Demo */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Colors Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Color Palette</CardTitle>
                <CardDescription>
                  Islamic-inspired color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary"></div>
                    <span className="text-sm">Primary (Emerald)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-secondary"></div>
                    <span className="text-sm">Secondary (Gold)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-accent"></div>
                    <span className="text-sm">Accent (Deep Blue)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Typography</CardTitle>
                <CardDescription>
                  Arabic-friendly fonts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-heading text-lg">Heading Font (Amiri/Cairo)</p>
                  <p className="font-body text-sm text-muted-foreground">
                    Body Font (Inter)
                  </p>
                </div>
                <div className="arabic text-sm">
                  <p>نص عربي - Arabic Text Support</p>
                </div>
              </CardContent>
            </Card>

            {/* Components Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Components</CardTitle>
                <CardDescription>
                  shadcn/ui components ready
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge>Badge</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Button</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="pattern-islamic">
            <CardHeader>
              <CardTitle className="font-heading">Design Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Mobile-first responsive (90% users akan pakai HP)</li>
                <li>✓ High contrast for readability (penting untuk jamaah usia lanjut)</li>
                <li>✓ Large touch targets (min 44x44px)</li>
                <li>✓ Generous whitespace</li>
                <li>✓ Islamic geometric patterns (subtle)</li>
                <li>✓ Smooth animations (60fps)</li>
                <li>✓ Dark mode optimized for night prayers</li>
                <li>✓ RTL support ready (untuk teks Arab)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
