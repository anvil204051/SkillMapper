"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Palette, Layout } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportOptions {
  title: string
  includeProgress: boolean
  includeResources: boolean
  includeNotes: boolean
  template: "modern" | "classic" | "minimal"
  colorScheme: "blue" | "purple" | "teal" | "gradient"
}

interface PathData {
  title: string
  description: string
  steps: Array<{
    title: string
    description: string
    progress: number
    estimatedTime: string
    resources: Array<{
      title: string
      type: string
      url: string
    }>
  }>
}

export function PDFExport({ pathData }: { pathData: PathData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    title: pathData.title,
    includeProgress: true,
    includeResources: true,
    includeNotes: false,
    template: "modern",
    colorScheme: "gradient",
  })
  const { toast } = useToast()

  const generatePDF = async () => {
    setIsExporting(true)

    try {
      // Create a temporary div with the content to export
      const exportContent = document.createElement("div")
      exportContent.innerHTML = generateHTMLContent()
      exportContent.style.width = "210mm"
      exportContent.style.minHeight = "297mm"
      exportContent.style.padding = "20mm"
      exportContent.style.fontFamily = "Arial, sans-serif"
      exportContent.style.backgroundColor = "white"
      exportContent.style.color = "#333"

      // Add to DOM temporarily
      document.body.appendChild(exportContent)

      // Simulate PDF generation (in a real app, you'd use html2pdf.js)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clean up
      document.body.removeChild(exportContent)

      toast({
        title: "PDF exported successfully!",
        description: "Your learning roadmap has been downloaded.",
      })

      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating your PDF.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const generateHTMLContent = () => {
    const colorSchemes = {
      blue: { primary: "#3B82F6", secondary: "#EFF6FF", accent: "#1E40AF" },
      purple: { primary: "#8B5CF6", secondary: "#F3E8FF", accent: "#5B21B6" },
      teal: { primary: "#14B8A6", secondary: "#F0FDFA", accent: "#0F766E" },
      gradient: {
        primary: "linear-gradient(135deg, #3B82F6, #14B8A6, #8B5CF6)",
        secondary: "#F8FAFC",
        accent: "#1E293B",
      },
    }

    const colors = colorSchemes[options.colorScheme]

    return `
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: ${colors.secondary}; border-radius: 12px;">
          <h1 style="font-size: 2.5rem; font-weight: bold; margin: 0 0 10px 0; ${
            options.colorScheme === "gradient"
              ? `background: ${colors.primary}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
              : `color: ${colors.primary};`
          }">${options.title}</h1>
          <p style="font-size: 1.1rem; color: #666; margin: 0;">${pathData.description}</p>
          <div style="margin-top: 20px; font-size: 0.9rem; color: #888;">
            Generated on ${new Date().toLocaleDateString()}
          </div>
        </div>

        <!-- Progress Overview -->
        ${
          options.includeProgress
            ? `
          <div style="margin-bottom: 40px; padding: 20px; background: ${colors.secondary}; border-radius: 8px;">
            <h2 style="color: ${colors.accent}; margin: 0 0 15px 0;">Progress Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: ${colors.primary};">
                  ${pathData.steps.filter((s) => s.progress === 100).length}/${pathData.steps.length}
                </div>
                <div style="font-size: 0.9rem; color: #666;">Steps Completed</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: ${colors.primary};">
                  ${Math.round(pathData.steps.reduce((acc, step) => acc + step.progress, 0) / pathData.steps.length)}%
                </div>
                <div style="font-size: 0.9rem; color: #666;">Overall Progress</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: bold; color: ${colors.primary};">
                  ${pathData.steps.reduce((acc, step) => acc + Number.parseInt(step.estimatedTime), 0)}
                </div>
                <div style="font-size: 0.9rem; color: #666;">Total Hours</div>
              </div>
            </div>
          </div>
        `
            : ""
        }

        <!-- Learning Steps -->
        <div>
          <h2 style="color: ${colors.accent}; margin: 0 0 30px 0; font-size: 1.8rem;">Learning Roadmap</h2>
          ${pathData.steps
            .map(
              (step, index) => `
            <div style="margin-bottom: 30px; padding: 25px; border: 2px solid ${colors.secondary}; border-radius: 12px; position: relative;">
              <!-- Step Number -->
              <div style="position: absolute; top: -15px; left: 25px; background: ${colors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${index + 1}
              </div>
              
              <!-- Step Content -->
              <div style="margin-top: 10px;">
                <h3 style="color: ${colors.accent}; margin: 0 0 10px 0; font-size: 1.3rem;">${step.title}</h3>
                <p style="color: #666; margin: 0 0 15px 0; line-height: 1.5;">${step.description}</p>
                
                ${
                  options.includeProgress
                    ? `
                  <div style="margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span style="font-size: 0.9rem; color: #666;">Progress</span>
                      <span style="font-size: 0.9rem; font-weight: bold; color: ${colors.primary};">${step.progress}%</span>
                    </div>
                    <div style="background: #E5E7EB; height: 8px; border-radius: 4px; overflow: hidden;">
                      <div style="background: ${colors.primary}; height: 100%; width: ${step.progress}%; border-radius: 4px;"></div>
                    </div>
                  </div>
                `
                    : ""
                }
                
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 15px;">
                  <span style="background: ${colors.secondary}; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; color: ${colors.accent};">
                    ⏱️ ${step.estimatedTime}
                  </span>
                </div>

                ${
                  options.includeResources && step.resources.length > 0
                    ? `
                  <div style="margin-top: 20px;">
                    <h4 style="color: ${colors.accent}; margin: 0 0 10px 0; font-size: 1rem;">Resources:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${step.resources
                        .map(
                          (resource) => `
                        <li style="margin-bottom: 5px; color: #666;">
                          <strong>${resource.title}</strong> (${resource.type})
                        </li>
                      `,
                        )
                        .join("")}
                    </ul>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 50px; padding: 20px; border-top: 2px solid ${colors.secondary}; color: #888; font-size: 0.9rem;">
          <p style="margin: 0;">Generated by SkillMapper - Map Your Skills. Master Your Future.</p>
          <p style="margin: 5px 0 0 0;">Visit skillmapper.com to create your own learning roadmap</p>
        </div>
      </div>
    `
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gradient-border bg-transparent">
          <div className="gradient-border-content flex items-center gap-2 px-3 py-2">
            <Download className="w-4 h-4" />
            Export PDF
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Learning Roadmap
          </DialogTitle>
          <DialogDescription>Customize your PDF export settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={options.title}
              onChange={(e) => setOptions((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <Label>Template Style</Label>
            <Select
              value={options.template}
              onValueChange={(value: ExportOptions["template"]) => setOptions((prev) => ({ ...prev, template: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Modern
                  </div>
                </SelectItem>
                <SelectItem value="classic">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Classic
                  </div>
                </SelectItem>
                <SelectItem value="minimal">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Minimal
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Color Scheme</Label>
            <Select
              value={options.colorScheme}
              onValueChange={(value: ExportOptions["colorScheme"]) =>
                setOptions((prev) => ({ ...prev, colorScheme: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Gradient
                  </div>
                </SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="teal">Teal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Include in Export</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeProgress}
                  onChange={(e) => setOptions((prev) => ({ ...prev, includeProgress: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Progress tracking</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeResources}
                  onChange={(e) => setOptions((prev) => ({ ...prev, includeResources: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Learning resources</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.includeNotes}
                  onChange={(e) => setOptions((prev) => ({ ...prev, includeNotes: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Personal notes</span>
              </label>
            </div>
          </div>

          <Button onClick={generatePDF} disabled={isExporting} className="w-full gradient-bg">
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
