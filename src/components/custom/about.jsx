import { Typography } from "@/components/custom/typography";
import Image from "next/image";
import IMAGES from "../../app/assets/images.constant";

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Image
            src={IMAGES.roomFinding}
            alt="People searching rental rooms"
            width={500}
            height={500}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>

        <div>
          <Typography variant="h1" className="block mb-4">
            About Us
          </Typography>

          <Typography variant="paraPrimary" className="block mb-4">
            Making room hunting simple, transparent, and stress-free.
          </Typography>

          <Typography variant="paraPrimary" className="block mb-4">
            Welcome to <strong>Rental Rooms</strong> — your trusted platform for
            finding affordable, verified, and comfortable rental spaces. Whether
            you're a student, working professional, or traveler, we help you
            find the perfect place without any hassle.
          </Typography>

          <Typography variant="paraPrimary" className="block mb-4">
            Our mission is to connect room owners and tenants through a smooth
            and reliable platform. Instead of wasting hours browsing random
            listings or negotiating with brokers, Rental Rooms gives you a
            simple and secure experience with filtered results and updated
            availability.
          </Typography>

          <Typography variant="paraPrimary" className="block mb-4">
            We believe in transparency. Every listing includes images, budget
            range, and amenities — so you know exactly what you're getting
            before you visit.
          </Typography>
          <Typography
            variant="paraPrimary"
            className="block mb-4 text-red-500 text-center"
          >
            <strong> **No middlemen. No hidden extra charge.**</strong>
          </Typography>
          <Typography variant="paraPrimary" className="block font-semibold">
            Find your perfect stay — comfort & convenience at your fingertips.
          </Typography>
        </div>
      </div>
    </section>
  );
}
