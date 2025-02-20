import {ArrowRight} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
      <div className="min-h-screen w-screen flex flex-col">
        <section className="bg-primary text-primary-foreground py-24 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">AI Coding Agent</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Experience real-time code generation with AI-powered assistance. Write, preview, and deploy code instantly
            through natural language.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link href="/demo">
              Start Coding <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex justify-center items-center">
              <div className="justify-center items-center gap-12 mb-16 rounded-full shadow-xl inline-flex px-10">
                <div className="flex items-center gap-2 text-lg font-medium">
                    <Link href="https://www.cerebrium.ai">
                      <Image
                          src="/cerebrium-logo.svg"
                          alt="Cerebrium"
                          width={200}
                          height={60}
                          className="rounded-lg"
                      />
                    </Link>
                </div>
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Link href="https://e2b.dev">
                  <Image
                      src="/e2b-logo.svg"
                      alt="E2B"
                      width={70}
                      height={60}
                      className="rounded-lg"
                  />
                  </Link>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-8">Project Overview</h2>

            <div className="space-y-6 text-lg max-w-3xl mx-auto">
              <p>
                Transform your development workflow with our AI coding assistant that combines natural language
                understanding with real-time code generation. Simply describe what you want to build, and watch as your
                ideas come to life with instant code previews.
              </p>
              <p>
                Built with Next.js for the frontend, FastAPI for the backend, and powered by advanced AI models, this
                system provides an intuitive interface for generating, previewing, and deploying code - all through
                natural conversation.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto bg-gray-950 text-gray-400 py-6 px-4">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2025 Cerebrium. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Button variant="link" className="text-current p-0" asChild>
                <Link href="">
                  <span className="ml-2">Source Code</span>
                </Link>
              </Button>
              <Button variant="link" className="text-current p-0" asChild>
                <Link href="/blog">Blog Post</Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>
  )
}