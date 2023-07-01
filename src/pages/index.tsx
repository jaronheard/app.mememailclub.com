import {
  EnvelopeIcon,
  PencilSquareIcon,
  LightBulbIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import Img from "../components/Img";
import Link from "next/link";
import FAQ from "../components/FAQ";
import clsx from "clsx";
import { trackGoal } from "fathom-client";
import Button from "../components/Button";

function Hero() {
  return (
    <section id="hero" className="relative lg:-mt-16 ">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-48 lg:pb-56 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-5xl font-extrabold tracking-tighter">
              <span className="text-indigo">p</span>
              <span className="text-[#2385F8]">o</span>
              <span className="text-[#FC5825]">s</span>
              <span className="text-[#FE0760]">t</span>
              <span className="text-black">postcard</span>
            </h1>
            <div className="hidden sm:mt-32 sm:flex lg:mt-16">
              <div className="rounded-full relative py-1 px-3 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                To celebrate our launch, send a postcard for only $1.{" "}
                <Link
                  href="/send"
                  className="whitespace-nowrap font-semibold text-indigo-600"
                  onClick={() => trackGoal("I2ZG7PYC", 0)}
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  Get started <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
              Big postcard energy
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Send a huge 6&quot; x 9&quot; postcard to your friends and family,
              and add a custom message. All without touching pen or paper!
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button href="/send" onClick={() => trackGoal("OZWMBFXQ", 0)}>
                Get started
              </Button>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <Link
          href="/send"
          className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0"
        >
          <Img
            className="aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src="https://res.cloudinary.com/jaronheard/image/upload/v1672891693/mail/postcards_2_ywp9uz.png"
            alt="Postcard sample"
            width="1800"
            height="1200"
          />
        </Link>
      </div>
    </section>
  );
}

const features = [
  {
    name: "Send postcards",
    description:
      "Send a postcard to anyone in the US. Write and send the postcard all online. Simple and fun!",
    href: "/send",
    icon: EnvelopeIcon,
    comingSoon: false,
    cta: "Get started",
    onClick: () => trackGoal("CCZIQ5SJ", 0),
  },
  {
    name: "Create postcards",
    description:
      "Create postcard designs for your personal use, or share your designs with the world.",
    href: "/items/new",
    icon: PencilSquareIcon,
    comingSoon: false,
    cta: "Create yours",
    onClick: () => null,
  },
  {
    name: "Custom projects",
    description:
      "Postcard subscriptions of recent memes? Choose-your-own-adventure by postcard? We can build it!",
    href: "/contact",
    icon: LightBulbIcon,
    comingSoon: false,
    cta: "Contact us",
    onClick: () => null,
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Creativity & connection
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Digital tools for physical mail
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We want the physicality of a postcard, something more than a text
              message. We want the convenience of doing it all online. We want
              to put fun back in the mail!
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-5 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <Link
                        href={feature.href}
                        className={clsx("text-sm font-semibold leading-6", {
                          "text-indigo-600": !feature.comingSoon,
                          "text-gray-400": feature.comingSoon,
                        })}
                        onClick={feature.onClick}
                      >
                        {feature.cta}{" "}
                        {!feature.comingSoon && (
                          <span aria-hidden="true">→</span>
                        )}
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section id="testimonial" className="lg:p-x8 py-24 px-6 sm:py-32">
      <figure className="mx-auto max-w-2xl">
        <p className="sr-only">5 out of 5 stars</p>
        <div className="flex gap-x-1 text-indigo-600">
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
        </div>
        <blockquote className="mt-10 text-xl font-semibold leading-8 tracking-tight text-gray-900 sm:text-2xl sm:leading-9">
          <p>
            {`Love the email postcard Jaron sent me... it's my
            favorite thing on my fridge! It's more than an email, it's a piece of art!”`}
          </p>
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-x-6">
          <Img
            className="rounded-full h-12 w-12 bg-gray-50"
            src="https://res.cloudinary.com/jaronheard/image/upload/v1678756698/IMG_1800_ndeyn5.heic"
            alt="Eric Benedon"
            height="96"
            width="96"
          />
          <div className="text-sm leading-6">
            <div className="font-semibold text-gray-900">Eric Benedon</div>
            <div className="mt-0.5 text-gray-600">
              Program Director at Snowdays Foundation
            </div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

function CTAFooter() {
  return (
    <section id="cta-footer">
      <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Delight your friends.
            <br />
            Send your first postcard today!
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Send a huge 6&quot; x 9&quot; postcard for only $1 for a limited
            time!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href="/send" onClick={() => trackGoal("HAEWFYCR", 0)}>
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="relative -mx-6 -mt-6 overflow-hidden bg-transparent pb-32">
      <Hero />
      <Features />
      <Testimonial />
      <FAQ />
      <CTAFooter />
    </div>
  );
};

export default Index;
