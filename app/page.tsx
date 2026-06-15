import Image from "next/image";
import { BrainCogIcon, EyeOffIcon, GlobeIcon, MonitorSmartphoneIcon, ServerCogIcon, ZapIcon } from "lucide-react"
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Store your PDF Documents",
    description: "keep all your important PDF files securely stored and easily accessible anyTime, anywhere.",
    icon: GlobeIcon
  },
  {
    name: "Blazing fast Responses",
    description: "Experience light-fast answer to your queries(prompts), ensuring you get the information you need instantly ",
    icon: ZapIcon
  },
  {
    name: "Chat Memorisation",
    description: "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience",
    icon: BrainCogIcon
  },
  {
    name: "Interactive pdf Viewer",
    description: "Engage with your PDFs like never before using our intuitive and interactive viewer. ",
    icon: EyeOffIcon
  },
  {
    name: "Cloud Backup",
    description: "kRest assured knowing your documents are safely backed up on the cloud, protected from loss damage.",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive Across Devices",
    description: "Access and chat with your PDFs seamlessly on any device, weather its your desktop, tablet, or smartphone",
    icon: MonitorSmartphoneIcon
  }
]

export default function Home() {
  return (
    <main className="flex-1 overflow-y-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-blue-400">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-700">
              Your Interactive Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform your PDFs into interactive Conversation
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-sky-700">Chat with PDFs</span>
              <br />
              <br />
              Upload your document, and our chatbot will answer questions, summarize content, and answer all your Qs. Ideal for everyone, 
              <span>dynamic conversations</span>
              enhancing productivity 10x fold effortlessly
            </p>
          </div>

          <Button asChild className=" mt-10">
            <Link href="/dashboard" >
              Get Started
            </Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-x-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
            width={2432}
            height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:mt-px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div className="relative ">

              <dt className=" inline font-semibold text-gray-900">
              <feature.icon aria-hidden="true" className="absolute left top-1 h-5 w-5 text-sky-700" />
                </dt>

                <dd className="pl-9">{ feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
